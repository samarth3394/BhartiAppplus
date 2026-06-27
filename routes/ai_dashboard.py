from fastapi import APIRouter, Request, Depends, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional

from services.ai_service import generate_cto_summary
from models import App, FailurePrediction, User
from dependencies import get_db, get_current_user

router = APIRouter(tags=["ai_dashboard"])
templates = Jinja2Templates(directory="templates")

class AISettingsRequest(BaseModel):
    hourly_revenue: Optional[float] = 0.0

@router.get("/ai-dashboard", response_class=HTMLResponse)
async def ai_dashboard_page(request: Request, user: User = Depends(get_current_user)):
    return templates.TemplateResponse(request=request, name="ai_dashboard.html")

@router.get("/api/ai-dashboard/summary")
async def get_ai_summary(request: Request, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    app_id = request.cookies.get('current_app_id')
    if not app_id:
        raise HTTPException(status_code=400, detail="No app selected")
        
    result = generate_cto_summary(db, app_id)
    if result['status'] == 'error':
        raise HTTPException(status_code=500, detail=result['message'])
        
    return {'summary': result['data']}

@router.get("/api/ai-dashboard/settings")
async def get_ai_dashboard_settings(request: Request, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    app_id = request.cookies.get('current_app_id')
    if not app_id:
        raise HTTPException(status_code=400, detail="No app selected")
        
    app = db.query(App).filter(App.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="App not found")

    settings = app.settings or {}
    return {'hourly_revenue': settings.get('hourly_revenue', 0)}

@router.post("/api/ai-dashboard/settings")
async def update_ai_dashboard_settings(data: AISettingsRequest, request: Request, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    app_id = request.cookies.get('current_app_id')
    if not app_id:
        raise HTTPException(status_code=400, detail="No app selected")
        
    app = db.query(App).filter(App.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="App not found")

    settings = app.settings or {}
    revenue = float(data.hourly_revenue or 0.0)
        
    settings['hourly_revenue'] = revenue
    app.settings = settings
    from sqlalchemy.orm.attributes import flag_modified
    flag_modified(app, 'settings')
    
    db.commit()
    return {'message': 'Settings saved successfully', 'hourly_revenue': revenue}

@router.post("/api/predictions/run")
async def run_prediction_api(request: Request, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    app_id = request.cookies.get('current_app_id')
    if not app_id:
        raise HTTPException(status_code=400, detail="No app selected")

    from services.prediction_engine import run_prediction
    result = run_prediction(db, app_id)
    return {'prediction': result}

@router.get("/api/predictions/latest")
async def get_latest_prediction(request: Request, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    app_id = request.cookies.get('current_app_id')
    if not app_id:
        raise HTTPException(status_code=400, detail="No app selected")

    prediction = db.query(FailurePrediction).filter(FailurePrediction.app_id == app_id).order_by(
        FailurePrediction.created_at.desc()
    ).first()

    return {'prediction': prediction.to_dict() if prediction else None}
