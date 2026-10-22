import datetime
from fastapi import FastAPI, Depends, HTTPException, status, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional

from database import engine, get_db, Base
from models import User, CycleLog, SymptomLog, LifestyleLog, RiskAssessment, DoctorReport, ContactMessage
from schemas import (
    UserCreate, UserLogin, UserProfileUpdate, UserOut, Token,
    CycleLogCreate, CycleLogOut,
    SymptomLogCreate, SymptomLogOut,
    LifestyleLogCreate, LifestyleLogOut,
    RiskAssessmentInput, RiskAssessmentOut,
    ContactCreate
)
from auth_service import (
    get_password_hash, verify_password, create_access_token, decode_access_token
)
from analytics_engine import (
    calculate_cycle_analytics,
    calculate_symptom_analytics,
    calculate_lifestyle_correlations,
    calculate_pcos_risk,
    get_curated_recommendations
)
from seed_data import seed_database

# Create tables
try:
    Base.metadata.create_all(bind=engine)
    print("✓ Database tables verified and created successfully.")
except Exception as e:
    print("\n" + "="*70)
    print("⚠️  DATABASE CONNECTION NOTICE:")
    print(f"Could not connect to database or create tables: {e}")
    print("If using PostgreSQL:")
    print(" 1. Make sure PostgreSQL service is running.")
    print(" 2. Make sure the database exists. Run in pgAdmin / psql: CREATE DATABASE pcos_db;")
    print(" 3. Check DB_PASS and DB_USER in database.py")
    print("="*70 + "\n")

