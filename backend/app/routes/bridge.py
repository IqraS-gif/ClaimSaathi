"""Financial Bridge route."""
from __future__ import annotations
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException
from bson import ObjectId

from app.db.mongo import bridge_col
from app.models.schemas import BridgeRequest, BridgeResponse

router = APIRouter()

REPAYMENT_MONTHS = {"emi_3": 3, "emi_6": 6, "emi_12": 12, "bullet_45": 1, "lump_sum": 1}


@router.post("", response_model=BridgeResponse)
async def apply_bridge(req: BridgeRequest):
    if not req.consent_financial_data or not req.consent_repayment:
        raise HTTPException(400, detail="Both consent fields are required to proceed.")

    months = REPAYMENT_MONTHS.get(req.repayment_preference, 3)
    monthly_emi = round(req.gap_amount / months, 2) if months > 1 else None

    next_steps = [
        "Paytm will verify your claim ID and insurance settlement letter.",
        "A short-term credit line will be activated on your Paytm account.",
        "Funds will be transferred to the hospital directly or to your linked account.",
        f"Repayment will be scheduled over {months} month(s) from your settlement date.",
        "You will receive an SMS and in-app notification once credit is approved.",
    ]

    doc = {
        "request":              req.model_dump(),
        "status":               "under_review",
        "gap_amount":           req.gap_amount,
        "monthly_emi":          monthly_emi,
        "repayment_months":     months,
        "next_steps":           next_steps,
        "created_at":           datetime.now(timezone.utc),
    }
    result = await bridge_col().insert_one(doc)
    bridge_id = str(result.inserted_id)

    return BridgeResponse(
        bridge_id=bridge_id,
        status="under_review",
        gap_amount=req.gap_amount,
        monthly_emi=monthly_emi,
        repayment_months=months if months > 1 else None,
        next_steps=next_steps,
        disclaimer=(
            "Paytm Financial Bridge is a short-term credit product subject to eligibility, "
            "KYC verification, and credit assessment. This is not an insurance product. "
            "Repayment is linked to insurance settlement proceeds where applicable."
        ),
        created_at=doc["created_at"],
    )


@router.get("/{bridge_id}", response_model=BridgeResponse)
async def get_bridge(bridge_id: str):
    if not ObjectId.is_valid(bridge_id):
        raise HTTPException(400, detail="Invalid bridge ID.")
    doc = await bridge_col().find_one({"_id": ObjectId(bridge_id)})
    if not doc:
        raise HTTPException(404, detail="Bridge application not found.")
    return BridgeResponse(
        bridge_id=str(doc["_id"]),
        status=doc["status"],
        gap_amount=doc["gap_amount"],
        monthly_emi=doc.get("monthly_emi"),
        repayment_months=doc.get("repayment_months"),
        next_steps=doc["next_steps"],
        disclaimer=(
            "Paytm Financial Bridge is a short-term credit product subject to eligibility, "
            "KYC verification, and credit assessment."
        ),
        created_at=doc["created_at"],
    )
