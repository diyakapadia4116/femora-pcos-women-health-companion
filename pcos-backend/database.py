import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from urllib.parse import quote_plus

# Attempt to load from .env file if python-dotenv is installed
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

# =========================================================================
# DATABASE CONFIGURATION (PostgreSQL / SQLite)
# =========================================================================
# Set your PostgreSQL credentials below:
DB_USER = "postgres"
DB_PASS = "diyakapadia4116"  # Your PostgreSQL password
DB_HOST = "localhost"
DB_PORT = "5432"
DB_NAME = "pcos_db"

# Construct connection URL with safe URL-encoding for password
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    f"postgresql://{DB_USER}:{quote_plus(DB_PASS)}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
)

# SQLite needs check_same_thread=False; PostgreSQL and MySQL do not.
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
