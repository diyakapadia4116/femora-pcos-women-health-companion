import datetime
import hashlib
import os
from jose import jwt, JWTError
from typing import Optional, Dict, Any

# JWT Secret & Algorithm configuration
# Read from env (set JWT_SECRET_KEY on Render). Falls back to the old value so existing tokens keep working.
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "pcos_companion_secret_jwt_key_super_secure_key_for_sgp_review")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7 # 7 days

def get_password_hash(password: str) -> str:
    # Use SHA-256 with secure project salt for robust local and cross-platform hashing
    salt = "pcos_secure_salt_2026"
    return hashlib.sha256((password + salt).encode('utf-8')).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    expected_hash = get_password_hash(plain_password)
    return expected_hash == hashed_password or plain_password == hashed_password

def create_access_token(data: dict, expires_delta: Optional[datetime.timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.datetime.utcnow() + expires_delta
    else:
        expire = datetime.datetime.utcnow() + datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None

