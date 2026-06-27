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


def _check_permission(db: Session, app_id: str, current_user_id: str, min_role: RoleEnum = RoleEnum.developer):
    app = db.query(App).filter(App.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="App not found")

    if app.owner_id == current_user_id:
        return

    member = db.query(AppMember).filter(AppMember.app_id == app_id, AppMember.user_id == current_user_id).first()
    if not member:
        raise HTTPException(status_code=403, detail="You are not a member of this app")

    role_hierarchy = {RoleEnum.admin: 3, RoleEnum.developer: 2, RoleEnum.viewer: 1}
    if role_hierarchy.get(member.role, 0) < role_hierarchy.get(min_role, 0):
        raise HTTPException(status_code=403, detail=f"Insufficient permissions. Required: {min_role.value}")


def parse_dt(dt_str):
    if not dt_str: 
        return None
    try:
        return dateutil.parser.isoparse(dt_str).replace(tzinfo=timezone.utc)
    except:
        return None


@router.get("/roadmap", response_class=HTMLResponse)
async def roadmap_page(request: Request, user: User = Depends(get_current_user)):
    return templates.TemplateResponse(request=request, name="roadmap.html")


@router.get("/api/roadmap")
async def list_features(request: Request, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    app_id = request.cookies.get('current_app_id')
    if not app_id:
        raise HTTPException(status_code=400, detail="No app selected")

    features = db.query(RoadmapFeature).filter(RoadmapFeature.app_id == app_id).order_by(
        RoadmapFeature.created_at.desc()
    ).all()

    return {'features': [f.to_dict() for f in features]}


@router.post("/api/roadmap", status_code=status.HTTP_201_CREATED)
async def create_feature(data: FeatureCreateRequest, request: Request, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    app_id = request.cookies.get('current_app_id')
    if not app_id:
        raise HTTPException(status_code=400, detail="No app selected")

    _check_permission(db, app_id, user.id, min_role=RoleEnum.developer)

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
    app_id = request.cookies.get('current_app_id')
    if not app_id:
        raise HTTPException(status_code=400, detail="No app selected")

    _check_permission(db, app_id, user.id, min_role=RoleEnum.developer)

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
    app_id = request.cookies.get('current_app_id')
    if not app_id:
        raise HTTPException(status_code=400, detail="No app selected")

    _check_permission(db, app_id, user.id, min_role=RoleEnum.admin)

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
