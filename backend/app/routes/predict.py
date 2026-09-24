"""Predict & Plan route."""
from __future__ import annotations
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException
from bson import ObjectId

from app.db.mongo import predictions_col
from app.models.schemas import PredictRequest, PredictResponse
from app.services.cost_predictor import (
    calculate_cost,
    get_room_upgrade_impact,
    get_coverage_comparison,
    get_nearby_hospitals,
)

router = APIRouter()


@router.post("", response_model=PredictResponse)
async def predict_cost(req: PredictRequest):
    cost_breakdown    = calculate_cost(req)
    nearby_hospitals  = get_nearby_hospitals(req.city)
    room_impact       = get_room_upgrade_impact(req)
    coverage_comp     = get_coverage_comparison(req)

    advice = (
        "Based on your inputs, we recommend verifying hospital network status before admission "
        "and requesting a pre-authorization for cashless treatment."
    )
    if cost_breakdown.out_of_pocket > 75_000:
        advice += " Your out-of-pocket is above ₹75,000 — consider the Paytm Financial Bridge."

    doc = {
        "request":           req.model_dump(),
        "cost_breakdown":    cost_breakdown.model_dump(),
        "nearby_hospitals":  [h.model_dump() for h in nearby_hospitals],
        "room_upgrade_impact": room_impact,
        "coverage_comparison": coverage_comp,
        "advice":            advice,
        "created_at":        datetime.now(timezone.utc),
    }
    result = await predictions_col().insert_one(doc)
    prediction_id = str(result.inserted_id)

    return PredictResponse(
        prediction_id=prediction_id,
        cost_breakdown=cost_breakdown,
        nearby_hospitals=nearby_hospitals,
        room_upgrade_impact=room_impact,
        coverage_comparison=coverage_comp,
        advice=advice,
        created_at=doc["created_at"],
    )


@router.get("/{prediction_id}", response_model=PredictResponse)
async def get_prediction(prediction_id: str):
    if not ObjectId.is_valid(prediction_id):
        raise HTTPException(400, detail="Invalid prediction ID.")
    doc = await predictions_col().find_one({"_id": ObjectId(prediction_id)})
    if not doc:
        raise HTTPException(404, detail="Prediction not found.")

    from app.models.schemas import CostBreakdown, NearbyHospital
    return PredictResponse(
        prediction_id=str(doc["_id"]),
        cost_breakdown=CostBreakdown(**doc["cost_breakdown"]),
        nearby_hospitals=[NearbyHospital(**h) for h in doc["nearby_hospitals"]],
        room_upgrade_impact=doc["room_upgrade_impact"],
        coverage_comparison=doc["coverage_comparison"],
        advice=doc["advice"],
        created_at=doc["created_at"],
    )
