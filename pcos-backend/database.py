import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Attempt to load from .env file if python-dotenv is installed
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

# =========================================================================
# DATABASE CONFIGURATION
# =========================================================================
# On Render: set DATABASE_URL environment variable to your Supabase
#   Session Pooler URL (port 6543, IPv4-compatible):
#   postgresql://postgres.xxxx:PASSWORD@aws-0-region.pooler.supabase.com:6543/postgres
#
# For local development: set DATABASE_URL in a .env file, or it falls
#   back to a local SQLite database so the app still runs without Postgres.
# =========================================================================

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite:///./pcos_local.db"  # Safe local fallback — no credentials needed
)

# Fix for Render/Heroku which may provide "postgres://" instead of "postgresql://"
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# SQLite needs check_same_thread=False; PostgreSQL does not.
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
    pool_pre_ping=True,
    pool_recycle=3600
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
