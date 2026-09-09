from fastapi import APIRouter, Request, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List, Optional

from models import AppErrorLog
from dependencies import get_db, get_current_user

router = APIRouter(tags=["logs"])

@router.get("/api/logs")
async def get_logs(
    request: Request,
    search: Optional[str] = None,
    limit: int = Query(50, le=200),
    offset: int = 0,
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    app_id = request.cookies.get('current_app_id')
    if not app_id:
        raise HTTPException(status_code=400, detail="No app selected")

    query = db.query(AppErrorLog).filter(AppErrorLog.app_id == app_id)

    if search:
        query = query.filter(AppErrorLog.message.ilike(f"%{search}%"))

    total_count = query.count()
    logs = query.order_by(desc(AppErrorLog.timestamp)).offset(offset).limit(limit).all()

    return {
        "total": total_count,
        "logs": [log.to_dict() for log in logs]
    }
