import uuid
from fastapi import APIRouter, Request, Depends, HTTPException, status
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone
from pydantic import BaseModel, EmailStr
from typing import Optional

from models import (
    App, AppMember, User, RoleEnum, ActivityLog
)
from dependencies import get_db, get_current_user, get_current_user_optional

router = APIRouter(tags=["teams"])
templates = Jinja2Templates(directory="templates")

class InviteMemberRequest(BaseModel):
    email: EmailStr
    role: Optional[str] = "developer"

class UpdateRoleRequest(BaseModel):
    role: str

@router.get("/teams", response_class=HTMLResponse)
async def teams_page(request: Request, user: User = Depends(get_current_user)):
    return templates.TemplateResponse(request=request, name="teams.html")


@router.get("/api/teams/members")
async def list_members(request: Request, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    app_id = request.cookies.get('current_app_id')
    if not app_id:
        raise HTTPException(status_code=400, detail="No app selected")

    app = db.query(App).filter(App.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="App not found")

    members = db.query(AppMember).filter(AppMember.app_id == app_id).all()
    owner = db.query(User).filter(User.id == app.owner_id).first()
    
    member_list = []
    if owner:
        member_list.append({
            'id': 'owner',
            'user': owner.to_dict(),
            'role': 'admin',
            'is_owner': True,
            'joined_at': app.created_at.isoformat() if app.created_at else None,
        })

    for m in members:
        member_list.append({
            'id': m.id,
            'user': m.user.to_dict() if m.user else {'email': m.invite_email, 'full_name': m.invite_email},
            'role': m.role.value if m.role else 'developer',
            'is_owner': False,
            'is_pending': m.accepted_at is None,
            'joined_at': m.accepted_at.isoformat() if m.accepted_at else None,
            'invited_at': m.invited_at.isoformat() if m.invited_at else None,
        })

    return {'members': member_list}


@router.post("/api/teams/invite", status_code=status.HTTP_201_CREATED)
async def invite_member(data: InviteMemberRequest, request: Request, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    app_id = request.cookies.get('current_app_id')
    if not app_id:
        raise HTTPException(status_code=400, detail="No app selected")

    app = db.query(App).filter(App.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="App not found")

    if app.owner_id != user.id:
        member = db.query(AppMember).filter(AppMember.app_id == app_id, AppMember.user_id == user.id, AppMember.role.in_([RoleEnum.admin, RoleEnum.project_manager])).first()
        if not member:
            raise HTTPException(status_code=403, detail="Only admins and project managers can invite members")

    email = data.email.lower().strip()
    try:
        role = RoleEnum(data.role)
    except ValueError:
        role = RoleEnum.developer

    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        if existing_user.id == app.owner_id:
            raise HTTPException(status_code=400, detail="This user is already the owner")
        
        existing_member = db.query(AppMember).filter(AppMember.app_id == app_id, AppMember.user_id == existing_user.id).first()
        if existing_member:
            raise HTTPException(status_code=400, detail="User is already a member")

    pending = db.query(AppMember).filter(AppMember.app_id == app_id, AppMember.invite_email == email, AppMember.accepted_at == None).first()
    if pending:
        raise HTTPException(status_code=400, detail="Invitation already pending for this email")

    invite_token = uuid.uuid4().hex

    member = AppMember(
        app_id=app_id,
        user_id=existing_user.id if existing_user else None,
        role=role,
        invite_email=email,
        invite_token=invite_token,
        invited_by=user.id,
        accepted_at=datetime.now(timezone.utc) if existing_user else None,
    )
    db.add(member)

    log = ActivityLog(
        app_id=app_id,
        user_id=user.id,
        action=f'Invited {email} as {role.value}',
        entity_type='member',
        entity_id=member.id,
    )
    db.add(log)
    db.commit()

    return {
        'message': f'Invitation sent to {email}',
        'member': member.to_dict(),
        'invite_token': invite_token,
    }


@router.put("/api/teams/members/{member_id}")
async def update_member_role(member_id: str, data: UpdateRoleRequest, request: Request, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    app_id = request.cookies.get('current_app_id')
    if not app_id:
        raise HTTPException(status_code=400, detail="No app selected")

    app = db.query(App).filter(App.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="App not found")
        
    if app.owner_id != user.id:
        admin_member = db.query(AppMember).filter(AppMember.app_id == app_id, AppMember.user_id == user.id, AppMember.role == RoleEnum.admin).first()
        if not admin_member:
            raise HTTPException(status_code=403, detail="Only the owner or admins can change roles")

    member = db.query(AppMember).filter(AppMember.id == member_id, AppMember.app_id == app_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")

    try:
        old_role = member.role.value
        member.role = RoleEnum(data.role)
        log = ActivityLog(
            app_id=app_id,
            user_id=user.id,
            action=f'Changed {member.invite_email or "member"} role from {old_role} to {data.role}',
            entity_type='member',
            entity_id=member.id,
        )
        db.add(log)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid role")

    db.commit()
    return {'message': 'Role updated', 'member': member.to_dict()}


@router.delete("/api/teams/members/{member_id}")
async def remove_member(member_id: str, request: Request, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    app_id = request.cookies.get('current_app_id')
    if not app_id:
        raise HTTPException(status_code=400, detail="No app selected")

    app = db.query(App).filter(App.id == app_id).first()
    if not app or app.owner_id != user.id:
        raise HTTPException(status_code=403, detail="Only the owner can remove members")

    member = db.query(AppMember).filter(AppMember.id == member_id, AppMember.app_id == app_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")

    log = ActivityLog(
        app_id=app_id,
        user_id=user.id,
        action=f'Removed {member.invite_email or "member"} from team',
        entity_type='member',
        entity_id=member.id,
    )
    db.add(log)
    db.delete(member)
    db.commit()
    return {'message': 'Member removed'}


@router.get("/api/teams/activity")
async def team_activity(request: Request, user_id: Optional[str] = None, entity_type: Optional[str] = None, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    app_id = request.cookies.get('current_app_id')
    if not app_id:
        raise HTTPException(status_code=400, detail="No app selected")

    query = db.query(ActivityLog).filter(ActivityLog.app_id == app_id)

    if user_id:
        query = query.filter(ActivityLog.user_id == user_id)
    if entity_type:
        query = query.filter(ActivityLog.entity_type == entity_type)

    activities = query.order_by(ActivityLog.created_at.desc()).limit(100).all()
    return {'activities': [a.to_dict() for a in activities]}


@router.get("/invite/{token}", response_class=HTMLResponse)
async def accept_invite(token: str, request: Request, user: User = Depends(get_current_user_optional), db: Session = Depends(get_db)):
    member = db.query(AppMember).filter(AppMember.invite_token == token).first()
    if not member:
        return templates.TemplateResponse(request=request, name="auth/login.html", context={"error": "Invalid or expired invitation."})

    if member.accepted_at:
        return templates.TemplateResponse(request=request, name="auth/login.html", context={"error": "Invitation already accepted."})

    if member.invited_at:
        expiry = member.invited_at.replace(tzinfo=timezone.utc) + timedelta(days=7)
        if datetime.now(timezone.utc) > expiry:
            return templates.TemplateResponse(request=request, name="auth/login.html", context={"error": "Invitation has expired."})

    if user:
        member.user_id = user.id
        member.accepted_at = datetime.now(timezone.utc)
        db.commit()
        return templates.TemplateResponse(request=request, name="auth/login.html", context={"success": "Invitation accepted! You can now access the app."})

    return templates.TemplateResponse(request=request, name="auth/register.html", context={"invite_token": token})
