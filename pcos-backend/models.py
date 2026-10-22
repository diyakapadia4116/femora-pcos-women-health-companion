import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, Date, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(100), nullable=False)
    email = Column(String(120), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    phone_number = Column(String(30), default="")
    bio = Column(Text, default="PCOS Warrior & Wellness Explorer")
    
    # Biometric Profile
    age = Column(Integer, default=26)
    height_cm = Column(Float, default=165.0)
    weight_kg = Column(Float, default=64.0)
    pcos_diagnosed = Column(Boolean, default=True)
    diagnosis_year = Column(Integer, default=2022)
    medical_history = Column(Text, default="Diagnosed with mild insulin resistance and irregular cycles in 2022.")
    
    # Goals & Preferences
    target_sleep_hours = Column(Float, default=8.0)
    target_water_liters = Column(Float, default=2.5)
    timezone = Column(String(50), default="GMT -05:00 Eastern Time")
    language = Column(String(50), default="English (United States)")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    cycle_logs = relationship("CycleLog", back_populates="user", cascade="all, delete-orphan")
    symptom_logs = relationship("SymptomLog", back_populates="user", cascade="all, delete-orphan")
    lifestyle_logs = relationship("LifestyleLog", back_populates="user", cascade="all, delete-orphan")
    risk_assessments = relationship("RiskAssessment", back_populates="user", cascade="all, delete-orphan")
    doctor_reports = relationship("DoctorReport", back_populates="user", cascade="all, delete-orphan")


class CycleLog(Base):
    __tablename__ = "cycle_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=True)
    cycle_length = Column(Integer, default=31) # in days
    period_duration = Column(Integer, default=5) # in days
    flow_intensity = Column(String(20), default="Medium") # None, Light, Medium, Heavy
    cervical_mucus = Column(String(50), default="Dry / None") # Dry / None, Sticky, Creamy, Egg White
    is_predicted = Column(Boolean, default=False)
    notes = Column(Text, default="")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="cycle_logs")


class SymptomLog(Base):
    __tablename__ = "symptom_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    log_date = Column(Date, nullable=False, index=True)
    
    # Severity scores 0 (None) to 10 (Severe)
    acne_severity = Column(Integer, default=0)
    hair_fall_severity = Column(Integer, default=0)
    hirsutism_severity = Column(Integer, default=0)
    bloating_severity = Column(Integer, default=0)
    fatigue_severity = Column(Integer, default=0)
    mood_swings_severity = Column(Integer, default=0)
    cramps_severity = Column(Integer, default=0)
    headaches_severity = Column(Integer, default=0)
    
    daily_notes = Column(Text, default="")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="symptom_logs")


class LifestyleLog(Base):
    __tablename__ = "lifestyle_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    log_date = Column(Date, nullable=False, index=True)
    
    water_liters = Column(Float, default=1.8)
    sleep_hours = Column(Float, default=7.5)
    sleep_quality = Column(String(30), default="Good") # Restless, Fair, Good, Deep
    stress_level = Column(Integer, default=4) # 1 (Calm) to 10 (Extreme)
    activity_minutes = Column(Integer, default=45)
    activity_type = Column(String(50), default="Morning Yoga")
    activity_intensity = Column(String(20), default="Low") # Low, Moderate, High
    
    # Nutrition metrics
    calories = Column(Integer, default=1850)
    protein_g = Column(Float, default=85.0)
    sugar_g = Column(Float, default=24.0)
    
    # Academic / Life context
    is_exam_period = Column(Boolean, default=False)
    habits_completed = Column(JSON, default=list) # e.g. ["Meditation", "Vitamins", "Walking", "No Sugar", "Hydrated"]
    supplements = Column(JSON, default=list) # e.g. ["Inositol 2000mg", "Vitamin D3 5000IU", "Omega 3 1000mg"]
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="lifestyle_logs")


class RiskAssessment(Base):
    __tablename__ = "risk_assessments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    assessment_date = Column(Date, nullable=False, default=datetime.date.today)
    
    avg_cycle_length = Column(Integer, default=32)
    bmi = Column(Float, default=23.5)
    excessive_hair_growth = Column(Boolean, default=False)
    family_history = Column(Boolean, default=False)
    adult_acne = Column(Boolean, default=False)
    insulin_resistance = Column(Boolean, default=False)
    
    risk_score = Column(Float, default=28.5) # 0 to 100%
    risk_category = Column(String(30), default="Low Risk") # Low Risk, Moderate Risk, Elevated / High Risk
    factor_breakdown = Column(JSON, default=dict)
    educational_summary = Column(Text, default="")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="risk_assessments")


class DoctorReport(Base):
    __tablename__ = "doctor_reports"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(150), nullable=False)
    report_type = Column(String(50), default="Monthly Wellness Analysis") # Monthly, Weekly, Clinical, Risk
    file_size_kb = Column(Integer, default=1200)
    status = Column(String(30), default="Ready") # Ready, Generating
    shared_with_doctor = Column(Boolean, default=False)
    summary_data = Column(JSON, default=dict)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="doctor_reports")


class ContactMessage(Base):
    __tablename__ = "contact_messages"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(120), nullable=False)
    subject = Column(String(150), nullable=False)
    message = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
