from fastapi import APIRouter, Request, Depends, HTTPException, status, Response
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from models import User, utc_now
from dependencies import (
    get_db, get_current_user, get_current_user_optional, 
    verify_password, get_password_hash, create_access_token
)

router = APIRouter(tags=["auth"])
templates = Jinja2Templates(directory="templates")

# --- Schemas ---
class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

# --- HTML Pages ---
@router.get("/auth/login", response_class=HTMLResponse)
async def login_page(request: Request, user: User = Depends(get_current_user_optional)):
    if user:
        return RedirectResponse(url="/dashboard", status_code=303)
    return templates.TemplateResponse(request=request, name="auth/login.html")

@router.get("/auth/register", response_class=HTMLResponse)
async def register_page(request: Request, user: User = Depends(get_current_user_optional)):
    if user:
        return RedirectResponse(url="/dashboard", status_code=303)
    return templates.TemplateResponse(request=request, name="auth/register.html")

@router.get("/setup", response_class=HTMLResponse)
async def setup_page(request: Request, user: User = Depends(get_current_user)):
    return templates.TemplateResponse(request=request, name="auth/setup.html")

@router.get("/logout")
async def logout_page(response: Response):
    res = RedirectResponse(url="/auth/login", status_code=303)
    res.delete_cookie("access_token")
    res.delete_cookie("current_app_id")
    return res


# --- APIs ---
@router.post("/api/auth/register", status_code=status.HTTP_201_CREATED)
async def register(data: RegisterRequest, response: Response, db: Session = Depends(get_db)):
    if len(data.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")
        
    existing = db.query(User).filter(User.email == data.email.lower()).first()
    if existing:
        raise HTTPException(status_code=409, detail="Email already registered")

    user = User(
        email=data.email.lower(),
        password_hash=get_password_hash(data.password),
        full_name=data.full_name,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Auto login
    access_token = create_access_token(data={"sub": str(user.id)})
    response.set_cookie(key="access_token", value=access_token, httponly=True, max_age=60*24*7)
    
    return {"message": "Registration successful", "user": user.to_dict()}

@router.post("/api/auth/login")
async def login(data: LoginRequest, response: Response, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email.lower()).first()
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    user.last_login = utc_now()
    db.commit()

    access_token = create_access_token(data={"sub": str(user.id)})
    response.set_cookie(key="access_token", value=access_token, httponly=True, max_age=60*24*7)
    
    return {"message": "Login successful", "user": user.to_dict()}

@router.post("/api/auth/logout")
async def logout(response: Response, user: User = Depends(get_current_user)):
    response.delete_cookie("access_token")
    response.delete_cookie("current_app_id")
    return {"message": "Logged out successfully"}

@router.get("/api/auth/me")
async def me(user: User = Depends(get_current_user)):
    return {"user": user.to_dict()}
