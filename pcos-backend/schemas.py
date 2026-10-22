from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import date, datetime

class UserBase(BaseModel):
    full_name: str
    email: str

class UserCreate(UserBase):
    password: str
    phone_number: Optional[str] = ""
    bio: Optional[str] = "PCOS Warrior & Wellness Explorer"
    age: Optional[int] = 24
    height_cm: Optional[float] = 165.0
    weight_kg: Optional[float] = 60.0
    pcos_diagnosed: Optional[bool] = False
    diagnosis_year: Optional[int] = None
    medical_history: Optional[str] = ""
    target_sleep_hours: Optional[float] = 8.0
    target_water_liters: Optional[float] = 2.5

class UserLogin(BaseModel):
    email: str
    password: str

class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    bio: Optional[str] = None
    age: Optional[int] = None
    height_cm: Optional[float] = None
    weight_kg: Optional[float] = None
    pcos_diagnosed: Optional[bool] = None
    diagnosis_year: Optional[int] = None
    medical_history: Optional[str] = None
    target_sleep_hours: Optional[float] = None
    target_water_liters: Optional[float] = None
    timezone: Optional[str] = None
    language: Optional[str] = None

class UserOut(UserBase):
    id: int
    phone_number: Optional[str] = ""
    bio: Optional[str] = ""
    age: int
    height_cm: float
    weight_kg: float
    pcos_diagnosed: bool
    diagnosis_year: Optional[int] = None
    medical_history: Optional[str] = ""
    target_sleep_hours: float
    target_water_liters: float
    timezone: str
    language: str
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut

# Cycle Schemas
class CycleLogCreate(BaseModel):
    start_date: date
    end_date: Optional[date] = None
    cycle_length: Optional[int] = 28
    period_duration: Optional[int] = 5
    flow_intensity: Optional[str] = "Medium"
    cervical_mucus: Optional[str] = "Dry / None"
    notes: Optional[str] = ""

class CycleLogOut(CycleLogCreate):
    id: int
    user_id: int
    is_predicted: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Symptom Schemas
class SymptomLogCreate(BaseModel):
    log_date: Optional[date] = None
    acne_severity: Optional[int] = 0
    hair_fall_severity: Optional[int] = 0
    hirsutism_severity: Optional[int] = 0
    bloating_severity: Optional[int] = 0
    fatigue_severity: Optional[int] = 0
    mood_swings_severity: Optional[int] = 0
    cramps_severity: Optional[int] = 0
    headaches_severity: Optional[int] = 0
    daily_notes: Optional[str] = ""

class SymptomLogOut(SymptomLogCreate):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Lifestyle Schemas
class LifestyleLogCreate(BaseModel):
    log_date: Optional[date] = None
    water_liters: Optional[float] = 1.8
    sleep_hours: Optional[float] = 7.5
    sleep_quality: Optional[str] = "Good"
    stress_level: Optional[int] = 4
    activity_minutes: Optional[int] = 45
    activity_type: Optional[str] = "Morning Yoga"
    activity_intensity: Optional[str] = "Low"
    calories: Optional[int] = 1850
    protein_g: Optional[float] = 85.0
    sugar_g: Optional[float] = 24.0
    is_exam_period: Optional[bool] = False
    habits_completed: Optional[List[str]] = []
    supplements: Optional[List[str]] = []

class LifestyleLogOut(LifestyleLogCreate):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Risk Assessment Schemas
class RiskAssessmentInput(BaseModel):
    avg_cycle_length: int
    bmi: float
    excessive_hair_growth: bool
    family_history: bool
    adult_acne: bool
    insulin_resistance: bool

class RiskAssessmentOut(BaseModel):
    id: Optional[int] = None
    assessment_date: date
    avg_cycle_length: int
    bmi: float
    excessive_hair_growth: bool
    family_history: bool
    adult_acne: bool
    insulin_resistance: bool
    risk_score: float
    risk_category: str
    factor_breakdown: Dict[str, Any]
    educational_summary: str

# Contact Schema
class ContactCreate(BaseModel):
    name: str
    email: str
    subject: str
    message: str
