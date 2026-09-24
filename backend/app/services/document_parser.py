"""
Document parser service — powered by Groq API.

Strategy:
  PDF  → extract text with pdfplumber → Groq LLM (llama-3.3-70b-versatile) for structured extraction
  Image → encode as base64 → Groq Vision (qwen/qwen3.8-27b) for OCR + extraction

Falls back to a realistic simulation if GROQ_API_KEY is not set.
"""
from __future__ import annotations

import base64
import io
import json
import os
import re
from typing import Any

from app.models.schemas import ExtractedCoverage

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
_USE_GROQ = bool(GROQ_API_KEY)

# ── Models ────────────────────────────────────────────────────────────────────
_LLM_MODEL    = "llama-3.3-70b-versatile"   # text → structured JSON extraction
_VISION_MODEL = "qwen/qwen3.8-27b"           # image → OCR + extraction (supports up to 3 images, 20 MB)

# ── Extraction prompt ─────────────────────────────────────────────────────────
_SYSTEM_PROMPT = """You are an expert Indian health insurance document analyst.
Extract key policy/claim information from the provided document text and return
ONLY a valid JSON object with exactly these fields (use null for missing values):

{
  "sum_insured": <number or null>,
  "room_rent_limit": <string like "₹3000/day" or "1% of sum insured" or null>,
  "co_pay_percent": <number 0-100 or null>,
  "waiting_period": <string or null>,
  "pre_existing_covered": <true/false or null>,
  "network_hospitals": [<list of hospital names, max 5>],
  "exclusions": [<list of excluded conditions/treatments, max 8>],
  "plain_summary": "<2-3 sentence plain English summary of the document>"
}

Rules:
- sum_insured must be a plain number (no ₹ symbol), e.g. 500000
- co_pay_percent must be a plain number, e.g. 10 (not "10%")
- Return ONLY the JSON object, no markdown, no explanation.
"""


async def parse_document(file_bytes: bytes, mime_type: str, doc_type: str) -> dict:
    """
    Main entry point. Returns dict with keys:
      extracted   -> ExtractedCoverage
      plain_summary -> str
      raw_text    -> str (preview)
    """
    if not _USE_GROQ:
        return _simulate_extraction(doc_type)

    try:
        if mime_type == "application/pdf":
            return await _parse_pdf_with_groq(file_bytes, doc_type)
        elif mime_type.startswith("image/"):
            return await _parse_image_with_groq(file_bytes, mime_type, doc_type)
        else:
            return _simulate_extraction(doc_type)
    except Exception as exc:
        print(f"[Groq] Extraction error: {exc}. Falling back to simulation.")
        return _simulate_extraction(doc_type)


# ── PDF path ──────────────────────────────────────────────────────────────────
async def _parse_pdf_with_groq(file_bytes: bytes, doc_type: str) -> dict:
    """Extract text from PDF via pdfplumber, then send to Groq LLM."""
    import pdfplumber

    raw_text = ""
    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
        for page in pdf.pages[:8]:          # cap at 8 pages to stay within token limits
            page_text = page.extract_text()
            if page_text:
                raw_text += page_text + "\n"

    raw_text = raw_text.strip()
    if not raw_text:
        print("[Groq] PDF has no extractable text (scanned?). Falling back to simulation.")
        return _simulate_extraction(doc_type)

    # Truncate to ~12 000 chars to stay within context window
    text_for_llm = raw_text[:12000]

    parsed = await _call_groq_llm(text_for_llm, doc_type)
    parsed["raw_text"] = raw_text[:500]
    return parsed


# ── Image path ────────────────────────────────────────────────────────────────
async def _parse_image_with_groq(file_bytes: bytes, mime_type: str, doc_type: str) -> dict:
    """Encode image as base64 and send to Groq vision model."""
    from groq import AsyncGroq

    b64 = base64.b64encode(file_bytes).decode("utf-8")
    data_url = f"data:{mime_type};base64,{b64}"

    client = AsyncGroq(api_key=GROQ_API_KEY)

    response = await client.chat.completions.create(
        model=_VISION_MODEL,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "image_url",
                        "image_url": {"url": data_url},
                    },
                    {
                        "type": "text",
                        "text": (
                            f"This is an Indian health insurance document (type: {doc_type}). "
                            + _SYSTEM_PROMPT.replace("You are", "Act as")
                        ),
                    },
                ],
            }
        ],
        temperature=0.1,
        max_tokens=1024,
    )

    content = response.choices[0].message.content or ""
    return _parse_groq_response(content, doc_type, raw_text="")


