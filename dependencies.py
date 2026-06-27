import os
from datetime import datetime, timedelta, timezone
from fastapi import Request, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
import bcrypt
from sqlalchemy.orm import Session
from models import User
from config import Config

# --- Database Dependency ---
def get_db():
    from database import db_session
    db = db_session()
    try:
        yield db
    finally:
        db.close()

# --- Security & JWT Config ---
SECRET_KEY = Config.SECRET_KEY or "dev-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7 # 7 days

def verify_password(plain_password, hashed_password):
    if isinstance(plain_password, str):
        plain_password = plain_password.encode('utf-8')
    if isinstance(hashed_password, str):
        hashed_password = hashed_password.encode('utf-8')
    try:
        return bcrypt.checkpw(plain_password, hashed_password)
    except Exception:
        return False

def get_password_hash(password):
    if isinstance(password, str):
        password = password.encode('utf-8')
    return bcrypt.hashpw(password, bcrypt.gensalt()).decode('utf-8')

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# --- Authentication Dependency ---
def get_current_user(request: Request, db: Session = Depends(get_db)):
    """Extract JWT from HTTP-only cookie and return the user."""
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Optional: Strip 'Bearer ' if present
    if token.startswith("Bearer "):
        token = token.split(" ")[1]

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
        
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
        
    # We can attach the active app_id to the user object temporarily if needed
    user.current_app_id = request.cookies.get("current_app_id")
    
    return user

def get_current_user_optional(request: Request, db: Session = Depends(get_db)):
    """Extract JWT from cookie, return None if not present (useful for templates)."""
    token = request.cookies.get("access_token")
    if not token:
        return None
    if token.startswith("Bearer "):
        token = token.split(" ")[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id:
            user = db.query(User).filter(User.id == user_id).first()
            if user:
                user.current_app_id = request.cookies.get("current_app_id")
                return user
    except JWTError:
        pass
    return None
