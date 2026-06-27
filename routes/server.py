from fastapi import APIRouter, Request, Depends, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone
from typing import Optional

from models import App, ServerMetric, User
from dependencies import get_db, get_current_user

router = APIRouter(tags=["server"])
templates = Jinja2Templates(directory="templates")

@router.get("/server", response_class=HTMLResponse)
async def server_page(request: Request, user: User = Depends(get_current_user)):
    return templates.TemplateResponse(request=request, name="server.html")


@router.get("/api/server/metrics")
async def get_metrics(request: Request, period: Optional[str] = '1h', user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    app_id = request.cookies.get('current_app_id')
    if not app_id:
        raise HTTPException(status_code=400, detail="No app selected")

    app = db.query(App).filter(App.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="App not found")

    hours = 1
    if period == '24h':
        hours = 24
    elif period == '7d':
        hours = 24 * 7

    cutoff = datetime.now(timezone.utc) - timedelta(hours=hours)

    metrics = db.query(ServerMetric).filter(
        ServerMetric.app_id == app.id,
        ServerMetric.timestamp >= cutoff
    ).order_by(ServerMetric.timestamp.asc()).all()

    return {'metrics': [m.to_dict() for m in metrics]}
