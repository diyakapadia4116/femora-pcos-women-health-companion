import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Load .env for local development (harmless on Render where real env vars exist)
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

# =========================================================================
# DATABASE CONFIGURATION
# =========================================================================
# On Render set DATABASE_URL to your Supabase connection string, e.g. the
# Session Pooler URL from Supabase > Connect > Session pooler:
#   postgresql://postgres.<ref>:<PASSWORD>@aws-0-<region>.pooler.supabase.com:5432/postgres
# (Render's free tier has no IPv6, so use the pooler host, not db.<ref>.supabase.co)
#
# Locally, with no DATABASE_URL, the app falls back to SQLite.
# =========================================================================

def _normalize_database_url(url: str) -> str:
    url = (url or "").strip().strip('"').strip("'")
    if not url:
        return "sqlite:///./pcos_local.db"
    # requirements.txt ships psycopg v3, so SQLAlchemy must be told to use it.
    # A bare "postgresql://" makes SQLAlchemy look for psycopg2 -> ImportError -> crash on boot.
    if url.startswith("postgres://"):
        url = "postgresql+psycopg://" + url[len("postgres://"):]
    elif url.startswith("postgresql://"):
        url = "postgresql+psycopg://" + url[len("postgresql://"):]
    return url

DATABASE_URL = _normalize_database_url(os.getenv("DATABASE_URL", ""))
IS_SQLITE = DATABASE_URL.startswith("sqlite")
IS_POSTGRES = DATABASE_URL.startswith("postgresql")

connect_args = {}
if IS_SQLITE:
    connect_args = {"check_same_thread": False}
elif IS_POSTGRES:
    # Supabase requires SSL; the pooler (pgbouncer) does not support server-side prepared statements.
    connect_args = {"prepare_threshold": None}
    if "sslmode=" not in DATABASE_URL:
        connect_args["sslmode"] = "require"

engine_kwargs = dict(connect_args=connect_args, pool_pre_ping=True, pool_recycle=300)
if IS_POSTGRES:
    # Keep the pool small: Supabase poolers / free tier have tight connection limits.
    engine_kwargs.update(pool_size=3, max_overflow=2)

engine = create_engine(DATABASE_URL, **engine_kwargs)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
