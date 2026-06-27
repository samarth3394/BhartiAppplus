from fastapi import APIRouter, Request, Depends, HTTPException, Query
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone
from pydantic import BaseModel
from typing import Optional

from models import App, UptimeCheck, UptimeIncident, ActivityLog, AiIncident, User
from dependencies import get_db, get_current_user

router = APIRouter(tags=["uptime"])
templates = Jinja2Templates(directory="templates")

class ConfigureMonitoringRequest(BaseModel):
    url: Optional[str] = ""
    monitoring_enabled: Optional[bool] = True


@router.get("/uptime", response_class=HTMLResponse)
async def uptime_page(request: Request, user: User = Depends(get_current_user)):
    return templates.TemplateResponse(request=request, name="uptime.html")


@router.get("/api/uptime/status")
async def uptime_status(request: Request, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    app_id = request.cookies.get('current_app_id')
    if not app_id:
        raise HTTPException(status_code=400, detail="No app selected")

    app = db.query(App).filter(App.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="App not found")

    # Latest check
    latest = db.query(UptimeCheck).filter(UptimeCheck.app_id == app_id).order_by(
        UptimeCheck.checked_at.desc()
    ).first()

    # Active incident
    active_incident = db.query(UptimeIncident).filter(
        UptimeIncident.app_id == app_id,
        UptimeIncident.resolved_at.is_(None)
    ).first()

    # Stats for different periods
    now = datetime.now(timezone.utc)
    periods = {'24h': 24, '7d': 168, '30d': 720}
    stats = {}
    for label, hours in periods.items():
        since = now - timedelta(hours=hours)
        checks = db.query(UptimeCheck).filter(
            UptimeCheck.app_id == app_id,
            UptimeCheck.checked_at >= since
        ).all()
        if checks:
            up_count = sum(1 for c in checks if c.is_up)
            avg_response = sum(c.response_time_ms or 0 for c in checks) / len(checks)
            stats[label] = {
                'uptime_pct': round((up_count / len(checks)) * 100, 2),
                'avg_response_ms': round(avg_response, 1),
                'total_checks': len(checks),
            }
        else:
            stats[label] = {'uptime_pct': 100, 'avg_response_ms': 0, 'total_checks': 0}

    return {
        'app': app.to_dict(),
        'is_up': latest.is_up if latest else True,
        'latest_check': latest.to_dict() if latest else None,
        'active_incident': active_incident.to_dict() if active_incident else None,
        'stats': stats,
        'ssl_expiry': latest.ssl_expiry_date.isoformat() if latest and latest.ssl_expiry_date else None,
    }


@router.get("/api/uptime/history")
async def uptime_history(request: Request, period: str = "24h", user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    app_id = request.cookies.get('current_app_id')
    if not app_id:
        raise HTTPException(status_code=400, detail="No app selected")

    hours_map = {'24h': 24, '7d': 168, '30d': 720}
    hours = hours_map.get(period, 24)

    since = datetime.now(timezone.utc) - timedelta(hours=hours)
    checks = db.query(UptimeCheck).filter(
        UptimeCheck.app_id == app_id,
        UptimeCheck.checked_at >= since
    ).order_by(UptimeCheck.checked_at.asc()).all()

    return {
        'checks': [c.to_dict() for c in checks],
        'period': period,
    }


@router.get("/api/uptime/incidents")
async def uptime_incidents(request: Request, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    app_id = request.cookies.get('current_app_id')
    if not app_id:
        raise HTTPException(status_code=400, detail="No app selected")

    incidents = db.query(UptimeIncident).filter(
        UptimeIncident.app_id == app_id
    ).order_by(UptimeIncident.started_at.desc()).limit(50).all()

    result = []
    for inc in incidents:
        data = inc.to_dict()
        ai = db.query(AiIncident).filter(AiIncident.incident_id == inc.id).first()
        data['ai_analysis'] = ai.to_dict() if ai else None
        result.append(data)

    return {'incidents': result}


@router.post("/api/uptime/configure")
async def configure_monitoring(data: ConfigureMonitoringRequest, request: Request, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    app_id = request.cookies.get('current_app_id')
    if not app_id:
        raise HTTPException(status_code=400, detail="No app selected")

    app = db.query(App).filter(App.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="App not found")

    if app.owner_id != user.id:
        raise HTTPException(status_code=403, detail="Only the app owner can change monitoring settings")

    if data.url:
        app.url = data.url.strip()

    settings = app.settings or {}
    settings['monitoring_enabled'] = data.monitoring_enabled
    app.settings = settings
    
    from sqlalchemy.orm.attributes import flag_modified
    flag_modified(app, 'settings')

    log = ActivityLog(
        app_id=app_id,
        user_id=user.id,
        action=f'Updated monitoring settings',
        entity_type='uptime',
        entity_id=app_id,
    )
    db.add(log)
    db.commit()

    return {'message': 'Settings updated', 'app': app.to_dict()}
