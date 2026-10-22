# Women’s Health Intelligence Platform: PCOS Monitoring & Lifestyle Analytics

> **5th-Semester Software Group Project (SGP)**  
> Built with React 18, Tailwind CSS, Python FastAPI, SQLAlchemy, and Data Science Analytics (Pearson Correlation & Rotterdam Diagnostic Framework).

---

## 🌸 Project Vision & Research Gap
Polycystic Ovary Syndrome (PCOS) is a complex endocrine disorder affecting 1 in 5 women of reproductive age. Traditional period trackers assume a standard 28-day cycle, frequently failing for women with PCOS whose cycles are irregular (ranging from 35 to 60+ days). 

**Our Solution:**
An intelligent, data-driven companion that:
1. **Tracks irregular cycles** and predicts adaptive ovulatory windows.
2. **Correlates symptoms with lifestyle triggers** (sleep duration, perceived stress, dietary patterns, exercise).
3. **Calculates Rotterdam Consensus risk & phenotype classification** (Phenotypes A, B, C, D).
4. **Generates printable clinical summary reports** for physician and endocrinologist consultations.

---

## 🎨 Theme & Design Aesthetics
- **Primary Clinical Emerald**: `#00786F` (Medical Trust, Vitality, Balance)
- **Soft Rose Blush & Pearl**: `#FFF5F6`, `#FFE4E8` (Empathy, Comfort, Warmth)
- **Neutral Accents**: Slate Gray and Pearl White for high legibility and accessibility.

---

## 🏗️ Architecture & Technology Stack

| Layer | Technology | Key Capabilities |
|---|---|---|
| **Frontend** | React 18, Tailwind CSS, Lucide Icons, Vite | SPA Architecture, Responsive Mobile/Desktop UI, Quick Daily Log Modals, Interactive Symptom Sliders |
| **Backend API** | Python FastAPI, Pydantic, Uvicorn | High-throughput REST API, Salted SHA-256 Auth, JWT Bearer tokens |
| **Database** | SQLite / PostgreSQL via SQLAlchemy ORM | Normalized Relational Schema: Users, Cycles, Symptoms, Lifestyle, Assessments |
| **Analytics Engine** | Pandas, NumPy, Scikit-learn | Pearson Correlation Matrix, Dynamic Median Ovulation Predictor, Rotterdam Phenotyping |

---

## 📂 Project Directory Structure

```
pcos-companion/
├── run_app.bat                      # One-click launcher for Backend & Frontend
├── pcos-backend/                    # Python FastAPI Backend
│   ├── main.py                      # REST API Endpoints & Routing
│   ├── database.py                  # SQLAlchemy Database Engine
│   ├── models.py                    # Relational Data Models (6 entities)
│   ├── schemas.py                   # Pydantic Request & Response Schemas
│   ├── analytics_engine.py          # ML, Pearson Matrix & Rotterdam Scorer
│   ├── auth_service.py              # Salted Cryptographic Authentication
│   ├── seed_data.py                 # Initial Demo Patient Dataset (Sarah Jenkins)
│   └── pcos_companion.db           # SQLite Database
└── pcos-frontend/                   # React Vite Single Page App
    ├── index.html                   # HTML Entry Point
    ├── tailwind.config.js           # Theme Token Definitions
    └── src/
        ├── App.jsx                  # Main Routing & State Management
        ├── components/              # Shared Components (Sidebar, Navbar, Header, Modals)
        ├── pages/                   # 12 Comprehensive Pages matching SGP Prototype
        └── services/                # Axios/Fetch API Integration Layer
```

---

## 🚀 Quick Start Guide

### 1. Launch Everything with One Click
Double click `run_app.bat` or run in terminal:
```powershell
.\run_app.bat
```

### 2. Manual Launch
**Backend:**
```bash
cd pcos-backend
python main.py
# Server runs on http://127.0.0.1:8000 (API Docs at http://127.0.0.1:8000/docs)
```

**Frontend:**
```bash
cd pcos-frontend
npm.cmd run dev
# Web application available on http://localhost:5173
```

---

## 🔑 Demo Account Credentials
- **Email:** `sarah@example.com`
- **Password:** `Password123!`
- *(Or click the "One-Click Demo Login" button on the Landing / Login pages)*
