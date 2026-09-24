"""
FastAPI route for Sarvam-powered contextual chatbot.
Supports feature-specific context for:
- Check Insurance (policy limits, room caps, exclusions)
- Check Claim (hospital bill simulator, deductions breakdown)
- Financial Bridge (instant medical loans, 0% EMI, disbursal)
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from app.services.sarvam_service import chat_with_sarvam

router = APIRouter()


class ChatRequest(BaseModel):
    message: str = Field(..., description="User message or query")
    feature: str = Field("general", description="Active feature context: 'claim', 'insurance', 'bridge', or 'general'")
    context_data: Optional[Dict[str, Any]] = Field(default=None, description="Dynamic state like bill breakdown, sum insured, gap amount")
    history: Optional[List[Dict[str, str]]] = Field(default=None, description="Previous messages in current chat session")
    language: Optional[str] = Field("en", description="Preferred response language: 'en', 'hi', or 'hinglish'")


class ChatResponse(BaseModel):
    reply: str
    provider: str
    feature: str
    model: str


@router.post("/", response_model=ChatResponse)
async def chat_endpoint(payload: ChatRequest):
    """
    Context-aware Sarvam AI chat endpoint for ClaimSaathi.
    """
    if not payload.message or not payload.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    try:
        result = await chat_with_sarvam(
            user_message=payload.message.strip(),
            feature=payload.feature,
            context_data=payload.context_data,
            history=payload.history,
            language=payload.language or "en",
        )
        return ChatResponse(**result)
    except Exception as e:
        print(f"[Chat Router Error] {e}")
        raise HTTPException(status_code=500, detail=str(e))
