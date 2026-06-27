from fastapi import APIRouter, Request, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from pydantic import BaseModel
from typing import Optional

from models import App, Bug, BugStatusEnum, SeverityEnum, ServerMetric
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

    title = f"[Auto] {message[:100]}"
    description = f"Automated error report from {url}\n\n**Error:** {message}\n**Line:** {line}:{col}"

    metadata = {
        'stack': stack,
        'userAgent': user_agent,
        'url': url,
        'timestamp': timestamp
    }

    bug = Bug(
        app_id=app.id,
        title=title,
        description=description,
        severity=SeverityEnum.high,
        status=BugStatusEnum.open,
        is_automated=True,
        metadata_json=metadata,
        reported_by=None
    )
    db.add(bug)
    db.commit()

    return {'message': 'Error ingested successfully', 'bug_id': bug.id}

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
