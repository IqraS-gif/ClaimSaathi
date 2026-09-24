"""
ClaimSaathi FastAPI Backend
Entry point: app/main.py
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pathlib import Path
import os

_env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(_env_path)
load_dotenv()

from app.routes import upload, predict, claim, bridge, chat

app = FastAPI(
    title="ClaimSaathi API",
    description="Backend for ClaimSaathi — Paytm Insurance Claim Helper",
    version="1.0.0",
)

# ── CORS ──────────────────────────────────────────────────────────────────────
raw_origins = os.getenv("ALLOWED_ORIGINS", "")
if raw_origins:
    allowed_origins = [o.strip() for o in raw_origins.split(",") if o.strip()]
else:
    allowed_origins = ["http://localhost:5173", "http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(upload.router,  prefix="/api/upload",  tags=["Upload & Understand"])
app.include_router(predict.router, prefix="/api/predict", tags=["Predict & Plan"])
app.include_router(claim.router,   prefix="/api/claim",   tags=["Prepare & Claim"])
app.include_router(bridge.router,  prefix="/api/bridge",  tags=["Financial Bridge"])
app.include_router(chat.router,    prefix="/api/chat",    tags=["Sarvam AI Assistant"])


@app.get("/api/health", tags=["Health"])
async def health_check():
    return {"status": "ok", "service": "ClaimSaathi API", "version": "1.0.0"}
