"""Pydantic v2 schemas for all ClaimSaathi entities."""
from __future__ import annotations
from datetime import datetime
from typing import Any, Optional
from pydantic import BaseModel, Field
from bson import ObjectId


# ── Shared ────────────────────────────────────────────────────────────────────
class PyObjectId(str):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return str(v)


# ── Upload ────────────────────────────────────────────────────────────────────
class UploadRequest(BaseModel):
    patient_name: str
    dob: str
    policy_number: str
    doc_type: str  # "policy" | "hospital_estimate" | "discharge_summary" | "medical_bills"
    insurer_name: Optional[str] = None
    notes: Optional[str] = None


class ExtractedCoverage(BaseModel):
    sum_insured: Optional[float] = None
    room_rent_limit: Optional[str] = None
    co_pay_percent: Optional[float] = None
    waiting_period: Optional[str] = None
    pre_existing_covered: Optional[bool] = None
    network_hospitals: Optional[list[str]] = []
    exclusions: Optional[list[str]] = []
    raw_text_preview: Optional[str] = None


class UploadResponse(BaseModel):
    upload_id: str
    status: str
    doc_type: str
    patient_name: str
    policy_number: str
    extracted: ExtractedCoverage
    plain_summary: str
    created_at: datetime


# ── Predict ───────────────────────────────────────────────────────────────────
class PredictRequest(BaseModel):
    upload_id: Optional[str] = None
    hospital_name: str
    city: str
    treatment_type: str
    diagnosis: str
    room_category: str      # "general" | "semi_private" | "private" | "icu"
    estimated_bill: float
    admission_type: str     # "planned" | "emergency"
    policy_number: Optional[str] = None
    sum_insured: Optional[float] = None
    co_pay_percent: Optional[float] = 0
    room_rent_limit: Optional[str] = None


class CostBreakdown(BaseModel):
    hospital_bill: float
    insurance_payout: float
    co_pay_amount: float
    room_deduction: float
    out_of_pocket: float
    cashless_eligible: bool
    notes: list[str]


class NearbyHospital(BaseModel):
    name: str
    city: str
    type: str
    network: str


class PredictResponse(BaseModel):
    prediction_id: str
    cost_breakdown: CostBreakdown
    nearby_hospitals: list[NearbyHospital]
    room_upgrade_impact: dict[str, Any]
    coverage_comparison: list[dict[str, Any]]
    advice: str
    created_at: datetime


# ── Claim ─────────────────────────────────────────────────────────────────────
class ClaimRequest(BaseModel):
    upload_id: Optional[str] = None
    prediction_id: Optional[str] = None
    patient_name: str
    policy_number: str
    insurer_name: str
    hospital_name: str
    admission_date: str
    discharge_date: str
    diagnosis: str
    claim_type: str          # "cashless" | "reimbursement"
    total_bill: float
    documents_ready: list[str]
    rejection_reason: Optional[str] = None  # if re-filing


class ClaimChecklistItem(BaseModel):
    name: str
    required: bool
    status: str   # "present" | "missing" | "optional"


class ClaimResponse(BaseModel):
    claim_id: str
    readiness_score: int          # 0–100
    status: str
    checklist: list[ClaimChecklistItem]
    missing_docs: list[str]
    auto_filled_form: dict[str, Any]
    tracking_stages: list[dict[str, str]]
    advice: Optional[str] = None
    created_at: datetime


# ── Bridge ────────────────────────────────────────────────────────────────────
class BridgeRequest(BaseModel):
    claim_id: Optional[str] = None
    patient_name: str
    paytm_mobile: str
    gap_amount: float
    hospital_expense: float
    insurance_payout: float
    repayment_preference: str   # "emi_3" | "emi_6" | "lump_sum"
    consent_financial_data: bool
    consent_repayment: bool


class BridgeResponse(BaseModel):
    bridge_id: str
    status: str
    gap_amount: float
    monthly_emi: Optional[float] = None
    repayment_months: Optional[int] = None
    next_steps: list[str]
    disclaimer: str
    created_at: datetime
