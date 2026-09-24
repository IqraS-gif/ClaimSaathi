"""Prepare & Claim route."""
from __future__ import annotations
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, File, UploadFile, Form
from typing import Optional
from bson import ObjectId

from app.db.mongo import claims_col
from app.models.schemas import ClaimRequest, ClaimResponse
from app.services.claim_preparer import (
    build_checklist, calculate_readiness_score, auto_fill_form,
    get_rejection_advice, REQUIRED_DOCS, TRACKING_STAGES,
)
from app.services.bill_simulator import simulate_claim_split, extract_bill_amount_from_text

router = APIRouter()


@router.post("/simulate")
async def simulate_claim(
    bill_file: Optional[UploadFile] = File(None),
    policy_file: Optional[UploadFile] = File(None),
    total_bill: Optional[float] = Form(200000.0),
    room_rent_limit: Optional[str] = Form("₹3,000/day"),
    co_pay_percent: Optional[float] = Form(10.0),
    sum_insured: Optional[float] = Form(500000.0),
):
    """Simulates financial split between insurance payable and out-of-pocket."""
    detected_bill = total_bill or 200000.0
    detected_patient = "Rahul Verma"
    detected_claim = "CLM-2026-88412"
    detected_hospital = "Fortis Memorial Research Institute, Gurugram"

    if bill_file:
        try:
            content = await bill_file.read()
            if bill_file.content_type == "application/pdf":
                import pdfplumber, io, re
                with pdfplumber.open(io.BytesIO(content)) as pdf:
                    text = "".join(page.extract_text() or "" for page in pdf.pages[:3])
                    detected_bill = extract_bill_amount_from_text(text)
                    m_pat = re.search(r"Patient\s*(?:Name)?[:\s]+([A-Za-z\s]+)", text, re.I)
                    if m_pat and len(m_pat.group(1).strip()) > 2:
                        detected_patient = m_pat.group(1).split("\n")[0].strip()
                    m_hosp = re.search(r"(?:Hospital|Institute|Medical\s*Center)[:\s]+([A-Za-z\s,]+)", text, re.I)
                    if m_hosp and len(m_hosp.group(1).strip()) > 2:
                        detected_hospital = m_hosp.group(1).split("\n")[0].strip()
        except Exception as e:
            print(f"[Simulator] Parse notice: {e}")

    result = simulate_claim_split(
        total_bill=detected_bill,
        room_rent_limit=room_rent_limit or "₹3,000/day",
        co_pay_percent=co_pay_percent or 10.0,
        sum_insured=sum_insured or 500000.0,
        patient_name=detected_patient,
        claim_id=detected_claim,
        hospital_name=detected_hospital,
    )
    return result


@router.post("", response_model=ClaimResponse)
async def prepare_claim(req: ClaimRequest):
    checklist, missing = build_checklist(req)
    total_required = len(REQUIRED_DOCS.get(req.claim_type, REQUIRED_DOCS["reimbursement"]))
    readiness_score = calculate_readiness_score(missing, total_required)
    form_data = auto_fill_form(req)
    advice = get_rejection_advice(req.rejection_reason)

    doc = {
        "request":         req.model_dump(),
        "readiness_score": readiness_score,
        "status":          "prepared",
        "checklist":       [c.model_dump() for c in checklist],
        "missing_docs":    missing,
        "auto_filled_form": form_data,
        "tracking_stages": TRACKING_STAGES,
        "advice":          advice,
        "created_at":      datetime.now(timezone.utc),
    }
    result = await claims_col().insert_one(doc)
    claim_id = str(result.inserted_id)

    return ClaimResponse(
        claim_id=claim_id,
        readiness_score=readiness_score,
        status="prepared",
        checklist=checklist,
        missing_docs=missing,
        auto_filled_form=form_data,
        tracking_stages=TRACKING_STAGES,
        advice=advice,
        created_at=doc["created_at"],
    )


@router.get("/{claim_id}", response_model=ClaimResponse)
async def get_claim(claim_id: str):
    if not ObjectId.is_valid(claim_id):
        raise HTTPException(400, detail="Invalid claim ID.")
    doc = await claims_col().find_one({"_id": ObjectId(claim_id)})
    if not doc:
        raise HTTPException(404, detail="Claim not found.")

    from app.models.schemas import ClaimChecklistItem
    return ClaimResponse(
        claim_id=str(doc["_id"]),
        readiness_score=doc["readiness_score"],
        status=doc["status"],
        checklist=[ClaimChecklistItem(**c) for c in doc["checklist"]],
        missing_docs=doc["missing_docs"],
        auto_filled_form=doc["auto_filled_form"],
        tracking_stages=doc["tracking_stages"],
        advice=doc.get("advice"),
        created_at=doc["created_at"],
    )


@router.patch("/{claim_id}/status")
async def update_claim_status(claim_id: str, status: str):
    if not ObjectId.is_valid(claim_id):
        raise HTTPException(400, detail="Invalid claim ID.")
    valid_statuses = ["prepared", "submitted", "under_review", "additional_info", "settled", "rejected"]
    if status not in valid_statuses:
        raise HTTPException(400, detail=f"Invalid status. Choose from: {valid_statuses}")
    await claims_col().update_one(
        {"_id": ObjectId(claim_id)},
        {"$set": {"status": status, "updated_at": datetime.now(timezone.utc)}},
    )
    return {"claim_id": claim_id, "status": status}
