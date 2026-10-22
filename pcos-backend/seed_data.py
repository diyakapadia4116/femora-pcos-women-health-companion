import datetime
from sqlalchemy.orm import Session
from database import engine, SessionLocal, Base
from models import User, CycleLog, SymptomLog, LifestyleLog, RiskAssessment, DoctorReport
from auth_service import get_password_hash

def seed_database():
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    try:
        existing_user = db.query(User).filter(User.email == "sarah.j@wellness.com").first()
        if existing_user:
            print("Demo user already exists in database.")
            return

        print("Seeding demo user and clinical records...")
        user = User(
            full_name="Sarah Jenkins",
            email="sarah.j@wellness.com",
            password_hash=get_password_hash("password123"),
            phone_number="+1 (555) 902-1234",
            bio="PCOS Warrior & Wellness Advocate. Focused on cycle syncing, nutrition, and holistic hormone health.",
            age=26,
            height_cm=165.0,
            weight_kg=64.0,
            pcos_diagnosed=True,
            diagnosis_year=2022,
            medical_history="Diagnosed with mild insulin resistance and oligomenorrhea (irregular cycles) in 2022. Responds well to inositol and stress management.",
            target_sleep_hours=8.0,
            target_water_liters=2.5,
            timezone="GMT -05:00 Eastern Time",
            language="English (United States)"
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        today = datetime.date.today()

        # Seed Cycle Logs (Past 6 months)
        cycle_intervals = [
            (today - datetime.timedelta(days=9), today - datetime.timedelta(days=4), 31, 5, "Medium"),
            (today - datetime.timedelta(days=40), today - datetime.timedelta(days=35), 33, 5, "Heavy"),
            (today - datetime.timedelta(days=73), today - datetime.timedelta(days=69), 29, 4, "Medium"),
            (today - datetime.timedelta(days=102), today - datetime.timedelta(days=97), 35, 5, "Light"),
            (today - datetime.timedelta(days=137), today - datetime.timedelta(days=132), 30, 5, "Medium"),
            (today - datetime.timedelta(days=167), today - datetime.timedelta(days=162), 32, 5, "Medium"),
        ]

        for start, end, length, duration, flow in cycle_intervals:
            cycle = CycleLog(
                user_id=user.id,
                start_date=start,
                end_date=end,
                cycle_length=length,
                period_duration=duration,
                flow_intensity=flow,
                cervical_mucus="Dry / None" if (today - start).days > 6 else "Creamy",
                notes="Moderate cramping on day 1-2. Managed with chamomile tea and heat pad."
            )
            db.add(cycle)

        # Seed 14 days of Symptom Logs
        symptom_data = [
            (0, 4, 2, 0, 6, 7, 3, 2, 1, "Felt sluggish throughout the day. Severe bloating after meals."),
            (1, 3, 2, 0, 5, 5, 2, 1, 0, "Acne inflamed around jawline. Energy moderate."),
            (2, 4, 3, 1, 4, 4, 2, 0, 0, "Hair shedding during brushing. Mild afternoon fatigue."),
            (3, 2, 1, 0, 3, 3, 1, 0, 0, "Good energy day. Morning yoga helped."),
            (4, 2, 1, 0, 2, 2, 1, 0, 0, "Stable mood, clear skin."),
            (5, 5, 2, 0, 6, 6, 4, 2, 2, "Exam prep stress. High bloating and cravings."),
            (6, 4, 2, 0, 5, 5, 3, 1, 1, "Late night study session. Fatigue noticeable.")
        ]

        for i in range(14):
            day_offset = i
            ref = symptom_data[i % len(symptom_data)]
            slog = SymptomLog(
                user_id=user.id,
                log_date=today - datetime.timedelta(days=day_offset),
                acne_severity=ref[1],
                hair_fall_severity=ref[2],
                hirsutism_severity=ref[3],
                bloating_severity=ref[4],
                fatigue_severity=ref[5],
                mood_swings_severity=ref[6],
                cramps_severity=ref[7],
                headaches_severity=ref[8],
                daily_notes=ref[9]
            )
            db.add(slog)

        # Seed 14 days of Lifestyle Logs
        lifestyle_data = [
            (1.8, 7.5, "Good", 4, 45, "Morning Yoga", "Low", 1850, 85.0, 24.0, False, ["Meditation", "Vitamins", "Walking", "No Sugar", "Hydrated"], ["Inositol 2000mg", "Vitamin D3 5000IU", "Omega 3 1000mg"]),
            (2.1, 7.0, "Good", 5, 30, "Resistance Training", "Moderate", 1920, 92.0, 28.0, False, ["Vitamins", "Walking", "Hydrated"], ["Inositol 2000mg", "Magnesium 400mg"]),
            (2.4, 8.0, "Deep", 3, 50, "Pilates & Walk", "Low", 1800, 88.0, 18.0, False, ["Meditation", "Vitamins", "Walking", "No Sugar", "Hydrated"], ["Inositol 2000mg", "Vitamin D3 5000IU", "Omega 3 1000mg"]),
            (1.9, 6.5, "Restless", 6, 25, "Brisk Walk", "Low", 2050, 75.0, 35.0, True, ["Walking"], ["Inositol 2000mg"]),
            (2.5, 7.8, "Good", 3, 60, "Morning Yoga & Cycling", "Moderate", 1820, 90.0, 20.0, False, ["Meditation", "Vitamins", "Walking", "No Sugar", "Hydrated"], ["Inositol 2000mg", "Vitamin D3 5000IU", "Omega 3 1000mg"]),
            (2.6, 8.5, "Deep", 2, 75, "Outdoor Hike", "Moderate", 1950, 95.0, 22.0, False, ["Meditation", "Vitamins", "Walking", "Hydrated"], ["Inositol 2000mg", "Omega 3 1000mg"]),
            (2.3, 8.2, "Deep", 2, 45, "Restorative Stretch", "Low", 1780, 82.0, 19.0, False, ["Meditation", "Vitamins", "No Sugar", "Hydrated"], ["Inositol 2000mg", "Vitamin D3 5000IU", "Omega 3 1000mg"])
        ]

        for i in range(14):
            day_offset = i
            ref = lifestyle_data[i % len(lifestyle_data)]
            llog = LifestyleLog(
                user_id=user.id,
                log_date=today - datetime.timedelta(days=day_offset),
                water_liters=ref[0],
                sleep_hours=ref[1],
                sleep_quality=ref[2],
                stress_level=ref[3],
                activity_minutes=ref[4],
                activity_type=ref[5],
                activity_intensity=ref[6],
                calories=ref[7],
                protein_g=ref[8],
                sugar_g=ref[9],
                is_exam_period=ref[10],
                habits_completed=ref[11],
                supplements=ref[12]
            )
            db.add(llog)

        # Seed Risk Assessment
        risk = RiskAssessment(
            user_id=user.id,
            assessment_date=today - datetime.timedelta(days=5),
            avg_cycle_length=31,
            bmi=23.5,
            excessive_hair_growth=False,
            family_history=False,
            adult_acne=True,
            insulin_resistance=True,
            risk_score=28.5,
            risk_category="Low Risk",
            factor_breakdown={
                "irregular_cycles": {"present": False, "weight": 0, "detail": "Cycle length of 31 days is in normal healthy range."},
                "bmi_factor": {"present": False, "weight": 0, "detail": "BMI of 23.5 is in normal reference window."},
                "hirsutism": {"present": False, "weight": 0, "detail": "No significant excess hair growth."},
                "family_history": {"present": False, "weight": 0, "detail": "No known family history."},
                "adult_acne": {"present": True, "weight": 12, "detail": "Mild jawline acne flare-ups noted."},
                "insulin_resistance": {"present": True, "weight": 18, "detail": "Mild insulin sensitivity variance managed via diet."}
            },
            educational_summary="Based on your biometrics and logged cycle regularity, your current risk score is 28.5% (Managed / Low Risk). Continue your anti-inflammatory diet and consistent hydration."
        )
        db.add(risk)

        # Seed Doctor Reports
        reports = [
            DoctorReport(
                user_id=user.id,
                title="Monthly Wellness Analysis - October 2023",
                report_type="Monthly Insight",
                file_size_kb=2400,
                status="Ready",
                shared_with_doctor=True,
                summary_data={"cycle_regularity": 82, "avg_sleep": 7.4, "top_symptom": "Bloating", "wellness_score": 84}
            ),
            DoctorReport(
                user_id=user.id,
                title="Weekly Symptom Log Summary",
                report_type="Weekly Summary",
                file_size_kb=850,
                status="Ready",
                shared_with_doctor=True,
                summary_data={"period_days": 5, "severity_avg": 4.2, "fatigue_drop": "15% reduction"}
            ),
            DoctorReport(
                user_id=user.id,
                title="PCOS Risk Prediction Report",
                report_type="Clinical Assessment",
                file_size_kb=1200,
                status="Ready",
                shared_with_doctor=False,
                summary_data={"risk_score": 28.5, "rotterdam_markers": 1, "category": "Low Risk"}
            ),
            DoctorReport(
                user_id=user.id,
                title="Hormonal Profile (Bloodwork)",
                report_type="Laboratory Result",
                file_size_kb=3100,
                status="Ready",
                shared_with_doctor=True,
                summary_data={"lh_fsh_ratio": "1.4:1 (Stabilizing)", "testosterone_total": "38 ng/dL (Normal)"}
            ),
            DoctorReport(
                user_id=user.id,
                title="November Cycle Prediction",
                report_type="Monthly Insight",
                file_size_kb=950,
                status="Generating",
                shared_with_doctor=False,
                summary_data={"status": "Synthesizing next cycle window..."}
            )
        ]
        for r in reports:
            db.add(r)

        db.commit()
        print("Database seeded successfully with Sarah Jenkins profile!")
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
