from fastapi import APIRouter, Request, Depends, HTTPException, status
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from pydantic import BaseModel
from typing import Optional
import dateutil.parser

from models import RoadmapFeature, AppMember, RoleEnum, ActivityLog, App, User
from dependencies import get_db, get_current_user

router = APIRouter(tags=["roadmap"])
templates = Jinja2Templates(directory="templates")


class FeatureCreateRequest(BaseModel):
    title: str
    description: Optional[str] = ""
    status: Optional[str] = "planned"
    priority: Optional[str] = "medium"
    start_date: Optional[str] = None
    due_date: Optional[str] = None

class FeatureUpdateRequest(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    start_date: Optional[str] = None
    due_date: Optional[str] = None


def parse_dt(dt_str):
    if not dt_str: 
        return None
    try:
        return dateutil.parser.isoparse(dt_str).replace(tzinfo=timezone.utc)
    except:
        return None


# Removed HTML Route

@router.get("/api/roadmap")
async def list_features(request: Request, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    from dependencies import get_user_app_role
    app_id = request.cookies.get('current_app_id')
    if not app_id:
        raise HTTPException(status_code=400, detail="No app selected")

    features = db.query(RoadmapFeature).filter(RoadmapFeature.app_id == app_id).order_by(
        RoadmapFeature.created_at.desc()
    ).all()

    role = get_user_app_role(db, user, app_id)

    return {'features': [f.to_dict() for f in features], 'user_role': role}


@router.post("/api/roadmap", status_code=status.HTTP_201_CREATED)
async def create_feature(data: FeatureCreateRequest, request: Request, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    from dependencies import check_app_role
    app_id = request.cookies.get('current_app_id')
    if not app_id:
        raise HTTPException(status_code=400, detail="No app selected")

    check_app_role(db, user, app_id, [RoleEnum.admin, RoleEnum.project_manager])

    title = data.title.strip()
    if not title:
        raise HTTPException(status_code=400, detail="Title is required")

    feature = RoadmapFeature(
        app_id=app_id,
        title=title,
        description=data.description,
        status=data.status,
        priority=data.priority,
        start_date=parse_dt(data.start_date),
        due_date=parse_dt(data.due_date),
    )
    db.add(feature)
    db.flush()

    log = ActivityLog(
        app_id=app_id,
        user_id=user.id,
        action=f'Created roadmap feature: {title}',
        entity_type='roadmap',
        entity_id=feature.id,
    )
    db.add(log)
    db.commit()

    return {'message': 'Feature created', 'feature': feature.to_dict()}


@router.put("/api/roadmap/{feature_id}")
async def update_feature(feature_id: str, data: FeatureUpdateRequest, request: Request, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    from dependencies import check_app_role
    app_id = request.cookies.get('current_app_id')
    if not app_id:
        raise HTTPException(status_code=400, detail="No app selected")

    check_app_role(db, user, app_id, [RoleEnum.admin, RoleEnum.project_manager])

    feature = db.query(RoadmapFeature).filter(RoadmapFeature.id == feature_id, RoadmapFeature.app_id == app_id).first()
    if not feature:
        raise HTTPException(status_code=404, detail="Feature not found")

    if data.title is not None:
        feature.title = data.title
    if data.description is not None:
        feature.description = data.description
    if data.status is not None:
        feature.status = data.status
    if data.priority is not None:
        feature.priority = data.priority
    if data.start_date is not None:
        feature.start_date = parse_dt(data.start_date)
    if data.due_date is not None:
        feature.due_date = parse_dt(data.due_date)

    feature.updated_at = datetime.now(timezone.utc)

    log = ActivityLog(
        app_id=app_id,
        user_id=user.id,
        action=f'Updated roadmap feature: {feature.title}',
        entity_type='roadmap',
        entity_id=feature.id,
    )
    db.add(log)
    db.commit()

    return {'message': 'Feature updated', 'feature': feature.to_dict()}


@router.delete("/api/roadmap/{feature_id}")
async def delete_feature(feature_id: str, request: Request, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    from dependencies import check_app_role
    app_id = request.cookies.get('current_app_id')
    if not app_id:
        raise HTTPException(status_code=400, detail="No app selected")

    check_app_role(db, user, app_id, [RoleEnum.admin, RoleEnum.project_manager])

    feature = db.query(RoadmapFeature).filter(RoadmapFeature.id == feature_id, RoadmapFeature.app_id == app_id).first()
    if not feature:
        raise HTTPException(status_code=404, detail="Feature not found")

    log = ActivityLog(
        app_id=app_id,
        user_id=user.id,
        action=f'Deleted roadmap feature: {feature.title}',
        entity_type='roadmap',
        entity_id=feature.id,
    )

    db.add(log)
    db.delete(feature)
    db.commit()

    return {'message': 'Feature deleted'}
