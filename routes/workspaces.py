import uuid
from fastapi import APIRouter, Request, Depends, HTTPException, status, Response
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from pydantic import BaseModel, EmailStr
from typing import Optional

from models import (
    Workspace, WorkspaceMember, User, RoleEnum, ActivityLog
)
from dependencies import get_db, get_current_user

router = APIRouter(tags=["workspaces"])
templates = Jinja2Templates(directory="templates")

class WorkspaceCreateRequest(BaseModel):
    name: str

class WorkspaceUpdateRequest(BaseModel):
    name: Optional[str] = None
    is_active: Optional[bool] = None

class InviteMemberRequest(BaseModel):
    email: EmailStr
    role: Optional[str] = "developer"

@router.get("/workspaces", response_class=HTMLResponse)
async def workspaces_page(request: Request, user: User = Depends(get_current_user)):
    return templates.TemplateResponse("workspaces.html", {"request": request})

@router.get("/api/workspaces")
async def list_workspaces(request: Request, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    owned = db.query(Workspace).filter(Workspace.owner_id == user.id).all()
    member_workspaces = db.query(Workspace).join(WorkspaceMember).filter(WorkspaceMember.user_id == user.id).all()

    all_workspaces = {}
    for w in owned:
        all_workspaces[w.id] = {**w.to_dict(), 'is_owner': True, 'role': 'admin'}
    for w in member_workspaces:
        if w.id not in all_workspaces:
            member = db.query(WorkspaceMember).filter(WorkspaceMember.workspace_id == w.id, WorkspaceMember.user_id == user.id).first()
            all_workspaces[w.id] = {
                **w.to_dict(),
                'is_owner': False,
                'role': member.role.value if member else 'viewer',
            }

    current_workspace_id = request.cookies.get('current_workspace_id')
    return {
        'workspaces': list(all_workspaces.values()),
        'current_workspace_id': current_workspace_id,
    }

@router.post("/api/workspaces", status_code=status.HTTP_201_CREATED)
async def create_workspace(data: WorkspaceCreateRequest, response: Response, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    name = data.name.strip()
    if not name:
        raise HTTPException(status_code=400, detail="Workspace name is required")

    new_workspace = Workspace(
        name=name,
        owner_id=user.id,
    )
    db.add(new_workspace)
    db.flush()

    # Automatically add owner as an admin member (optional but good for consistency)
    member = WorkspaceMember(
        workspace_id=new_workspace.id,
        user_id=user.id,
        role=RoleEnum.admin,
        accepted_at=datetime.now(timezone.utc)
    )
    db.add(member)
    db.commit()

    response.set_cookie(key="current_workspace_id", value=str(new_workspace.id), httponly=True, path="/")
    return {'message': 'Workspace created', 'workspace': new_workspace.to_dict()}

@router.put("/api/workspaces/{workspace_id}")
async def update_workspace(workspace_id: str, data: WorkspaceUpdateRequest, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    workspace_obj = db.query(Workspace).filter(Workspace.id == workspace_id).first()
    if not workspace_obj:
        raise HTTPException(status_code=404, detail="Workspace not found")

    is_owner = (workspace_obj.owner_id == user.id)
    if not is_owner:
        raise HTTPException(status_code=403, detail="Only the owner can update workspace settings")

    if data.name is not None:
        workspace_obj.name = data.name.strip()
    if data.is_active is not None:
        workspace_obj.is_active = data.is_active

    db.commit()
    return {'message': 'Workspace updated', 'workspace': workspace_obj.to_dict()}

@router.delete("/api/workspaces/{workspace_id}")
async def delete_workspace(workspace_id: str, request: Request, response: Response, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    workspace_obj = db.query(Workspace).filter(Workspace.id == workspace_id).first()
    if not workspace_obj:
        raise HTTPException(status_code=404, detail="Workspace not found")

    if workspace_obj.owner_id != user.id:
        raise HTTPException(status_code=403, detail="Only the owner can delete a workspace")

    name = workspace_obj.name
    db.delete(workspace_obj)
    db.commit()

    if request.cookies.get('current_workspace_id') == workspace_id:
        response.delete_cookie("current_workspace_id")

    return {'message': f'Workspace "{name}" deleted'}

@router.post("/api/workspaces/switch/{workspace_id}")
async def switch_workspace(workspace_id: str, response: Response, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if workspace_id == "personal":
        response.delete_cookie("current_workspace_id")
        return {"message": "Switched to personal space"}

    workspace_obj = db.query(Workspace).filter(Workspace.id == workspace_id).first()
    if not workspace_obj:
        raise HTTPException(status_code=404, detail="Workspace not found")

    if workspace_obj.owner_id != user.id:
        member = db.query(WorkspaceMember).filter(WorkspaceMember.workspace_id == workspace_id, WorkspaceMember.user_id == user.id).first()
        if not member:
            raise HTTPException(status_code=403, detail="You do not have access to this workspace")

    response.set_cookie(key="current_workspace_id", value=workspace_id, httponly=True, path="/")
    return {"message": f"Switched to workspace {workspace_obj.name}"}

@router.post("/api/workspaces/{workspace_id}/members")
async def invite_member(workspace_id: str, data: InviteMemberRequest, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    workspace_obj = db.query(Workspace).filter(Workspace.id == workspace_id).first()
    if not workspace_obj:
        raise HTTPException(status_code=404, detail="Workspace not found")
        
    is_admin = (workspace_obj.owner_id == user.id)
    if not is_admin:
        member = db.query(WorkspaceMember).filter(WorkspaceMember.workspace_id == workspace_id, WorkspaceMember.user_id == user.id).first()
        if member and member.role == RoleEnum.admin:
            is_admin = True
            
    if not is_admin:
        raise HTTPException(status_code=403, detail="Only admins can invite members")
        
    email_to_invite = data.email.lower().strip()
    if email_to_invite == user.email.lower():
        raise HTTPException(status_code=400, detail="You cannot invite yourself")
        
    invited_user = db.query(User).filter(User.email == email_to_invite).first()
    
    # Check if already a member
    if invited_user:
        existing = db.query(WorkspaceMember).filter(WorkspaceMember.workspace_id == workspace_id, WorkspaceMember.user_id == invited_user.id).first()
        if existing:
            raise HTTPException(status_code=400, detail="User is already a member")
    else:
        existing = db.query(WorkspaceMember).filter(WorkspaceMember.workspace_id == workspace_id, WorkspaceMember.invite_email == email_to_invite).first()
        if existing:
            raise HTTPException(status_code=400, detail="User is already invited")

    try:
        role_enum = RoleEnum[data.role]
    except KeyError:
        raise HTTPException(status_code=400, detail="Invalid role")

    new_member = WorkspaceMember(
        workspace_id=workspace_id,
        role=role_enum,
        invited_by=user.id,
    )

    if invited_user:
        new_member.user_id = invited_user.id
        new_member.accepted_at = datetime.now(timezone.utc)
    else:
        new_member.invite_email = email_to_invite
        new_member.invite_token = str(uuid.uuid4())

    db.add(new_member)
    db.commit()

    return {"message": "Member invited successfully", "member": new_member.to_dict()}

@router.delete("/api/workspaces/{workspace_id}/members/{member_id}")
async def remove_member(workspace_id: str, member_id: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    workspace_obj = db.query(Workspace).filter(Workspace.id == workspace_id).first()
    if not workspace_obj:
        raise HTTPException(status_code=404, detail="Workspace not found")
        
    member = db.query(WorkspaceMember).filter(WorkspaceMember.id == member_id, WorkspaceMember.workspace_id == workspace_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
        
    is_admin = (workspace_obj.owner_id == user.id)
    if not is_admin:
        current_member = db.query(WorkspaceMember).filter(WorkspaceMember.workspace_id == workspace_id, WorkspaceMember.user_id == user.id).first()
        if current_member and current_member.role == RoleEnum.admin:
            is_admin = True
            
    # Allow users to remove themselves
    is_self = (member.user_id == user.id)
    
    if not is_admin and not is_self:
        raise HTTPException(status_code=403, detail="You don't have permission to remove this member")
        
    if member.user_id == workspace_obj.owner_id:
        raise HTTPException(status_code=400, detail="Cannot remove the workspace owner")

    db.delete(member)
    db.commit()
    
    return {"message": "Member removed successfully"}

@router.get("/api/workspaces/{workspace_id}/members")
async def list_workspace_members(workspace_id: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    workspace_obj = db.query(Workspace).filter(Workspace.id == workspace_id).first()
    if not workspace_obj:
        raise HTTPException(status_code=404, detail="Workspace not found")
        
    # Check access
    if workspace_obj.owner_id != user.id:
        member = db.query(WorkspaceMember).filter(WorkspaceMember.workspace_id == workspace_id, WorkspaceMember.user_id == user.id).first()
        if not member:
            raise HTTPException(status_code=403, detail="You do not have access to this workspace")
            
    members = db.query(WorkspaceMember).filter(WorkspaceMember.workspace_id == workspace_id).all()
    
    return {"members": [m.to_dict() for m in members]}
