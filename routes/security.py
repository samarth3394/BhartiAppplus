from fastapi import APIRouter, Request, Depends, HTTPException, status
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
from models import User
from dependencies import get_current_user
from services.ai_service import scan_security_vulnerabilities

router = APIRouter(tags=["security"])
templates = Jinja2Templates(directory="templates")

class SecurityScanRequest(BaseModel):
    dependencies: str

@router.get("/security", response_class=HTMLResponse)
async def security_page(request: Request, user: User = Depends(get_current_user)):
    return templates.TemplateResponse(request=request, name="security.html")

@router.post("/api/security/scan")
async def scan_dependencies(data: SecurityScanRequest, user: User = Depends(get_current_user)):
    if not data.dependencies or not data.dependencies.strip():
        raise HTTPException(status_code=400, detail="Dependencies content cannot be empty.")
    
    result = scan_security_vulnerabilities(data.dependencies)
    if result.get('status') == 'error':
        raise HTTPException(status_code=500, detail=result.get('message'))
    
    return result.get('data')
