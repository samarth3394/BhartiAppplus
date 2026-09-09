from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone
from typing import List

from models import App, UptimeCheck, UptimeIncident
from dependencies import get_db

router = APIRouter(tags=["public"])

@router.get("/api/public/status/{client_key}")
async def get_public_status(client_key: str, db: Session = Depends(get_db)):
    app = db.query(App).filter(App.client_key == client_key).first()
    if not app:
        raise HTTPException(status_code=404, detail="Status page not found")

    if not app.is_active:
        raise HTTPException(status_code=400, detail="App is disabled")

    # Current Status
    latest_check = db.query(UptimeCheck).filter(UptimeCheck.app_id == app.id).order_by(UptimeCheck.checked_at.desc()).first()
    is_operational = latest_check.is_up if latest_check else True

    # Active Incidents
    active_incidents = db.query(UptimeIncident).filter(
        UptimeIncident.app_id == app.id,
        UptimeIncident.resolved_at == None
    ).order_by(UptimeIncident.started_at.desc()).all()

    if active_incidents:
        is_operational = False

    # 30-Day History
    # We will aggregate by day in Python to be DB-agnostic (works on both SQLite and Postgres)
    cutoff_date = datetime.now(timezone.utc) - timedelta(days=30)
    
    # Pre-fill last 30 days
    history = {}
    for i in range(30):
        d = (datetime.now(timezone.utc) - timedelta(days=i)).date()
        history[d.isoformat()] = {"date": d.isoformat(), "uptime_pct": 100.0, "total_checks": 0, "down_checks": 0}

    checks = db.query(UptimeCheck.is_up, UptimeCheck.checked_at).filter(
        UptimeCheck.app_id == app.id,
        UptimeCheck.checked_at >= cutoff_date
    ).all()

    for check in checks:
        if not check.checked_at:
            continue
            
        day_str = check.checked_at.date().isoformat()
        if day_str in history:
            history[day_str]["total_checks"] += 1
            if not check.is_up:
                history[day_str]["down_checks"] += 1

    # Calculate percentage
    for day_str, data in history.items():
        if data["total_checks"] > 0:
            up_checks = data["total_checks"] - data["down_checks"]
            data["uptime_pct"] = round((up_checks / data["total_checks"]) * 100, 2)
        else:
            # If no checks, assume 100% or "No Data"
            data["uptime_pct"] = 100.0

    # Sort chronological
    sorted_history = sorted(list(history.values()), key=lambda x: x["date"])

    return {
        "app_name": app.name,
        "is_operational": is_operational,
        "last_checked_at": latest_check.checked_at.isoformat() if latest_check else None,
        "active_incidents": [inc.to_dict() for inc in active_incidents],
        "history": sorted_history
    }
