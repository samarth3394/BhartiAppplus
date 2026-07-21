"""
Settings Routes — Profile, App, Notifications, Appearance, Security, Danger Zone
"""

from fastapi import APIRouter, Request, Depends, HTTPException, status, Response, UploadFile, File
from fastapi.responses import HTMLResponse, JSONResponse, StreamingResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, Any
from models import User, App, AppMember, UptimeCheck, UptimeIncident, Bug, MaintenanceTask, ActivityLog, ServerMetric, RoadmapFeature, FailurePrediction, generate_uuid
from dependencies import get_db, get_current_user, verify_password, get_password_hash
import json
import io
import os

router = APIRouter(tags=["settings"])
templates = Jinja2Templates(directory="templates")


# ─── Schemas ──────────────────────────────────────────────────────────────

class ProfileUpdateRequest(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None

class PasswordChangeRequest(BaseModel):
    current_password: str
    new_password: str
    confirm_password: str

class AppSettingsRequest(BaseModel):
    monitoring_enabled: Optional[bool] = None
    check_interval: Optional[int] = None
    url: Optional[str] = None
    description: Optional[str] = None

class GitHubSettingsRequest(BaseModel):
    github_repo: Optional[str] = None
    github_token: Optional[str] = None

class NotificationSettingsRequest(BaseModel):
    alert_email: Optional[bool] = None
    alert_email_address: Optional[str] = None
    alert_whatsapp: Optional[bool] = None
    alert_whatsapp_number: Optional[str] = None
    alert_threshold: Optional[int] = None
    weekly_cto_report: Optional[bool] = None

class AppearanceSettingsRequest(BaseModel):
    theme: Optional[str] = None
    sidebar_collapsed: Optional[bool] = None
    language: Optional[str] = None

class TeamDefaultsRequest(BaseModel):
    default_member_role: Optional[str] = None
    invite_expiry_days: Optional[int] = None


# ─── Page Route ───────────────────────────────────────────────────────────

@router.get("/settings", response_class=HTMLResponse)
async def settings_page(request: Request, user: User = Depends(get_current_user)):
    return templates.TemplateResponse(request=request, name="settings.html")


# ─── Profile APIs ─────────────────────────────────────────────────────────

@router.get("/api/settings/profile")
async def get_profile(user: User = Depends(get_current_user)):
    return user.to_dict()


@router.put("/api/settings/profile")
async def update_profile(data: ProfileUpdateRequest, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if data.full_name is not None:
        user.full_name = data.full_name.strip()
    if data.email is not None:
        existing = db.query(User).filter(User.email == data.email.lower(), User.id != user.id).first()
        if existing:
            raise HTTPException(status_code=409, detail="Email already in use")
        user.email = data.email.lower()
    db.commit()
    db.refresh(user)
    return {"status": "success", "message": "Profile updated", "data": user.to_dict()}

import shutil
from config import Config
try:
    from supabase import create_client, Client
except ImportError:
    pass

@router.post("/api/settings/profile/avatar")
async def upload_avatar(avatar: UploadFile = File(...), user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not avatar.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid file type")
    
    ext = avatar.filename.split('.')[-1] if '.' in avatar.filename else 'jpg'
    filename = f"{user.id}_{generate_uuid()[:8]}.{ext}"
    
    if Config.SUPABASE_URL and Config.SUPABASE_KEY:
        try:
            supabase: Client = create_client(Config.SUPABASE_URL, Config.SUPABASE_KEY)
            file_bytes = await avatar.read()
            # Upload to Supabase Storage bucket 'avatars'
            supabase.storage.from_("avatars").upload(filename, file_bytes, {"content-type": avatar.content_type})
            
            # Get public URL
            public_url = supabase.storage.from_("avatars").get_public_url(filename)
            user.avatar_url = public_url
        except Exception as e:
            print(f"Supabase upload error: {e}")
            raise HTTPException(status_code=500, detail=f"Failed to upload to Supabase: {str(e)}")
    else:
        # Fallback to local storage if Supabase is not configured
        upload_dir = os.path.join("static", "uploads", "avatars")
        os.makedirs(upload_dir, exist_ok=True)
        filepath = os.path.join(upload_dir, filename)
        
        with open(filepath, "wb") as buffer:
            shutil.copyfileobj(avatar.file, buffer)
            
        user.avatar_url = f"/static/uploads/avatars/{filename}"
        
    db.commit()
    return {"status": "success", "message": "Avatar uploaded", "avatar_url": user.avatar_url}


@router.put("/api/settings/password")
async def change_password(data: PasswordChangeRequest, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not verify_password(data.current_password, user.password_hash):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    if len(data.new_password) < 6:
        raise HTTPException(status_code=400, detail="New password must be at least 6 characters")
    if data.new_password != data.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")
    user.password_hash = get_password_hash(data.new_password)
    db.commit()
    return {"status": "success", "message": "Password changed successfully"}


# ─── App Settings APIs ───────────────────────────────────────────────────

@router.get("/api/settings/app")
async def get_app_settings(request: Request, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    app_id = request.cookies.get("current_app_id")
    if not app_id:
        raise HTTPException(status_code=400, detail="No app selected")
    app = db.query(App).filter(App.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="App not found")
    return {
        "url": app.url,
        "description": app.description,
        "settings": app.settings or {},
        "client_key": app.client_key,
    }


@router.put("/api/settings/app")
async def update_app_settings(data: AppSettingsRequest, request: Request, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    app_id = request.cookies.get("current_app_id")
    if not app_id:
        raise HTTPException(status_code=400, detail="No app selected")
    app = db.query(App).filter(App.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="App not found")
    if app.owner_id != user.id:
        raise HTTPException(status_code=403, detail="Only the app owner can change settings")

    if data.url is not None:
        app.url = data.url
    if data.description is not None:
        app.description = data.description

    settings = app.settings or {}
    if data.monitoring_enabled is not None:
        settings['monitoring_enabled'] = data.monitoring_enabled
    if data.check_interval is not None:
        settings['check_interval'] = data.check_interval
    app.settings = settings
    db.commit()
    return {"status": "success", "message": "App settings updated"}


@router.post("/api/settings/app/regenerate-key")
async def regenerate_app_key(request: Request, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    app_id = request.cookies.get("current_app_id")
    if not app_id:
        raise HTTPException(status_code=400, detail="No app selected")
    app = db.query(App).filter(App.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="App not found")
    if app.owner_id != user.id:
        raise HTTPException(status_code=403, detail="Only the app owner can regenerate the API key")
    
    app.client_key = generate_uuid()
    db.commit()
    return {"status": "success", "message": "API Key regenerated successfully", "client_key": app.client_key}


# ─── Integrations APIs ───────────────────────────────────────────────────

@router.post("/api/settings/integrations/github")
async def update_github_settings(data: GitHubSettingsRequest, request: Request, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    app_id = request.cookies.get("current_app_id")
    if not app_id:
        raise HTTPException(status_code=400, detail="No app selected")
    app = db.query(App).filter(App.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="App not found")
    if app.owner_id != user.id:
        raise HTTPException(status_code=403, detail="Only the app owner can update integrations")

    settings = app.settings or {}
    if data.github_repo is not None:
        settings['github_repo'] = data.github_repo
    if data.github_token is not None:
        settings['github_token'] = data.github_token
        
    app.settings = settings
    db.commit()
    return {"status": "success", "message": "GitHub settings saved"}


@router.post("/api/settings/integrations/github/sync")
async def sync_github_issues(request: Request, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    import requests
    from models import BugStatusEnum, SeverityEnum
    
    app_id = request.cookies.get("current_app_id")
    if not app_id:
        raise HTTPException(status_code=400, detail="No app selected")
    app = db.query(App).filter(App.id == app_id).first()
    if not app or app.owner_id != user.id:
        raise HTTPException(status_code=403, detail="Permission denied")
        
    settings = app.settings or {}
    repo = settings.get("github_repo")
    token = settings.get("github_token")
    
    if not repo:
        raise HTTPException(status_code=400, detail="GitHub Repo is not configured")
        
    headers = {"Accept": "application/vnd.github.v3+json"}
    if token:
        headers["Authorization"] = f"token {token}"
        
    # Fetch issues from GitHub
    url = f"https://api.github.com/repos/{repo}/issues?state=all&per_page=100"
    response = requests.get(url, headers=headers)
    
    if response.status_code != 200:
        raise HTTPException(status_code=400, detail=f"Failed to fetch from GitHub: {response.json().get('message', 'Unknown error')}")
        
    issues = response.json()
    synced_count = 0
    
    for issue in issues:
        # Skip pull requests
        if "pull_request" in issue:
            continue
            
        gh_id = str(issue["id"])
        
        # Check if bug exists by searching for github ID in title or custom logic.
        # A better way is to search if a bug already has this title, or we add github_id to Bug model.
        # Since we don't have github_id, we'll try to match by exact title to avoid duplicates, 
        # or append [GH-#] to title. Let's use [GH-{number}]
        
        title = f"[GH-{issue['number']}] {issue['title']}"
        existing = db.query(Bug).filter(Bug.app_id == app_id, Bug.title == title).first()
        
        status = BugStatusEnum.open if issue["state"] == "open" else BugStatusEnum.resolved
        
        if existing:
            # Update existing
            if existing.status != status:
                existing.status = status
        else:
            # Create new
            new_bug = Bug(
                app_id=app_id,
                title=title,
                description=issue.get("body") or "No description provided.",
                status=status,
                severity=SeverityEnum.medium,
                reported_by=user.id
            )
            db.add(new_bug)
        synced_count += 1
        
    db.commit()
    return {"status": "success", "message": f"Successfully synced {synced_count} issues from GitHub"}


# ─── Notification Settings APIs ───────────────────────────────────────────

@router.put("/api/settings/notifications")
async def update_notification_settings(data: NotificationSettingsRequest, request: Request, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    app_id = request.cookies.get("current_app_id")
    if not app_id:
        raise HTTPException(status_code=400, detail="No app selected")
    app = db.query(App).filter(App.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="App not found")
    if app.owner_id != user.id:
        raise HTTPException(status_code=403, detail="Only the app owner can change settings")

    settings = app.settings or {}
    if data.alert_email is not None:
        settings['alert_email'] = data.alert_email
    if data.alert_email_address is not None:
        settings['alert_email_address'] = data.alert_email_address
    if data.alert_whatsapp is not None:
        settings['alert_whatsapp'] = data.alert_whatsapp
    if data.alert_whatsapp_number is not None:
        settings['alert_whatsapp_number'] = data.alert_whatsapp_number
    if data.alert_threshold is not None:
        settings['alert_threshold'] = data.alert_threshold
    if data.weekly_cto_report is not None:
        settings['weekly_cto_report'] = data.weekly_cto_report
    app.settings = settings
    db.commit()
    return {"status": "success", "message": "Notification settings updated"}


# ─── Appearance Settings APIs ─────────────────────────────────────────────

@router.put("/api/settings/appearance")
async def update_appearance(data: AppearanceSettingsRequest, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    prefs = user.preferences or {}
    if data.theme is not None:
        prefs['theme'] = data.theme
    if data.sidebar_collapsed is not None:
        prefs['sidebar_collapsed'] = data.sidebar_collapsed
    if data.language is not None:
        prefs['language'] = data.language
    user.preferences = prefs
    db.commit()
    return {"status": "success", "message": "Appearance settings updated"}


# ─── Team Defaults APIs ──────────────────────────────────────────────────

@router.put("/api/settings/team-defaults")
async def update_team_defaults(data: TeamDefaultsRequest, request: Request, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    app_id = request.cookies.get("current_app_id")
    if not app_id:
        raise HTTPException(status_code=400, detail="No app selected")
    app = db.query(App).filter(App.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="App not found")
    if app.owner_id != user.id:
        raise HTTPException(status_code=403, detail="Only the app owner can change settings")

    settings = app.settings or {}
    if data.default_member_role is not None:
        settings['default_member_role'] = data.default_member_role
    if data.invite_expiry_days is not None:
        settings['invite_expiry_days'] = data.invite_expiry_days
    app.settings = settings
    db.commit()
    return {"status": "success", "message": "Team defaults updated"}


# ─── Security APIs ────────────────────────────────────────────────────────

@router.post("/api/settings/security/regenerate-key")
async def regenerate_api_key(request: Request, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    app_id = request.cookies.get("current_app_id")
    if not app_id:
        raise HTTPException(status_code=400, detail="No app selected")
    app = db.query(App).filter(App.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="App not found")
    if app.owner_id != user.id:
        raise HTTPException(status_code=403, detail="Only the app owner can regenerate the key")

    app.client_key = generate_uuid()
    db.commit()
    return {"status": "success", "message": "API key regenerated", "client_key": app.client_key}


@router.post("/api/settings/security/logout-all")
async def logout_all_devices(response: Response, user: User = Depends(get_current_user)):
    # Clear the current session cookie — in a real multi-session setup you'd invalidate all tokens
    res = JSONResponse(content={"status": "success", "message": "Logged out from all devices. Please log in again."})
    res.delete_cookie("access_token", path="/")
    res.delete_cookie("current_app_id", path="/")
    return res


# ─── Danger Zone APIs ────────────────────────────────────────────────────

@router.delete("/api/settings/danger/delete-app")
async def delete_app(request: Request, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    app_id = request.cookies.get("current_app_id")
    if not app_id:
        raise HTTPException(status_code=400, detail="No app selected")
    app = db.query(App).filter(App.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="App not found")
    if app.owner_id != user.id:
        raise HTTPException(status_code=403, detail="Only the app owner can delete the app")

    db.delete(app)
    db.commit()
    res = JSONResponse(content={"status": "success", "message": f"App '{app.name}' deleted"})
    res.delete_cookie("current_app_id", path="/")
    return res


@router.delete("/api/settings/danger/delete-account")
async def delete_account(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Delete all owned apps first (cascade will handle children)
    owned_apps = db.query(App).filter(App.owner_id == user.id).all()
    for app in owned_apps:
        db.delete(app)
    # Remove memberships
    db.query(AppMember).filter(AppMember.user_id == user.id).delete()
    db.delete(user)
    db.commit()
    res = JSONResponse(content={"status": "success", "message": "Account deleted"})
    res.delete_cookie("access_token", path="/")
    res.delete_cookie("current_app_id", path="/")
    return res


@router.get("/api/settings/danger/export-data")
async def export_data(request: Request, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    app_id = request.cookies.get("current_app_id")
    if not app_id:
        raise HTTPException(status_code=400, detail="No app selected")
    app = db.query(App).filter(App.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="App not found")

    export = {
        "app": app.to_dict(),
        "uptime_checks": [c.to_dict() for c in db.query(UptimeCheck).filter(UptimeCheck.app_id == app_id).all()],
        "uptime_incidents": [i.to_dict() for i in db.query(UptimeIncident).filter(UptimeIncident.app_id == app_id).all()],
        "bugs": [b.to_dict() for b in db.query(Bug).filter(Bug.app_id == app_id).all()],
        "maintenance_tasks": [m.to_dict() for m in db.query(MaintenanceTask).filter(MaintenanceTask.app_id == app_id).all()],
        "roadmap_features": [r.to_dict() for r in db.query(RoadmapFeature).filter(RoadmapFeature.app_id == app_id).all()],
        "server_metrics": [s.to_dict() for s in db.query(ServerMetric).filter(ServerMetric.app_id == app_id).all()],
    }

    json_bytes = json.dumps(export, indent=2, default=str).encode('utf-8')
    return StreamingResponse(
        io.BytesIO(json_bytes),
        media_type="application/json",
        headers={"Content-Disposition": f"attachment; filename=nexvora_export_{app.name}.json"}
    )
