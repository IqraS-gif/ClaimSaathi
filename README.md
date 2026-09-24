# ClaimSaathi

> Paytm-powered health insurance claim companion.

## Stack
| Layer | Tech |
|-------|------|
| Frontend | React 18, Vite, React Router, Axios |
| Backend  | Python FastAPI, Uvicorn |
| Database | MongoDB (Motor async driver) |
| AI/OCR   | Google Document AI |

---

## Project Structure

```
PaytmClaimSaathi/
├── frontend/   React + Vite app
└── backend/    FastAPI app
    └── app/
        ├── main.py
        ├── db/         MongoDB Motor client
        ├── models/     Pydantic v2 schemas
        ├── routes/     upload / predict / claim / bridge
        └── services/   document_parser / cost_predictor / claim_preparer
```

---

## Setup

### 1. Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Copy and fill environment variables
copy .env.example .env
# Edit .env with your MongoDB Atlas URI and Google credentials

# Start the API server
uvicorn app.main:app --reload --port 8000
```

API docs available at: http://localhost:8000/docs

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend available at: http://localhost:5173

---

## Environment Variables (backend/.env)

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `MONGODB_DB`  | Database name (default: `claimsaathi`) |
| `GOOGLE_PROJECT_ID`   | GCP project ID for Document AI |
| `GOOGLE_LOCATION`     | Document AI location (e.g. `us`) |
| `GOOGLE_PROCESSOR_ID` | Document AI processor ID |
| `GOOGLE_APPLICATION_CREDENTIALS` | Path to service account JSON |
| `ALLOWED_ORIGINS` | Comma-separated CORS origins (e.g. `http://localhost:5173`) |

> If Google credentials are not configured, the backend uses a simulated document extraction — fully functional for development.

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/upload` | Upload & parse document |
| GET  | `/api/upload/{id}` | Fetch upload result |
| POST | `/api/predict` | Calculate cost prediction |
| GET  | `/api/predict/{id}` | Fetch prediction |
| POST | `/api/claim` | Prepare claim + readiness score |
| GET  | `/api/claim/{id}` | Fetch claim |
| PATCH | `/api/claim/{id}/status` | Update claim status |
| POST | `/api/bridge` | Apply for financial bridge |
| GET  | `/api/bridge/{id}` | Fetch bridge application |
| GET  | `/api/health` | Health check |
