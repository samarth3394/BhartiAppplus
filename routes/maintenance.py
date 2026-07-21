from fastapi import APIRouter, Request, Depends, HTTPException, status
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone
from pydantic import BaseModel
from typing import Optional

from models import (
    MaintenanceTask, TaskCompletion, FrequencyEnum, ActivityLog,
    AppMember, RoleEnum, App, User
)
from dependencies import get_db, get_current_user

router = APIRouter(tags=["maintenance"])
templates = Jinja2Templates(directory="templates")

class TaskCreateRequest(BaseModel):
    title: str
    description: Optional[str] = ""
    frequency: Optional[str] = "weekly"
    due_date: Optional[str] = None

class TaskUpdateRequest(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    frequency: Optional[str] = None
    due_date: Optional[str] = None
    is_active: Optional[bool] = None

class TaskCompleteRequest(BaseModel):
    notes: Optional[str] = ""

def _check_permission(db: Session, app_id: str, current_user_id: str, min_role: RoleEnum = RoleEnum.developer):
    app = db.query(App).filter(App.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail='App not found')
        
    if app.owner_id == current_user_id:
        return None # Owner has full access, return dummy member or None

    member = db.query(AppMember).filter(AppMember.app_id == app_id, AppMember.user_id == current_user_id).first()
    if not member:
        raise HTTPException(status_code=403, detail='You are not a member of this app.')

    role_hierarchy = {RoleEnum.admin: 5, RoleEnum.project_manager: 4, RoleEnum.developer: 3, RoleEnum.tester: 2, RoleEnum.viewer: 1}
    if role_hierarchy.get(member.role, 0) < role_hierarchy.get(min_role, 0):
        raise HTTPException(status_code=403, detail=f'Insufficient permissions. Required: {min_role.value}')
    
    return member

@router.get("/maintenance", response_class=HTMLResponse)
async def maintenance_page(request: Request, user: User = Depends(get_current_user)):
    return templates.TemplateResponse(request=request, name="maintenance.html")

@router.get("/api/maintenance")
async def list_tasks(request: Request, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    app_id = request.cookies.get('current_app_id')
    if not app_id:
        raise HTTPException(status_code=400, detail="No app selected")
        
    app = db.query(App).filter(App.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail='App not found')

    role = 'viewer'
    if app.owner_id == user.id:
        role = 'admin'
    else:
        member = db.query(AppMember).filter(AppMember.app_id == app_id, AppMember.user_id == user.id).first()
        if member:
            role = member.role.value

    tasks = db.query(MaintenanceTask).filter(
        MaintenanceTask.app_id == app_id, MaintenanceTask.is_active == True
    ).order_by(MaintenanceTask.due_date.asc()).all()

    now = datetime.now(timezone.utc)
    categorized = {
        'overdue': [],
        'today': [],
        'upcoming': [],
    }

    for task in tasks:
        task_dict = task.to_dict()
        if task.due_date:
            due = task.due_date.replace(tzinfo=timezone.utc) if task.due_date.tzinfo is None else task.due_date
            if due.date() < now.date():
                categorized['overdue'].append(task_dict)
            elif due.date() == now.date():
                categorized['today'].append(task_dict)
            else:
                categorized['upcoming'].append(task_dict)
        else:
            categorized['upcoming'].append(task_dict)

    return {
        'tasks': categorized,
        'total': len(tasks),
        'role': role
    }

@router.post("/api/maintenance", status_code=status.HTTP_201_CREATED)
async def create_task(data: TaskCreateRequest, request: Request, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    app_id = request.cookies.get('current_app_id')
    if not app_id:
        raise HTTPException(status_code=400, detail="No app selected")

    _check_permission(db, app_id, user.id, min_role=RoleEnum.developer)

    title = data.title.strip()
    if not title:
        raise HTTPException(status_code=400, detail="Title is required")

    try:
        frequency = FrequencyEnum(data.frequency)
    except ValueError:
        frequency = FrequencyEnum.weekly

    if data.due_date:
        try:
            due_date = datetime.fromisoformat(data.due_date).replace(tzinfo=timezone.utc)
        except ValueError:
            due_date = datetime.now(timezone.utc) + timedelta(days=1)
    else:
        if frequency == FrequencyEnum.daily:
            due_date = datetime.now(timezone.utc) + timedelta(days=1)
        elif frequency == FrequencyEnum.weekly:
            due_date = datetime.now(timezone.utc) + timedelta(weeks=1)
        else:
            due_date = datetime.now(timezone.utc) + timedelta(days=30)

    task = MaintenanceTask(
        app_id=app_id,
        title=title,
        description=data.description,
        frequency=frequency,
        due_date=due_date,
        created_by=user.id,
    )
    db.add(task)
    db.flush()

    log = ActivityLog(
        app_id=app_id,
        user_id=user.id,
        action=f'Created maintenance task: {title}',
        entity_type='task',
        entity_id=task.id,
        metadata_json={'frequency': frequency.value},
    )
    db.add(log)
    db.commit()
    
    return {'message': 'Task created', 'task': task.to_dict()}


@router.put("/api/maintenance/{task_id}")
async def update_task(task_id: str, data: TaskUpdateRequest, request: Request, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    app_id = request.cookies.get('current_app_id')
    if not app_id:
        raise HTTPException(status_code=400, detail="No app selected")

    _check_permission(db, app_id, user.id, min_role=RoleEnum.developer)

    task = db.query(MaintenanceTask).filter(MaintenanceTask.id == task_id, MaintenanceTask.app_id == app_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    if data.title is not None:
        task.title = data.title
    if data.description is not None:
        task.description = data.description
    if data.frequency is not None:
        try:
            task.frequency = FrequencyEnum(data.frequency)
        except ValueError:
            pass
    if data.due_date is not None:
        try:
            task.due_date = datetime.fromisoformat(data.due_date).replace(tzinfo=timezone.utc)
        except ValueError:
            pass
    if data.is_active is not None:
        task.is_active = data.is_active

    db.commit()
    return {'message': 'Task updated', 'task': task.to_dict()}


@router.post("/api/maintenance/{task_id}/complete")
async def complete_task(task_id: str, data: TaskCompleteRequest, request: Request, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    app_id = request.cookies.get('current_app_id')
    if not app_id:
        raise HTTPException(status_code=400, detail="No app selected")

    _check_permission(db, app_id, user.id, min_role=RoleEnum.developer)

    task = db.query(MaintenanceTask).filter(MaintenanceTask.id == task_id, MaintenanceTask.app_id == app_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    completion = TaskCompletion(
        task_id=task.id,
        completed_by=user.id,
        notes=data.notes,
    )
    db.add(completion)

    now = datetime.now(timezone.utc)
    if task.frequency == FrequencyEnum.daily:
        task.due_date = now + timedelta(days=1)
    elif task.frequency == FrequencyEnum.weekly:
        task.due_date = now + timedelta(weeks=1)
    elif task.frequency == FrequencyEnum.monthly:
        task.due_date = now + timedelta(days=30)

    log = ActivityLog(
        app_id=app_id,
        user_id=user.id,
        action=f'Completed maintenance task: {task.title}',
        entity_type='task',
        entity_id=task.id,
    )
    db.add(log)
    db.commit()
    
    return {
        'message': 'Task completed',
        'task': task.to_dict(),
        'completion': completion.to_dict(),
    }


@router.get("/api/maintenance/{task_id}/history")
async def task_history(task_id: str, request: Request, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    completions = db.query(TaskCompletion).filter(TaskCompletion.task_id == task_id).order_by(
        TaskCompletion.completed_at.desc()
    ).all()
    return {'completions': [c.to_dict() for c in completions]}


@router.delete("/api/maintenance/{task_id}")
async def delete_task(task_id: str, request: Request, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    app_id = request.cookies.get('current_app_id')
    if not app_id:
        raise HTTPException(status_code=400, detail="No app selected")

    _check_permission(db, app_id, user.id, min_role=RoleEnum.admin)

    task = db.query(MaintenanceTask).filter(MaintenanceTask.id == task_id, MaintenanceTask.app_id == app_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    log = ActivityLog(
        app_id=app_id,
        user_id=user.id,
        action=f'Deleted maintenance task: {task.title}',
        entity_type='task',
        entity_id=task.id,
    )
    db.add(log)
    db.delete(task)
    db.commit()
    return {'message': 'Task deleted'}
