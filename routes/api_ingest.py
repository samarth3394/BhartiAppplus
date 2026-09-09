from fastapi import APIRouter, Request, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from pydantic import BaseModel
from typing import Optional

from models import App, Bug, BugStatusEnum, SeverityEnum, ServerMetric, AppErrorLog
from dependencies import get_db

router = APIRouter(tags=["api_ingest"])

class ErrorIngestRequest(BaseModel):
    message: Optional[str] = 'Unknown Error'
    url: Optional[str] = ''
    line: Optional[str] = ''
    column: Optional[str] = ''
    stack: Optional[str] = ''
    userAgent: Optional[str] = ''
    timestamp: Optional[str] = None

class MetricsIngestRequest(BaseModel):
    cpu_percent: Optional[float] = 0.0
    ram_percent: Optional[float] = 0.0
    disk_percent: Optional[float] = 0.0

@router.post("/api/ingest/error", status_code=status.HTTP_201_CREATED)
async def ingest_error(data: ErrorIngestRequest, request: Request, x_nexvora_key: str = Header(None, alias="X-Nexvora-Key"), db: Session = Depends(get_db)):
    if not x_nexvora_key:
        raise HTTPException(status_code=401, detail="Missing X-Nexvora-Key header")

    app = db.query(App).filter(App.client_key == x_nexvora_key).first()
    if not app:
        raise HTTPException(status_code=401, detail="Invalid client key")

    message = data.message
    url = data.url
    line = data.line
    col = data.column
    stack = data.stack
    user_agent = data.userAgent
    timestamp = data.timestamp or datetime.now(timezone.utc).isoformat()

    metadata = {
        'stack': stack,
        'userAgent': user_agent,
        'url': url
    }
    
    parsed_timestamp = None
    try:
        if data.timestamp:
            parsed_timestamp = datetime.fromisoformat(data.timestamp.replace('Z', '+00:00'))
    except Exception:
        pass

    error_log = AppErrorLog(
        app_id=app.id,
        message=message,
        stack_trace=stack,
        url=url,
        line=line,
        column=col,
        user_agent=user_agent,
        metadata_json=metadata,
        timestamp=parsed_timestamp or datetime.now(timezone.utc)
    )
    db.add(error_log)
    db.commit()

    return {'message': 'Error logged successfully', 'log_id': error_log.id}

@router.options("/api/ingest/error", status_code=status.HTTP_204_NO_CONTENT)
async def ingest_error_options():
    return None


@router.post("/api/ingest/metrics", status_code=status.HTTP_201_CREATED)
async def ingest_metrics(data: MetricsIngestRequest, request: Request, x_nexvora_key: str = Header(None, alias="X-Nexvora-Key"), db: Session = Depends(get_db)):
    if not x_nexvora_key:
        raise HTTPException(status_code=401, detail="Missing X-Nexvora-Key header")

    app = db.query(App).filter(App.client_key == x_nexvora_key).first()
    if not app:
        raise HTTPException(status_code=401, detail="Invalid client key")

    metric = ServerMetric(
        app_id=app.id,
        cpu_percent=data.cpu_percent,
        ram_percent=data.ram_percent,
        disk_percent=data.disk_percent
    )
    db.add(metric)
    db.commit()

    return {'message': 'Metrics recorded', 'id': metric.id}

@router.options("/api/ingest/metrics", status_code=status.HTTP_204_NO_CONTENT)
async def ingest_metrics_options():
    return None
