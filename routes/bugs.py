from fastapi import APIRouter, Request, Depends, HTTPException, status, UploadFile, File
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from pydantic import BaseModel
from typing import Optional, List
import uuid

from models import (
    App, Bug, BugAttachment, BugHistory, BugComment, BugStatusEnum, SeverityEnum,
    ActivityLog, AppMember, RoleEnum, User
)
from dependencies import get_db, get_current_user

router = APIRouter(tags=["bugs"])
templates = Jinja2Templates(directory="templates")

# --- Schemas ---
class BugCreateRequest(BaseModel):
    title: str
    description: Optional[str] = ""
    severity: Optional[str] = "medium"
    assigned_to: Optional[str] = None
    tags: Optional[List[str]] = []

class BugUpdateRequest(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    severity: Optional[str] = None
    status: Optional[str] = None
    assigned_to: Optional[str] = None
    tags: Optional[List[str]] = None

class CommentCreateRequest(BaseModel):
    content: str


# --- Helper ---
def _check_permission(db: Session, app_id: str, current_user_id: str, min_role: RoleEnum = RoleEnum.developer):
    app = db.query(App).filter(App.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail='App not found')

    if app.owner_id == current_user_id:
        return  # Owner has full access

    member = db.query(AppMember).filter(AppMember.app_id == app_id, AppMember.user_id == current_user_id).first()
    if not member:
        raise HTTPException(status_code=403, detail='You are not a member of this app')

    role_hierarchy = {RoleEnum.admin: 3, RoleEnum.developer: 2, RoleEnum.viewer: 1}
    if role_hierarchy.get(member.role, 0) < role_hierarchy.get(min_role, 0):
        raise HTTPException(status_code=403, detail=f'Insufficient permissions. Required: {min_role.value}')


# --- HTML ---
@router.get("/bugs", response_class=HTMLResponse)
async def bugs_page(request: Request, user: User = Depends(get_current_user)):
    return templates.TemplateResponse(request=request, name="bugs.html")


# --- APIs ---
@router.get("/api/bugs")
async def list_bugs(request: Request, status: Optional[str] = None, severity: Optional[str] = None, assignee: Optional[str] = None, search: Optional[str] = None, sort: str = "newest", user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    app_id = request.cookies.get('current_app_id')
    if not app_id:
        raise HTTPException(status_code=400, detail="No app selected")

    query = db.query(Bug).filter(Bug.app_id == app_id)

    if status:
        try:
            query = query.filter(Bug.status == BugStatusEnum(status))
        except ValueError:
            pass
    if severity:
        try:
            query = query.filter(Bug.severity == SeverityEnum(severity))
        except ValueError:
            pass
    if assignee:
        query = query.filter(Bug.assigned_to == assignee)
    if search:
        search = search.strip()
        query = query.filter(Bug.title.ilike(f'%{search}%'))

    if sort == 'oldest':
        query = query.order_by(Bug.created_at.asc())
    elif sort == 'severity':
        query = query.order_by(Bug.severity.desc())
    else:
        query = query.order_by(Bug.created_at.desc())

    bugs = query.all()
    return {'bugs': [b.to_dict() for b in bugs]}


@router.post("/api/bugs", status_code=status.HTTP_201_CREATED)
async def create_bug(data: BugCreateRequest, request: Request, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    app_id = request.cookies.get('current_app_id')
    if not app_id:
        raise HTTPException(status_code=400, detail="No app selected")

    _check_permission(db, app_id, user.id, min_role=RoleEnum.developer)

    title = data.title.strip()
    if not title:
        raise HTTPException(status_code=400, detail="Title is required")

    try:
        severity_enum = SeverityEnum(data.severity)
    except ValueError:
        severity_enum = SeverityEnum.medium

    bug = Bug(
        app_id=app_id,
        title=title,
        description=data.description.strip(),
        severity=severity_enum,
        status=BugStatusEnum.open,
        reported_by=user.id,
        assigned_to=data.assigned_to,
        tags_json=data.tags,
    )
    db.add(bug)
    db.flush() # Populate bug.id

    history = BugHistory(
        bug_id=bug.id,
        changed_by=user.id,
        field_changed='created',
        old_value='',
        new_value=title,
    )
    db.add(history)

    log = ActivityLog(
        app_id=app_id,
        user_id=user.id,
        action=f'Created bug: {title}',
        entity_type='bug',
        entity_id=bug.id,
        metadata_json={'severity': severity_enum.value},
    )
    db.add(log)
    db.commit()
    
    return {'message': 'Bug created', 'bug': bug.to_dict()}


@router.put("/api/bugs/{bug_id}")
async def update_bug(bug_id: str, data: BugUpdateRequest, request: Request, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    app_id = request.cookies.get('current_app_id')
    if not app_id:
        raise HTTPException(status_code=400, detail="No app selected")

    _check_permission(db, app_id, user.id, min_role=RoleEnum.developer)

    bug = db.query(Bug).filter(Bug.id == bug_id, Bug.app_id == app_id).first()
    if not bug:
        raise HTTPException(status_code=404, detail="Bug not found")

    changes = []
    if data.title is not None and data.title != bug.title:
        changes.append(('title', bug.title, data.title))
        bug.title = data.title
    if data.description is not None and data.description != bug.description:
        old_desc = bug.description[:100] if bug.description else ""
        new_desc = data.description[:100] if data.description else ""
        changes.append(('description', old_desc, new_desc))
        bug.description = data.description
    if data.severity is not None:
        try:
            new_severity = SeverityEnum(data.severity)
            if new_severity != bug.severity:
                changes.append(('severity', bug.severity.value, new_severity.value))
                bug.severity = new_severity
        except ValueError:
            pass
    if data.status is not None:
        try:
            new_status = BugStatusEnum(data.status)
            if new_status != bug.status:
                changes.append(('status', bug.status.value, new_status.value))
                bug.status = new_status
                if new_status == BugStatusEnum.resolved:
                    bug.resolved_at = datetime.now(timezone.utc)
        except ValueError:
            pass
    if data.assigned_to is not None and data.assigned_to != bug.assigned_to:
        changes.append(('assigned_to', bug.assigned_to or 'unassigned', data.assigned_to or 'unassigned'))
        bug.assigned_to = data.assigned_to or None
    if data.tags is not None and data.tags != bug.tags_json:
        changes.append(('tags', str(bug.tags_json), str(data.tags)))
        bug.tags_json = data.tags

    bug.updated_at = datetime.now(timezone.utc)

    for field, old_val, new_val in changes:
        history = BugHistory(
            bug_id=bug.id,
            changed_by=user.id,
            field_changed=field,
            old_value=str(old_val),
            new_value=str(new_val),
        )
        db.add(history)

    if changes:
        fields_changed = ', '.join(c[0] for c in changes)
        log = ActivityLog(
            app_id=app_id,
            user_id=user.id,
            action=f'Updated bug "{bug.title}": {fields_changed}',
            entity_type='bug',
            entity_id=bug.id,
        )
        db.add(log)

    db.commit()
    return {'message': 'Bug updated', 'bug': bug.to_dict()}


@router.delete("/api/bugs/{bug_id}")
async def delete_bug(bug_id: str, request: Request, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    app_id = request.cookies.get('current_app_id')
    if not app_id:
        raise HTTPException(status_code=400, detail="No app selected")

    _check_permission(db, app_id, user.id, min_role=RoleEnum.admin)

    bug = db.query(Bug).filter(Bug.id == bug_id, Bug.app_id == app_id).first()
    if not bug:
        raise HTTPException(status_code=404, detail="Bug not found")

    log = ActivityLog(
        app_id=app_id,
        user_id=user.id,
        action=f'Deleted bug: {bug.title}',
        entity_type='bug',
        entity_id=bug.id,
    )
    db.add(log)
    db.delete(bug)
    db.commit()
    return {'message': 'Bug deleted'}


@router.post("/api/bugs/{bug_id}/attachments", status_code=status.HTTP_201_CREATED)
async def upload_attachment(bug_id: str, request: Request, file: UploadFile = File(...), user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    app_id = request.cookies.get('current_app_id')
    if not app_id:
        raise HTTPException(status_code=400, detail="No app selected")

    bug = db.query(Bug).filter(Bug.id == bug_id, Bug.app_id == app_id).first()
    if not bug:
        raise HTTPException(status_code=404, detail="Bug not found")

    from services.storage_service import upload_file
    filename = f"{uuid.uuid4().hex}_{file.filename}"
    
    try:
        public_url = upload_file(file.file, filename)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Storage upload failed: {str(e)}")

    file.file.seek(0, 2)
    file_size = file.file.tell()
    
    attachment = BugAttachment(
        bug_id=bug.id,
        filename=file.filename,
        file_path=public_url,
        file_size=file_size,
        uploaded_by=user.id,
    )
    db.add(attachment)
    db.commit()

    return {'message': 'File uploaded', 'attachment': attachment.to_dict()}


@router.get("/api/bugs/{bug_id}/attachments")
async def list_attachments(bug_id: str, request: Request, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    app_id = request.cookies.get('current_app_id')
    if not app_id:
        raise HTTPException(status_code=400, detail="No app selected")

    attachments = db.query(BugAttachment).filter(BugAttachment.bug_id == bug_id).order_by(
        BugAttachment.uploaded_at.desc()
    ).all()
    return {'attachments': [a.to_dict() for a in attachments]}


@router.get("/api/bugs/{bug_id}/history")
async def bug_history(bug_id: str, request: Request, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    history = db.query(BugHistory).filter(BugHistory.bug_id == bug_id).order_by(
        BugHistory.changed_at.desc()
    ).all()
    return {'history': [h.to_dict() for h in history]}


@router.get("/api/bugs/{bug_id}/comments")
async def get_bug_comments(bug_id: str, request: Request, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    app_id = request.cookies.get('current_app_id')
    if not app_id:
        raise HTTPException(status_code=400, detail="No app selected")

    bug = db.query(Bug).filter(Bug.id == bug_id, Bug.app_id == app_id).first()
    if not bug:
        raise HTTPException(status_code=404, detail="Bug not found")

    comments = db.query(BugComment).filter(BugComment.bug_id == bug_id).order_by(
        BugComment.created_at.asc()
    ).all()
    return {'comments': [c.to_dict() for c in comments]}


@router.post("/api/bugs/{bug_id}/comments", status_code=status.HTTP_201_CREATED)
async def create_bug_comment(bug_id: str, data: CommentCreateRequest, request: Request, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    app_id = request.cookies.get('current_app_id')
    if not app_id:
        raise HTTPException(status_code=400, detail="No app selected")

    bug = db.query(Bug).filter(Bug.id == bug_id, Bug.app_id == app_id).first()
    if not bug:
        raise HTTPException(status_code=404, detail="Bug not found")

    content = data.content.strip()
    if not content:
        raise HTTPException(status_code=400, detail="Comment content is required")

    comment = BugComment(
        bug_id=bug.id,
        user_id=user.id,
        content=content
    )
    db.add(comment)

    log = ActivityLog(
        app_id=app_id,
        user_id=user.id,
        action=f'Commented on bug: {bug.title[:50]}',
        entity_type='bug_comment',
        entity_id=comment.id,
    )
    db.add(log)
    db.commit()

    return {'message': 'Comment added', 'comment': comment.to_dict()}


@router.post("/api/bugs/{bug_id}/analyze")
async def analyze_bug_ai(bug_id: str, request: Request, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    app_id = request.cookies.get('current_app_id')
    if not app_id:
        raise HTTPException(status_code=400, detail="No app selected")

    bug = db.query(Bug).filter(Bug.id == bug_id, Bug.app_id == app_id).first()
    if not bug:
        raise HTTPException(status_code=404, detail="Bug not found")

    from services.ai_service import analyze_root_cause
    logs = ""
    analysis_result = analyze_root_cause(bug.title, bug.description, logs)
    
    return {'analysis': analysis_result}
