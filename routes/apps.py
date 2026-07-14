from fastapi import APIRouter, Request, Depends, HTTPException, status, Response
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, Dict, Any
from models import App, AppMember, ActivityLog, User, RoleEnum
from dependencies import get_db, get_current_user

router = APIRouter(tags=["apps"])
templates = Jinja2Templates(directory="templates")

class AppCreateRequest(BaseModel):
    name: str
    url: Optional[str] = ""
    description: Optional[str] = ""
    workspace_id: Optional[str] = None

class AppUpdateRequest(BaseModel):
    name: Optional[str] = None
    url: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None
    settings: Optional[Dict[str, Any]] = None

@router.get("/apps", response_class=HTMLResponse)
async def apps_page(request: Request, user: User = Depends(get_current_user)):
    return templates.TemplateResponse(request=request, name="apps.html")

@router.get("/api/apps")
async def list_apps(request: Request, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    current_workspace_id = request.cookies.get('current_workspace_id')
    all_apps = {}

    if current_workspace_id:
        from models import Workspace, WorkspaceMember
        workspace = db.query(Workspace).filter(Workspace.id == current_workspace_id).first()
        is_owner = (workspace and workspace.owner_id == user.id)
        wm = db.query(WorkspaceMember).filter(WorkspaceMember.workspace_id == current_workspace_id, WorkspaceMember.user_id == user.id).first()
        
        if is_owner or wm:
            role = 'admin' if is_owner else (wm.role.value if wm else 'viewer')
            w_apps = db.query(App).filter(App.workspace_id == current_workspace_id).all()
            for a in w_apps:
                all_apps[a.id] = {**a.to_dict(), 'is_owner': is_owner, 'role': role}
    else:
        owned = db.query(App).filter(App.owner_id == user.id, App.workspace_id == None).all()
        member_apps = db.query(App).join(AppMember).filter(AppMember.user_id == user.id, App.workspace_id == None).all()
        
        for a in owned:
            all_apps[a.id] = {**a.to_dict(), 'is_owner': True, 'role': 'admin'}
        for a in member_apps:
            if a.id not in all_apps:
                member = db.query(AppMember).filter(AppMember.app_id == a.id, AppMember.user_id == user.id).first()
                all_apps[a.id] = {
                    **a.to_dict(),
                    'is_owner': False,
                    'role': member.role.value if member else 'viewer',
                }

    current_app_id = request.cookies.get('current_app_id')
    return {
        'apps': list(all_apps.values()),
        'current_app_id': current_app_id,
        'current_workspace_id': current_workspace_id
    }

@router.post("/api/apps", status_code=status.HTTP_201_CREATED)
async def create_app(data: AppCreateRequest, response: Response, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    name = data.name.strip()
    if not name:
        raise HTTPException(status_code=400, detail="App name is required")

    new_app = App(
        name=name,
        url=data.url.strip() if data.url else "",
        description=data.description.strip() if data.description else "",
        owner_id=user.id,
        workspace_id=data.workspace_id,
    )
    db.add(new_app)
    db.flush()  # Populate new_app.id

    log = ActivityLog(
        app_id=new_app.id,
        user_id=user.id,
        action=f'Created app: {name}',
        entity_type='app',
        entity_id=new_app.id,
    )
    db.add(log)
    db.commit()

    # Auto-switch to new app
    response.set_cookie(key="current_app_id", value=str(new_app.id), httponly=True, path="/")

    return {'message': 'App created', 'app': new_app.to_dict()}

@router.put("/api/apps/{app_id}")
async def update_app(app_id: str, data: AppUpdateRequest, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    app_obj = db.query(App).filter(App.id == app_id).first()
    if not app_obj:
        raise HTTPException(status_code=404, detail="App not found")

    is_owner = (app_obj.owner_id == user.id)
    if not is_owner:
        member = db.query(AppMember).filter(AppMember.app_id == app_id, AppMember.user_id == user.id).first()
        if not member or member.role != RoleEnum.admin:
            raise HTTPException(status_code=403, detail="Only the owner or an admin can update app settings")

    if data.name is not None:
        app_obj.name = data.name.strip()
    if data.url is not None:
        app_obj.url = data.url.strip()
    if data.description is not None:
        app_obj.description = data.description.strip()
    if data.is_active is not None:
        app_obj.is_active = data.is_active
    if data.settings is not None:
        app_obj.settings = data.settings
        from sqlalchemy.orm.attributes import flag_modified
        flag_modified(app_obj, 'settings')

    log = ActivityLog(
        app_id=app_id,
        user_id=user.id,
        action=f'Updated app settings: {app_obj.name}',
        entity_type='app',
        entity_id=app_id,
    )
    db.add(log)
    db.commit()

    return {'message': 'App updated', 'app': app_obj.to_dict()}

@router.delete("/api/apps/{app_id}")
async def delete_app(app_id: str, request: Request, response: Response, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    app_obj = db.query(App).filter(App.id == app_id).first()
    if not app_obj:
        raise HTTPException(status_code=404, detail="App not found")

    if app_obj.owner_id != user.id:
        raise HTTPException(status_code=403, detail="Only the owner can delete an app")

    app_name = app_obj.name
    db.delete(app_obj)
    db.commit()

    if request.cookies.get('current_app_id') == app_id:
        response.delete_cookie("current_app_id")

    return {'message': f'App "{app_name}" deleted'}

@router.post("/api/apps/switch/{app_id}")
async def switch_app(app_id: str, response: Response, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    app_obj = db.query(App).filter(App.id == app_id).first()
    if not app_obj:
        raise HTTPException(status_code=404, detail="App not found")

    # verify membership
    if app_obj.owner_id != user.id:
        member = db.query(AppMember).filter(AppMember.app_id == app_id, AppMember.user_id == user.id).first()
        if not member:
            raise HTTPException(status_code=403, detail="You do not have access to this app")

    response.set_cookie(key="current_app_id", value=app_id, httponly=True, path="/")
    return {"message": f"Switched to app {app_obj.name}"}