app = FastAPI(
    title="Women's Health Intelligence Platform - PCOS Companion API",
    description="Backend API supporting PCOS Cycle Tracking, Symptom Analytics, Rotterdam Risk Scoring, and Lifestyle Correlation Engine",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    # PostgreSQL startup: Database tables are ready for real user registrations
    print("✓ Backend ready for incoming requests & user registrations.")

@app.get("/")
def root():
    return {
        "platform": "Women's Health Intelligence Platform (PCOS Companion)",
        "status": "Online & Operational",
        "version": "1.0.0",
        "docs": "/docs",
        "project": "5th Semester Software Group Project"
    }

# Helper dependency to extract current user from Authorization header
def get_current_user(authorization: Optional[str] = Header(None), db: Session = Depends(get_db)) -> User:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required. Please log in.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = authorization.split(" ")[1]
    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired session token. Please log in again.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = db.query(User).filter(User.email == payload["sub"]).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User account not found in database.")
    return user


# ==========================================
# AUTHENTICATION ENDPOINTS
# ==========================================

@app.post("/api/auth/register", response_model=Token)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    clean_email = user_data.email.strip().lower()
    existing = db.query(User).filter(User.email == clean_email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists. Please log in instead."
        )

    new_user = User(
        full_name=user_data.full_name.strip(),
        email=clean_email,
        password_hash=get_password_hash(user_data.password),
        phone_number=user_data.phone_number or "",
        bio=user_data.bio or "PCOS Warrior & Wellness Explorer",
        age=user_data.age if user_data.age is not None else 24,
        height_cm=user_data.height_cm if user_data.height_cm is not None else 165.0,
        weight_kg=user_data.weight_kg if user_data.weight_kg is not None else 60.0,
        pcos_diagnosed=user_data.pcos_diagnosed if user_data.pcos_diagnosed is not None else False,
        diagnosis_year=user_data.diagnosis_year,
        medical_history=user_data.medical_history or "",
        target_sleep_hours=user_data.target_sleep_hours or 8.0,
        target_water_liters=user_data.target_water_liters or 2.5
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token(data={"sub": new_user.email})
    return {"access_token": token, "token_type": "bearer", "user": new_user}


@app.post("/api/auth/login", response_model=Token)
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    clean_email = login_data.email.strip().lower()
    user = db.query(User).filter(User.email == clean_email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No account found with this email. Please verify your email or sign up first."
        )
    if not verify_password(login_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect password. Please try again."
        )

    token = create_access_token(data={"sub": user.email})
    return {"access_token": token, "token_type": "bearer", "user": user}


@app.get("/api/auth/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


# ==========================================
# USER PROFILE ENDPOINTS
# ==========================================

@app.get("/api/user/profile", response_model=UserOut)
def get_profile(current_user: User = Depends(get_current_user)):
    return current_user


@app.put("/api/user/profile", response_model=UserOut)
def update_profile(profile_data: UserProfileUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    update_dict = profile_data.dict(exclude_unset=True)
    for key, value in update_dict.items():
        setattr(current_user, key, value)
    db.commit()
    db.refresh(current_user)
    return current_user


# ==========================================
# CYCLE TRACKER ENDPOINTS
# ==========================================

@app.get("/api/cycle/logs", response_model=List[CycleLogOut])
def get_cycle_logs(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    logs = db.query(CycleLog).filter(CycleLog.user_id == current_user.id).order_by(CycleLog.start_date.desc()).all()
    return logs


@app.post("/api/cycle/logs", response_model=CycleLogOut)
def add_cycle_log(log_data: CycleLogCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    cycle = CycleLog(
        user_id=current_user.id,
        start_date=log_data.start_date,
        end_date=log_data.end_date,
        cycle_length=log_data.cycle_length or 28,
        period_duration=log_data.period_duration or 5,
        flow_intensity=log_data.flow_intensity or "Medium",
        cervical_mucus=log_data.cervical_mucus or "Dry / None",
        notes=log_data.notes or ""
    )
    db.add(cycle)
    db.commit()
    db.refresh(cycle)
    return cycle


@app.put("/api/cycle/logs/{log_id}", response_model=CycleLogOut)
def update_cycle_log(log_id: int, log_data: CycleLogCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    cycle = db.query(CycleLog).filter(CycleLog.id == log_id, CycleLog.user_id == current_user.id).first()
    if not cycle:
        raise HTTPException(status_code=404, detail="Cycle log not found")
    
    cycle.start_date = log_data.start_date
    cycle.end_date = log_data.end_date
    cycle.cycle_length = log_data.cycle_length or 28
    cycle.period_duration = log_data.period_duration or 5
    cycle.flow_intensity = log_data.flow_intensity or "Medium"
    cycle.cervical_mucus = log_data.cervical_mucus or "Dry / None"
    cycle.notes = log_data.notes or ""
    
    db.commit()
    db.refresh(cycle)
    return cycle


@app.delete("/api/cycle/logs/all")
def clear_all_cycle_logs(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db.query(CycleLog).filter(CycleLog.user_id == current_user.id).delete()
    db.commit()
    return {"message": "All cycle logs cleared successfully"}


@app.delete("/api/cycle/logs/{log_id}")
def delete_cycle_log(log_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    cycle = db.query(CycleLog).filter(CycleLog.id == log_id, CycleLog.user_id == current_user.id).first()
    if cycle:
        db.delete(cycle)
        db.commit()
    return {"message": "Cycle log deleted successfully"}


@app.get("/api/cycle/analytics")
def get_cycle_analytics(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    logs = db.query(CycleLog).filter(CycleLog.user_id == current_user.id).all()
    return calculate_cycle_analytics(logs, current_user.created_at)


# ==========================================
# SYMPTOM TRACKER ENDPOINTS
# ==========================================

@app.get("/api/symptoms/logs", response_model=List[SymptomLogOut])
def get_symptom_logs(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    logs = db.query(SymptomLog).filter(SymptomLog.user_id == current_user.id).order_by(SymptomLog.log_date.desc()).all()
    return logs


@app.post("/api/symptoms/logs", response_model=SymptomLogOut)
def add_symptom_log(log_data: SymptomLogCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    log_date = log_data.log_date or datetime.date.today()
    existing = db.query(SymptomLog).filter(SymptomLog.user_id == current_user.id, SymptomLog.log_date == log_date).first()
    
    if existing:
        for k, v in log_data.dict(exclude_unset=True).items():
            if k != "log_date":
                setattr(existing, k, v)
        db.commit()
        db.refresh(existing)
        return existing

    slog = SymptomLog(
        user_id=current_user.id,
        log_date=log_date,
        acne_severity=log_data.acne_severity or 0,
        hair_fall_severity=log_data.hair_fall_severity or 0,
        hirsutism_severity=log_data.hirsutism_severity or 0,
        bloating_severity=log_data.bloating_severity or 0,
        fatigue_severity=log_data.fatigue_severity or 0,
        mood_swings_severity=log_data.mood_swings_severity or 0,
        cramps_severity=log_data.cramps_severity or 0,
        headaches_severity=log_data.headaches_severity or 0,
        daily_notes=log_data.daily_notes or ""
    )
    db.add(slog)
    db.commit()
    db.refresh(slog)
    return slog


@app.get("/api/symptoms/analytics")
def get_symptom_analytics(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    logs = db.query(SymptomLog).filter(SymptomLog.user_id == current_user.id).all()
    return calculate_symptom_analytics(logs)


# ==========================================
# LIFESTYLE TRACKER ENDPOINTS
# ==========================================

@app.get("/api/lifestyle/logs", response_model=List[LifestyleLogOut])
def get_lifestyle_logs(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    logs = db.query(LifestyleLog).filter(LifestyleLog.user_id == current_user.id).order_by(LifestyleLog.log_date.desc()).all()
    return logs


@app.post("/api/lifestyle/logs", response_model=LifestyleLogOut)
def add_lifestyle_log(log_data: LifestyleLogCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    log_date = log_data.log_date or datetime.date.today()
    existing = db.query(LifestyleLog).filter(LifestyleLog.user_id == current_user.id, LifestyleLog.log_date == log_date).first()
    
    if existing:
        for k, v in log_data.dict(exclude_unset=True).items():
            if k != "log_date":
                setattr(existing, k, v)
        db.commit()
        db.refresh(existing)
        return existing

    llog = LifestyleLog(
        user_id=current_user.id,
        log_date=log_date,
        water_liters=log_data.water_liters or 1.8,
        sleep_hours=log_data.sleep_hours or 7.5,
        sleep_quality=log_data.sleep_quality or "Good",
        stress_level=log_data.stress_level or 4,
        activity_minutes=log_data.activity_minutes or 45,
        activity_type=log_data.activity_type or "Morning Yoga",
        activity_intensity=log_data.activity_intensity or "Low",
        calories=log_data.calories or 1850,
        protein_g=log_data.protein_g or 85.0,
        sugar_g=log_data.sugar_g or 24.0,
        is_exam_period=log_data.is_exam_period or False,
        habits_completed=log_data.habits_completed or [],
        supplements=log_data.supplements or []
    )
    db.add(llog)
    db.commit()
    db.refresh(llog)
    return llog


@app.get("/api/lifestyle/summary")
def get_lifestyle_summary(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    l_logs = db.query(LifestyleLog).filter(LifestyleLog.user_id == current_user.id).all()
    s_logs = db.query(SymptomLog).filter(SymptomLog.user_id == current_user.id).all()
    return calculate_lifestyle_correlations(l_logs, s_logs)


# ==========================================
# RISK ASSESSMENT ENDPOINTS
# ==========================================

@app.post("/api/risk-assessment/calculate", response_model=RiskAssessmentOut)
def calculate_risk(input_data: RiskAssessmentInput, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    result = calculate_pcos_risk(input_data.dict())
    
    assessment = RiskAssessment(
        user_id=current_user.id,
        assessment_date=datetime.date.today(),
        avg_cycle_length=input_data.avg_cycle_length,
        bmi=input_data.bmi,
        excessive_hair_growth=input_data.excessive_hair_growth,
        family_history=input_data.family_history,
        adult_acne=input_data.adult_acne,
        insulin_resistance=input_data.insulin_resistance,
        risk_score=result["risk_score"],
        risk_category=result["risk_category"],
        factor_breakdown=result["factor_breakdown"],
        educational_summary=result["educational_summary"]
    )
    db.add(assessment)
    db.commit()
    db.refresh(assessment)
    return assessment


@app.get("/api/risk-assessment/latest", response_model=RiskAssessmentOut)
def get_latest_risk(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    latest = db.query(RiskAssessment).filter(RiskAssessment.user_id == current_user.id).order_by(RiskAssessment.assessment_date.desc()).first()
    if not latest:
        # Generate default baseline
        baseline_input = {
            "avg_cycle_length": 31,
            "bmi": 23.5,
            "excessive_hair_growth": False,
            "family_history": False,
            "adult_acne": True,
            "insulin_resistance": True
        }
        res = calculate_pcos_risk(baseline_input)
        return {
            "assessment_date": datetime.date.today(),
            "avg_cycle_length": 31,
            "bmi": 23.5,
            "excessive_hair_growth": False,
            "family_history": False,
            "adult_acne": True,
            "insulin_resistance": True,
            "risk_score": res["risk_score"],
            "risk_category": res["risk_category"],
            "factor_breakdown": res["factor_breakdown"],
            "educational_summary": res["educational_summary"]
        }
    return latest


# ==========================================
# HOLISTIC HEALTH ANALYTICS DASHBOARD
# ==========================================

@app.get("/api/analytics/dashboard")
def get_dashboard_data(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    c_logs = db.query(CycleLog).filter(CycleLog.user_id == current_user.id).all()
    s_logs = db.query(SymptomLog).filter(SymptomLog.user_id == current_user.id).all()
    l_logs = db.query(LifestyleLog).filter(LifestyleLog.user_id == current_user.id).all()

    cycle_data = calculate_cycle_analytics(c_logs, current_user.created_at)
    symptom_data = calculate_symptom_analytics(s_logs)
    lifestyle_data = calculate_lifestyle_correlations(l_logs, s_logs)

    return {
        "user": {
            "name": current_user.full_name,
            "email": current_user.email,
            "pcos_diagnosed": current_user.pcos_diagnosed
        },
        "cycle": cycle_data,
        "symptoms": symptom_data,
        "lifestyle": lifestyle_data,
        "todays_focus": [
            {
                "title": "Increase Fiber",
                "time": "BREAKFAST",
                "desc": "Support hormone detoxification with greens & chia seeds.",
                "icon": "leaf"
            },
            {
                "title": "Daily Meditation",
                "time": "10:30 AM",
                "desc": "10 mins to manage cortisol levels and morning stress.",
                "icon": "clock"
            },
            {
                "title": "Limit Caffeine",
                "time": "ALL DAY",
                "desc": "Try to avoid after 2 PM for better sleep & adrenals.",
                "icon": "coffee"
            }
        ],
        "health_tip": {
            "title": "Spearmint Tea & PCOS",
            "body": "Studies suggest that drinking spearmint tea twice daily may help reduce androgen levels in women with PCOS."
        }
    }


# ==========================================
# RECOMMENDATIONS & AI HEALTH COACH
# ==========================================

@app.get("/api/recommendations")
def get_recommendations():
    return get_curated_recommendations()


# ==========================================
# DOCTOR REPORTS
# ==========================================

@app.get("/api/reports")
def get_doctor_reports(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    reports = db.query(DoctorReport).filter(DoctorReport.user_id == current_user.id).order_by(DoctorReport.created_at.desc()).all()
    return reports


@app.post("/api/reports/generate")
def generate_report(title: str = "Monthly Wellness Analysis", report_type: str = "Monthly Insight", current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    new_report = DoctorReport(
        user_id=current_user.id,
        title=f"{title} - {datetime.date.today().strftime('%B %Y')}",
        report_type=report_type,
        file_size_kb=1850,
        status="Ready",
        shared_with_doctor=True,
        summary_data={
            "patient": current_user.full_name,
            "generated_date": datetime.date.today().isoformat(),
            "avg_cycle_length": 31,
            "symptom_severity_avg": 4.2,
            "recommendation": "Maintain myo-inositol protocol and low-GI nutritional intake."
        }
    )
    db.add(new_report)
    db.commit()
    db.refresh(new_report)
    return new_report


# ==========================================
# CONTACT US
# ==========================================

@app.post("/api/contact")
def submit_contact(msg: ContactCreate, db: Session = Depends(get_db)):
    contact = ContactMessage(
        name=msg.name,
        email=msg.email,
        subject=msg.subject,
        message=msg.message
    )
    db.add(contact)
    db.commit()
    return {"status": "success", "message": "Thank you for reaching out! Our health team will get back to you within 24 hours."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

