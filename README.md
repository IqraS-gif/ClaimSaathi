<div align="center">

<img src="https://img.shields.io/badge/ClaimSaathi-Paytm%20Insurance%20Companion-00BAF2?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTEyIDIycy04LTQtOC0xMFY1bDggMy04IDN2N2MwIDYgOCAxMCA4IDEweiIgZmlsbD0id2hpdGUiLz48L3N2Zz4=" alt="ClaimSaathi"/>

# 🏥 ClaimSaathi
### Your AI-Powered Health Insurance Claim Companion

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-claim--saathi--sigma.vercel.app-00BAF2?style=for-the-badge)](https://claim-saathi-sigma.vercel.app/)
[![Backend API](https://img.shields.io/badge/⚙️_Backend_API-Render-46E3B7?style=for-the-badge)](https://claimsaathi-dgpp.onrender.com/api/health)
[![GitHub](https://img.shields.io/badge/GitHub-IqraS--gif%2FClaimSaathi-181717?style=for-the-badge&logo=github)](https://github.com/IqraS-gif/ClaimSaathi)

**ClaimSaathi** decodes the complexity of Indian health insurance — upload your policy, simulate your hospital bill split, bridge the financial gap with EMI options, and get instant Hindi AI assistance — all in one place.

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🛡️ **Check Insurance** | Upload your health policy PDF and instantly decode sum insured, room rent limits, co-payments, waiting periods, covered treatments, and exclusions |
| 🧾 **Check Claim (Bill Simulator)** | Upload your hospital bill + policy to get a clause-level breakdown of what your insurer will pay vs. what you owe out-of-pocket |
| 💸 **Bridge the Gap (EMI)** | Get 0% No-Cost EMI, Flexi Medical Loan, Extended Care Credit, and Claim Settlement Advance options to cover your out-of-pocket expenses |
| 📊 **Predict & Plan** | Estimate future medical costs and compare nearby network hospital options before hospitalization |
| 🤖 **Saathi AI Chatbot** | Multilingual AI assistant (Hindi, Hinglish, English) powered by **Sarvam AI** with voice input & voice output — contextually aware of your uploaded documents |
| ⚡ **1-Click Demo** | Instantly auto-load sample policy/bill documents to explore the full feature set without needing real files |

---

## 🖥️ Tech Stack

### Frontend
- **React 18** + **Vite** — Lightning-fast SPA
- **Vanilla CSS** — Custom Paytm-inspired design system with glassmorphism, gradients, micro-animations
- **React Router v6** — Client-side navigation
- **Axios** — API communication with automatic base URL switching (dev proxy / production Render URL)

### Backend
- **FastAPI** (Python) — High-performance async REST API
- **MongoDB Atlas** (via Motor) — Async NoSQL database for uploads, predictions, and claims
- **Groq API** — LLM-powered document extraction (policy parsing, bill simulation)
- **Sarvam AI** — Multilingual conversational AI with Hindi TTS (Text-to-Speech)
- **SerpAPI** — Live Google Images search for empanelled network hospitals
- **pdfplumber** + **Pillow** — PDF parsing and image processing

### Deployment
- **Vercel** — Frontend hosting with SPA rewrite rules and `/api/*` reverse proxy to Render
- **Render** — FastAPI backend hosting with auto-deploy on push

---

## 🚀 Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- MongoDB Atlas account (free tier works)
- [Groq API Key](https://console.groq.com/) (free)
- [Sarvam AI API Key](https://sarvam.ai/) (for multilingual chatbot)

---

### 1. Clone the Repository

```bash
git clone https://github.com/IqraS-gif/ClaimSaathi.git
cd ClaimSaathi
```

---

### 2. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env and fill in your keys (see Environment Variables section)

# Start the backend server
uvicorn app.main:app --reload --port 8000
```

Backend will be available at `http://localhost:8000`
API docs: `http://localhost:8000/docs`

---

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will be available at `http://localhost:5173`

---

## 🔑 Environment Variables

### Backend (`backend/.env`)

```env
# MongoDB (required)
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/claimsaathi?retryWrites=true&w=majority
MONGODB_DB=claimsaathi

# Groq API — for LLM-powered document parsing (required)
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Sarvam AI — for multilingual Hindi chatbot (required for Saathi AI)
SARVAM_API_KEY=your_sarvam_api_key_here

# SerpAPI — for live hospital image search (optional)
SERPAPI_KEY=

# CORS — comma-separated allowed frontend origins
ALLOWED_ORIGINS=http://localhost:5173,https://claim-saathi-sigma.vercel.app
```

### Frontend (`frontend/.env`)

```env
# Leave empty for local dev (Vite proxy handles /api -> localhost:8000)
# Set to your Render URL for production builds
VITE_API_URL=https://claimsaathi-dgpp.onrender.com
```

---

## 📁 Project Structure

```
ClaimSaathi/
├── backend/
│   ├── app/
│   │   ├── db/            # MongoDB Motor client
│   │   ├── models/        # Pydantic schemas
│   │   ├── routes/        # FastAPI route handlers
│   │   │   ├── upload.py  # Policy document analysis
│   │   │   ├── claim.py   # Bill simulation & claim prep
│   │   │   ├── predict.py # Cost prediction
│   │   │   ├── bridge.py  # Financial EMI bridge
│   │   │   └── chat.py    # Sarvam AI multilingual chat
│   │   ├── services/      # Business logic & AI integrations
│   │   └── main.py        # FastAPI app entry point
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── api/           # Axios client (auto proxy / VITE_API_URL)
│   │   ├── components/    # Navbar, FileUploadZone, Chatbot
│   │   ├── pages/         # Landing, Upload, Claim, Bridge, Predict
│   │   └── index.css      # Global design system
│   ├── vercel.json        # SPA rewrites + /api proxy to Render
│   └── .env.example
│
├── render.yaml            # Render deployment blueprint
└── README.md
```

---

## 🌐 Deployment

### Deploy Backend to Render

1. Go to [dashboard.render.com](https://dashboard.render.com) → **New Web Service**
2. Connect your GitHub repository
3. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Add all environment variables from `backend/.env.example`
5. Deploy!

> Or use the included `render.yaml` blueprint for 1-click deployment.

### Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project** → Import `ClaimSaathi`
2. Configure:
   - **Root Directory**: `frontend`
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build` *(keep as default, do not override)*
   - **Output Directory**: `dist` *(keep as default)*
3. Add environment variable:
   - `VITE_API_URL` = your Render backend URL
4. Deploy!

> The `frontend/vercel.json` automatically proxies all `/api/*` requests to your Render backend, eliminating CORS issues entirely.

---

## 📸 Screenshots

> 🔗 **Live:** [claim-saathi-sigma.vercel.app](https://claim-saathi-sigma.vercel.app/)

| Landing Page | Check Insurance | Claim Split |
|:---:|:---:|:---:|
| AI-powered hero with Paytm-styled UI | Upload & decode your policy in seconds | Clause-level financial split dashboard |

---

## 🤖 AI & APIs Used

| Service | Purpose |
|---|---|
| **Groq (LLaMA 3.2 Vision)** | Extracts structured data from policy PDFs and hospital bills |
| **Sarvam AI (sarvam-105b)** | Multilingual Hindi/Hinglish conversational AI for the Saathi chatbot |
| **Sarvam TTS** | Converts AI responses to spoken Hindi audio |
| **MongoDB Atlas** | Stores uploaded document metadata, simulation results |
| **SerpAPI** | Fetches real hospital images for the empanelled network hospital section |

---

## 📜 License

This project was built for a **hackathon demo**. All brand references to Paytm are for demonstration purposes only.

---

<div align="center">

Made with ❤️ by **Iqra Sayed** | Powered by **Sarvam AI** × **Groq** × **Paytm Design**

[![Vercel](https://img.shields.io/badge/Hosted_on-Vercel-000000?style=flat-square&logo=vercel)](https://claim-saathi-sigma.vercel.app/)
[![Render](https://img.shields.io/badge/Backend_on-Render-46E3B7?style=flat-square&logo=render)](https://claimsaathi-dgpp.onrender.com)

</div>
