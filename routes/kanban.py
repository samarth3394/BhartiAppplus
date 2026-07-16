from fastapi import APIRouter, Request, Depends, HTTPException, status, Response
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session
from sqlalchemy import or_
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from datetime import datetime, timezone

from models import App, Workspace, Issue, IssueTypeEnum, IssueStatusEnum, User
from dependencies import get_db, get_current_user

router = APIRouter(tags=["kanban"])
templates = Jinja2Templates(directory="templates")

class IssueCreateRequest(BaseModel):
    title: str
    description: Optional[str] = ""
    type: str  # epic, story, task, bug
    priority: Optional[str] = "medium"
    assignee_id: Optional[str] = None
    app_id: Optional[str] = None

class IssueUpdateRequest(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    type: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    assignee_id: Optional[str] = None

@router.get("/kanban", response_class=HTMLResponse)
async def kanban_page(request: Request, user: User = Depends(get_current_user)):
    return templates.TemplateResponse("kanban.html", {"request": request})

@router.get("/api/kanban/issues")
async def list_issues(request: Request, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    current_app_id = request.cookies.get('current_app_id')
    current_workspace_id = request.cookies.get('current_workspace_id')

    if current_app_id:
        issues = db.query(Issue).filter(Issue.app_id == current_app_id).all()
    elif current_workspace_id:
        apps = db.query(App).filter(App.workspace_id == current_workspace_id).all()
        app_ids = [a.id for a in apps]
        issues = db.query(Issue).filter(Issue.app_id.in_(app_ids)).all()
    else:
        # No app or workspace selected, get issues for apps owned by user
        apps = db.query(App).filter(App.owner_id == user.id, App.workspace_id == None).all()
        app_ids = [a.id for a in apps]
        issues = db.query(Issue).filter(Issue.app_id.in_(app_ids)).all()

    return {"issues": [issue.to_dict() for issue in issues]}

@router.post("/api/kanban/issues", status_code=status.HTTP_201_CREATED)
async def create_issue(data: IssueCreateRequest, request: Request, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    title = data.title.strip()
    if not title:
        raise HTTPException(status_code=400, detail="Title is required")

    app_id = data.app_id or request.cookies.get('current_app_id')
    
    if not app_id or app_id == "None" or app_id == "":
        app = db.query(App).filter(App.owner_id == user.id).first()
        if app:
            app_id = app.id
        else:
            raise HTTPException(status_code=400, detail="App ID is required. Please select an app first.")

    # Validate enums
    try:
        issue_type = IssueTypeEnum[data.type]
    except KeyError:
        raise HTTPException(status_code=400, detail="Invalid issue type")

    new_issue = Issue(
        app_id=app_id,
        title=title,
        description=data.description,
        type=issue_type,
        status=IssueStatusEnum.todo,
        priority=data.priority,
        assignee_id=data.assignee_id if data.assignee_id else None,
        reporter_id=user.id,
    )

    db.add(new_issue)
    db.commit()

    return {"message": "Issue created successfully", "issue": new_issue.to_dict()}

@router.put("/api/kanban/issues/{issue_id}")
async def update_issue(issue_id: str, data: IssueUpdateRequest, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    issue = db.query(Issue).filter(Issue.id == issue_id).first()
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")

    if data.title is not None:
        issue.title = data.title.strip()
    if data.description is not None:
        issue.description = data.description
    if data.type is not None:
        try:
            issue.type = IssueTypeEnum[data.type]
        except KeyError:
            raise HTTPException(status_code=400, detail="Invalid issue type")
    if data.status is not None:
        try:
            issue.status = IssueStatusEnum[data.status]
        except KeyError:
            raise HTTPException(status_code=400, detail="Invalid status")
    if data.priority is not None:
        issue.priority = data.priority
    if data.assignee_id is not None:
        issue.assignee_id = data.assignee_id if data.assignee_id else None

    issue.updated_at = datetime.now(timezone.utc)
    db.commit()

    return {"message": "Issue updated", "issue": issue.to_dict()}

@router.delete("/api/kanban/issues/{issue_id}")
async def delete_issue(issue_id: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    issue = db.query(Issue).filter(Issue.id == issue_id).first()
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")

    db.delete(issue)
    db.commit()

    return {"message": "Issue deleted"}
