from fastapi import APIRouter, Request, Depends, HTTPException, status
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
from typing import Optional
from models import User
from dependencies import get_current_user
from services.ai_service import analyze_raw_logs_with_ai

router = APIRouter(tags=["ai_logs"])
templates = Jinja2Templates(directory="templates")

class LogAnalysisRequest(BaseModel):
    logs: str

@router.get("/ai-logs", response_class=HTMLResponse)
async def ai_logs_page(request: Request, user: User = Depends(get_current_user)):
    return templates.TemplateResponse(request=request, name="ai_logs.html")

@router.post("/api/ai-logs/analyze")
async def analyze_logs(data: LogAnalysisRequest, user: User = Depends(get_current_user)):
    if not data.logs or not data.logs.strip():
        raise HTTPException(status_code=400, detail="Logs cannot be empty.")
    
    result = analyze_raw_logs_with_ai(data.logs)
    if result.get('status') == 'error':
        raise HTTPException(status_code=500, detail=result.get('message'))
    
    return result.get('data')
