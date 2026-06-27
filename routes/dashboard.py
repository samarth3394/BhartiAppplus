from fastapi import APIRouter, Request, Depends, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from typing import Optional

from models import (
    App, AppMember, Bug, BugStatusEnum, SeverityEnum,
    MaintenanceTask, UptimeCheck, ActivityLog, UptimeIncident, User
)
from services.health_score import calculate_health_score, get_uptime_percentage
from dependencies import get_db, get_current_user, get_current_user_optional

router = APIRouter(tags=["dashboard"])
templates = Jinja2Templates(directory="templates")

def _get_current_app(db: Session, user: User, current_app_id: Optional[str] = None):
    """Get the currently selected app for the user."""
    if current_app_id:
        app = db.query(App).filter(App.id == current_app_id).first()
        if app:
            return app

    # Fall back to first owned app
    app = db.query(App).filter(App.owner_id == user.id).first()
    if not app:
        # Check memberships
        member = db.query(AppMember).filter(AppMember.user_id == user.id).first()
        if member:
            app = member.app
    return app

@router.get("/dashboard", response_class=HTMLResponse)
async def dashboard_page(request: Request, user: User = Depends(get_current_user)):
    return templates.TemplateResponse(request=request, name="dashboard.html")

@router.get("/api/dashboard/stats")
async def dashboard_stats(request: Request, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    current_app_id = request.cookies.get('current_app_id')
    app = _get_current_app(db, user, current_app_id)
    
    if not app:
        return {
            'has_app': False,
            'message': 'No app found. Create your first app to get started.'
        }

    # Health score
    health = calculate_health_score(db, app.id)

    # Bug counts
    total_bugs = db.query(Bug).filter(Bug.app_id == app.id).count()
    active_bugs = db.query(Bug).filter(
        Bug.app_id == app.id,
        Bug.status.in_([BugStatusEnum.open, BugStatusEnum.in_progress, BugStatusEnum.testing])
    ).count()
    resolved_bugs = db.query(Bug).filter(
        Bug.app_id == app.id,
        Bug.status == BugStatusEnum.resolved
    ).count()

    # Bug severity breakdown
    severity_counts = {}
    for sev in SeverityEnum:
        count = db.query(Bug).filter(
            Bug.app_id == app.id,
            Bug.severity == sev,
            Bug.status != BugStatusEnum.resolved
        ).count()
        severity_counts[sev.value] = count

    # Uptime percentages
    uptime_24h = get_uptime_percentage(db, app.id, hours=24)
    uptime_7d = get_uptime_percentage(db, app.id, hours=168)
    uptime_30d = get_uptime_percentage(db, app.id, hours=720)

    # Current status
    latest_check = db.query(UptimeCheck).filter(UptimeCheck.app_id == app.id).order_by(
        UptimeCheck.checked_at.desc()
    ).first()

    # Pending maintenance tasks
    now = datetime.now(timezone.utc)
    total_tasks = db.query(MaintenanceTask).filter(
        MaintenanceTask.app_id == app.id, MaintenanceTask.is_active == True
    ).count()
    overdue_tasks = db.query(MaintenanceTask).filter(
        MaintenanceTask.app_id == app.id,
        MaintenanceTask.is_active == True,
        MaintenanceTask.due_date < now
    ).count()

    # Active incidents
    active_incidents = db.query(UptimeIncident).filter(
        UptimeIncident.app_id == app.id,
        UptimeIncident.resolved_at == None
    ).count()

    return {
        'has_app': True,
        'app': {
            'id': app.id,
            'name': app.name,
            'url': app.url,
        },
        'health_score': health,
        'bugs': {
            'total': total_bugs,
            'active': active_bugs,
            'resolved': resolved_bugs,
            'by_severity': severity_counts,
        },
        'uptime': {
            'is_up': latest_check.is_up if latest_check else True,
            'response_time_ms': latest_check.response_time_ms if latest_check else None,
            'last_checked': latest_check.checked_at.isoformat() if latest_check else None,
            'percentage_24h': uptime_24h,
            'percentage_7d': uptime_7d,
            'percentage_30d': uptime_30d,
        },
        'ssl': {
            'days_remaining': max(0, (latest_check.ssl_expiry_date.replace(tzinfo=timezone.utc) - now).days) if latest_check and latest_check.ssl_expiry_date else None
        },
        'maintenance': {
            'total_tasks': total_tasks,
            'overdue_tasks': overdue_tasks,
        },
        'incidents': {
            'active': active_incidents,
        }
    }

@router.get("/api/dashboard/activity")
async def activity_feed(request: Request, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    current_app_id = request.cookies.get('current_app_id')
    app = _get_current_app(db, user, current_app_id)
    if not app:
        return {'activities': []}

    limit = int(request.query_params.get('limit', 20))

    activities = db.query(ActivityLog).filter(
        ActivityLog.app_id == app.id
    ).order_by(ActivityLog.created_at.desc()).limit(limit).all()

    # Attach user info
    result = []
    for log in activities:
        log_dict = log.to_dict()
        if log.user:
            log_dict['user_name'] = log.user.full_name
            log_dict['user_email'] = log.user.email
        result.append(log_dict)

    return {'activities': result}