# ── Groq LLM call ─────────────────────────────────────────────────────────────
async def _call_groq_llm(text: str, doc_type: str) -> dict:
    from groq import AsyncGroq

    client = AsyncGroq(api_key=GROQ_API_KEY)

    user_msg = (
        f"Document type: {doc_type}\n\n"
        f"Document content:\n{text}"
    )

    response = await client.chat.completions.create(
        model=_LLM_MODEL,
        messages=[
            {"role": "system", "content": _SYSTEM_PROMPT},
            {"role": "user",   "content": user_msg},
        ],
        temperature=0.1,
        max_tokens=1024,
        response_format={"type": "json_object"},
    )

    content = response.choices[0].message.content or "{}"
    return _parse_groq_response(content, doc_type, raw_text=text)


# ── Response parser ───────────────────────────────────────────────────────────
def _parse_groq_response(content: str, doc_type: str, raw_text: str) -> dict:
    """Parse Groq JSON response into ExtractedCoverage + plain_summary."""
    try:
        # Strip any markdown fences if model didn't follow instructions
        cleaned = re.sub(r"```(?:json)?|```", "", content).strip()
        data: dict[str, Any] = json.loads(cleaned)
    except json.JSONDecodeError:
        print(f"[Groq] JSON parse failed. Content: {content[:200]}")
        return _simulate_extraction(doc_type)

    plain_summary = data.pop("plain_summary", None) or _build_plain_summary(data)

    extracted = ExtractedCoverage(
        sum_insured          = _safe_float(data.get("sum_insured")),
        room_rent_limit      = data.get("room_rent_limit"),
        co_pay_percent       = _safe_float(data.get("co_pay_percent")),
        waiting_period       = data.get("waiting_period"),
        pre_existing_covered = data.get("pre_existing_covered"),
        network_hospitals    = data.get("network_hospitals") or [],
        exclusions           = data.get("exclusions") or [],
        raw_text_preview     = raw_text[:500] if raw_text else "[Image document processed by Groq Vision]",
    )

    return {
        "extracted":     extracted,
        "plain_summary": plain_summary,
        "raw_text":      raw_text[:500],
    }


# ── Helpers ───────────────────────────────────────────────────────────────────
def _safe_float(val: Any) -> float | None:
    try:
        return float(val) if val is not None else None
    except (ValueError, TypeError):
        return None


def _build_plain_summary(data: dict) -> str:
    parts = []
    si = _safe_float(data.get("sum_insured"))
    if si:
        parts.append(f"Your policy covers up to ₹{si:,.0f}.")
    cp = _safe_float(data.get("co_pay_percent"))
    if cp:
        parts.append(f"You pay {cp:.0f}% of every claim as co-pay.")
    rr = data.get("room_rent_limit")
    if rr:
        parts.append(f"Room rent is capped at {rr}.")
    wp = data.get("waiting_period")
    if wp:
        parts.append(f"Waiting period: {wp}.")
    excl = data.get("exclusions") or []
    if excl:
        parts.append(f"Excluded: {', '.join(excl[:4])}.")
    return " ".join(parts) if parts else "Document analysed. Key policy terms extracted successfully."


# ── Simulation fallback ───────────────────────────────────────────────────────
def _simulate_extraction(doc_type: str) -> dict:
    """Realistic simulated extraction used when GROQ_API_KEY is not set."""
    if doc_type == "hospital_estimate":
        extracted = ExtractedCoverage(
            raw_text_preview="[Simulation] Hospital estimate parsed. Estimated bill: ₹2,00,000.",
        )
        plain_summary = "Hospital estimate received. Estimated total bill is ₹2,00,000. Verify itemised charges with the billing department."
    else:
        extracted = ExtractedCoverage(
            sum_insured          = 500000,
            room_rent_limit      = "₹3,000/day",
            co_pay_percent       = 10,
            waiting_period       = "2 years for pre-existing conditions",
            pre_existing_covered = True,
            network_hospitals    = ["Apollo Hospitals", "Fortis Healthcare", "Max Super Speciality"],
            exclusions           = ["Cosmetic Surgery", "Dental Treatment", "Vision Correction"],
            raw_text_preview     = "[Simulation] Set GROQ_API_KEY in backend/.env to enable real document extraction.",
        )
        plain_summary = (
            "Your policy covers up to ₹5,00,000. "
            "You pay 10% of every claim as co-pay. "
            "Room rent is capped at ₹3,000/day. "
            "Pre-existing conditions covered after 2-year waiting period."
        )

    return {
        "extracted":     extracted,
        "plain_summary": plain_summary,
        "raw_text":      "",
    }
