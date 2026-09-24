"""Upload & Understand route."""
from __future__ import annotations
from datetime import datetime, timezone
from fastapi import APIRouter, File, UploadFile, Form, HTTPException
from bson import ObjectId

from app.db.mongo import uploads_col
from app.models.schemas import UploadResponse, ExtractedCoverage
from app.services.document_parser import parse_document

router = APIRouter()

ALLOWED_MIME = {"application/pdf", "image/jpeg", "image/png", "image/tiff"}


@router.post("", response_model=UploadResponse)
async def upload_document(
    file:          UploadFile = File(...),
    patient_name:  str = Form(""),
    dob:           str = Form(""),
    policy_number: str = Form(""),
    doc_type:      str = Form("policy"),
    insurer_name:  str = Form(""),
    notes:         str = Form(""),
):
    if file.content_type not in ALLOWED_MIME:
        raise HTTPException(400, detail=f"Unsupported file type: {file.content_type}. Upload PDF or image.")

    file_bytes = await file.read()
    if len(file_bytes) > 20 * 1024 * 1024:  # 20 MB
        raise HTTPException(400, detail="File size exceeds 20 MB limit.")

    parsed = await parse_document(file_bytes, file.content_type, doc_type)
    extracted: ExtractedCoverage = parsed["extracted"]

    doc = {
        "patient_name":  patient_name,
        "dob":           dob,
        "policy_number": policy_number,
        "doc_type":      doc_type,
        "insurer_name":  insurer_name,
        "notes":         notes,
        "filename":      file.filename,
        "mime_type":     file.content_type,
        "extracted":     extracted.model_dump(),
        "plain_summary": parsed["plain_summary"],
        "raw_text":      parsed.get("raw_text", ""),
        "created_at":    datetime.now(timezone.utc),
    }
    result = await uploads_col().insert_one(doc)
    upload_id = str(result.inserted_id)

    return UploadResponse(
        upload_id=upload_id,
        status="analysed",
        doc_type=doc_type,
        patient_name=patient_name,
        policy_number=policy_number,
        extracted=extracted,
        plain_summary=parsed["plain_summary"],
        created_at=doc["created_at"],
    )


from app.services.hospital_service import get_hospital_details

@router.get("/hospital-details")
async def get_hospital_info(name: str, room_rent_limit: str = "₹3,000/day"):
    """Fetch live SerpAPI image and room category eligibility for a hospital."""
    return await get_hospital_details(name, room_rent_limit)


@router.get("/{upload_id}", response_model=UploadResponse)
async def get_upload(upload_id: str):
    if not ObjectId.is_valid(upload_id):
        raise HTTPException(400, detail="Invalid upload ID.")
    doc = await uploads_col().find_one({"_id": ObjectId(upload_id)})
    if not doc:
        raise HTTPException(404, detail="Upload not found.")
    return UploadResponse(
        upload_id=str(doc["_id"]),
        status="analysed",
        doc_type=doc["doc_type"],
        patient_name=doc["patient_name"],
        policy_number=doc["policy_number"],
        extracted=ExtractedCoverage(**doc["extracted"]),
        plain_summary=doc["plain_summary"],
        created_at=doc["created_at"],
    )
