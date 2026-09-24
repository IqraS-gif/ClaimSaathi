"""MongoDB async client via Motor."""
import os
from motor.motor_asyncio import AsyncIOMotorClient
from pathlib import Path
from dotenv import load_dotenv

# Load .env from backend directory explicitly
_env_path = Path(__file__).resolve().parent.parent.parent / ".env"
load_dotenv(_env_path)
load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
MONGODB_DB  = os.getenv("MONGODB_DB",  "claimsaathi")

_client: AsyncIOMotorClient | None = None


def get_client() -> AsyncIOMotorClient:
    global _client
    if _client is None:
        _client = AsyncIOMotorClient(MONGODB_URI)
    return _client


def get_db():
    return get_client()[MONGODB_DB]


# ── Collection helpers ────────────────────────────────────────────────────────
def uploads_col():
    return get_db()["uploads"]

def predictions_col():
    return get_db()["predictions"]

def claims_col():
    return get_db()["claims"]

def bridge_col():
    return get_db()["bridge_requests"]
