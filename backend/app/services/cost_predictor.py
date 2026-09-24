"""Cost prediction service — calculates insurance payout vs out-of-pocket."""
from __future__ import annotations
from app.models.schemas import CostBreakdown, NearbyHospital, PredictRequest


ROOM_CATEGORY_MULTIPLIERS = {
    "general":      1.0,
    "semi_private": 1.15,
    "private":      1.35,
    "icu":          1.80,
}

SAMPLE_HOSPITALS = [
    NearbyHospital(name="Apollo Hospitals",           city="Delhi",     type="Multi-Specialty", network="Cashless"),
    NearbyHospital(name="Fortis Memorial",            city="Gurugram",  type="Multi-Specialty", network="Cashless"),
    NearbyHospital(name="Max Super Speciality",       city="Delhi",     type="Multi-Specialty", network="Cashless"),
    NearbyHospital(name="Medanta The Medicity",       city="Gurugram",  type="Super-Specialty", network="Cashless"),
    NearbyHospital(name="Sir Ganga Ram Hospital",     city="Delhi",     type="Multi-Specialty", network="Cashless"),
    NearbyHospital(name="Narayana Health",            city="Bengaluru", type="Multi-Specialty", network="Cashless"),
    NearbyHospital(name="Manipal Hospital",           city="Bengaluru", type="Multi-Specialty", network="Cashless"),
]


def calculate_cost(req: PredictRequest) -> CostBreakdown:
    bill = req.estimated_bill
    sum_insured = req.sum_insured or 500_000
    co_pay_pct  = (req.co_pay_percent or 0) / 100

    # Room rent deduction
    room_deduction = 0.0
    if req.room_rent_limit:
        try:
            limit_str = req.room_rent_limit.replace("₹", "").replace(",", "").split("/")[0].strip()
            daily_limit = float(limit_str)
            # estimate stay ~5 days, scale proportionally to bill
            estimated_days = max(1, round(bill / 30_000))
            room_deduction = max(0, (bill * 0.15) - (daily_limit * estimated_days))
        except Exception:
            room_deduction = 0.0

    # Room category uplift — if patient booked higher category, insurer deducts proportionally
    multiplier = ROOM_CATEGORY_MULTIPLIERS.get(req.room_category, 1.0)
    base_covered = min(bill, sum_insured)
    if multiplier > 1.0:
        room_deduction += base_covered * (multiplier - 1.0) * 0.4

    eligible_amount  = max(0, base_covered - room_deduction)
    co_pay_amount    = eligible_amount * co_pay_pct
    insurance_payout = eligible_amount - co_pay_amount
    out_of_pocket    = bill - insurance_payout

    notes = []
    if req.room_category in ("private", "icu"):
        notes.append("Choosing a lower room category can reduce deductions significantly.")
    if co_pay_pct > 0:
        notes.append(f"Your policy has a {req.co_pay_percent}% co-pay on every claim.")
    if req.admission_type == "emergency":
        notes.append("Emergency admissions typically have streamlined cashless processing.")
    if out_of_pocket > 50_000:
        notes.append("Consider the Paytm Financial Bridge to cover the cash gap instantly.")

    return CostBreakdown(
        hospital_bill=round(bill, 2),
        insurance_payout=round(insurance_payout, 2),
        co_pay_amount=round(co_pay_amount, 2),
        room_deduction=round(room_deduction, 2),
        out_of_pocket=round(out_of_pocket, 2),
        cashless_eligible=True,
        notes=notes,
    )


def get_room_upgrade_impact(req: PredictRequest) -> dict:
    results = {}
    for cat, mult in ROOM_CATEGORY_MULTIPLIERS.items():
        r = req.model_copy(update={"room_category": cat})
        bd = calculate_cost(r)
        results[cat] = {
            "label": cat.replace("_", " ").title(),
            "hospital_bill": bd.hospital_bill * mult,
            "insurance_payout": bd.insurance_payout,
            "out_of_pocket": bd.out_of_pocket,
        }
    return results


def get_coverage_comparison(req: PredictRequest) -> list[dict]:
    scenarios = [
        {"label": "Your Policy",    "co_pay": req.co_pay_percent or 0,  "sum": req.sum_insured or 500_000},
        {"label": "With 0% Co-pay", "co_pay": 0,                        "sum": req.sum_insured or 500_000},
        {"label": "5 Lakh Cover",   "co_pay": req.co_pay_percent or 0,  "sum": 500_000},
        {"label": "10 Lakh Cover",  "co_pay": req.co_pay_percent or 0,  "sum": 1_000_000},
    ]
    comparison = []
    for s in scenarios:
        r = req.model_copy(update={"co_pay_percent": s["co_pay"], "sum_insured": s["sum"]})
        bd = calculate_cost(r)
        comparison.append({
            "label":           s["label"],
            "insurance_payout": bd.insurance_payout,
            "out_of_pocket":   bd.out_of_pocket,
        })
    return comparison


def get_nearby_hospitals(city: str) -> list[NearbyHospital]:
    city_lower = city.lower()
    filtered = [h for h in SAMPLE_HOSPITALS if h.city.lower() == city_lower]
    return filtered if filtered else SAMPLE_HOSPITALS[:4]
