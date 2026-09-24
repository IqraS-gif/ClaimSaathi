"""Claim preparation service — checklist, readiness score, auto-fill."""
from __future__ import annotations
from app.models.schemas import ClaimRequest, ClaimChecklistItem


REQUIRED_DOCS = {
    "cashless": [
        "Policy Document",
        "ID Proof (Aadhaar / PAN)",
        "Hospital Pre-authorization Form",
        "Doctor's Certificate / Referral",
        "Diagnosis Report",
        "Lab Reports",
    ],
    "reimbursement": [
        "Policy Document",
        "ID Proof (Aadhaar / PAN)",
        "Discharge Summary",
        "All Hospital Bills (itemized)",
        "Doctor's Certificate",
        "Diagnosis / Lab Reports",
        "Pharmacy Bills",
        "Bank Account Details (for NEFT)",
    ],
}

OPTIONAL_DOCS = ["MRI / CT Scan Reports", "Previous Hospitalization Records", "Referral Letter"]

TRACKING_STAGES = [
    {"stage": "Prepared",     "status": "current"},
    {"stage": "Submitted",    "status": "pending"},
    {"stage": "Under Review", "status": "pending"},
    {"stage": "Additional Info Required", "status": "pending"},
    {"stage": "Settled",      "status": "pending"},
]


def build_checklist(req: ClaimRequest) -> tuple[list[ClaimChecklistItem], list[str]]:
    required = REQUIRED_DOCS.get(req.claim_type, REQUIRED_DOCS["reimbursement"])
    checklist: list[ClaimChecklistItem] = []
    missing: list[str] = []

    for doc in required:
        present = doc in req.documents_ready
        status  = "present" if present else "missing"
        checklist.append(ClaimChecklistItem(name=doc, required=True, status=status))
        if not present:
            missing.append(doc)

    for doc in OPTIONAL_DOCS:
        present = doc in req.documents_ready
        checklist.append(ClaimChecklistItem(name=doc, required=False, status="present" if present else "optional"))

    return checklist, missing


def calculate_readiness_score(missing: list[str], total_required: int) -> int:
    if total_required == 0:
        return 100
    score = int(((total_required - len(missing)) / total_required) * 100)
    return max(0, min(100, score))


def auto_fill_form(req: ClaimRequest) -> dict:
    """Pre-fill standard TPA/insurer claim form fields."""
    return {
        "claimant_name":        req.patient_name,
        "policy_number":        req.policy_number,
        "insurer_name":         req.insurer_name,
        "hospital_name":        req.hospital_name,
        "admission_date":       req.admission_date,
        "discharge_date":       req.discharge_date,
        "diagnosis":            req.diagnosis,
        "claim_type":           req.claim_type.replace("_", " ").title(),
        "total_billed_amount":  f"₹{req.total_bill:,.0f}",
        "claim_amount":         f"₹{req.total_bill:,.0f}",
        "bank_account_required": req.claim_type == "reimbursement",
        "declaration":          "I hereby declare that the above information is true and correct.",
    }


def get_rejection_advice(rejection_reason: str | None) -> str | None:
    if not rejection_reason:
        return None
    reason_lower = rejection_reason.lower()
    if "pre-existing" in reason_lower:
        return ("The claim was rejected citing a pre-existing condition. "
                "You can file an IRDAI grievance if the condition was not disclosed or if "
                "the waiting period has lapsed. We have pre-filled a grievance draft for you.")
    if "document" in reason_lower or "missing" in reason_lower:
        return ("Missing documents were the reason for rejection. "
                "Please upload the required documents and re-submit. "
                "We have identified the gaps in your checklist above.")
    if "room" in reason_lower or "category" in reason_lower:
        return ("Room category exceeded your policy entitlement. "
                "You may appeal by submitting a doctor's certificate of medical necessity "
                "for the higher room category.")
    return ("Your claim was rejected. You have the right to file a grievance with the insurer "
            "and escalate to IRDAI if unresolved within 30 days.")
