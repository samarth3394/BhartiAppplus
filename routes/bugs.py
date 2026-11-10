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


# --- APIs ---
@router.get("/api/bugs")
async def list_bugs(request: Request, status: Optional[str] = None, severity: Optional[str] = None, assignee: Optional[str] = None, search: Optional[str] = None, sort: str = "newest", user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    from dependencies import get_user_app_role
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
    role = get_user_app_role(db, user, app_id)
    app_obj = db.query(App).filter(App.id == app_id).first()
    app_settings = (app_obj.settings or {}) if app_obj else {}
    hourly_revenue = float(app_settings.get("hourly_revenue") or 0.0)
    currency = app_settings.get("currency") or "USD"

    from services.revenue_service import calculate_bug_revenue_impact
    bug_dicts = []
    for b in bugs:
        d = b.to_dict()
        d["revenue_impact"] = calculate_bug_revenue_impact(b, hourly_revenue)
        bug_dicts.append(d)

    return {
        'bugs': bug_dicts,
        'user_role': role,
        'hourly_revenue': hourly_revenue,
        'currency': currency,
    }


@router.post("/api/bugs", status_code=status.HTTP_201_CREATED)
async def create_bug(data: BugCreateRequest, request: Request, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    from dependencies import check_app_role
    app_id = request.cookies.get('current_app_id')
    if not app_id:
        raise HTTPException(status_code=400, detail="No app selected")

    check_app_role(db, user, app_id, [RoleEnum.admin, RoleEnum.project_manager, RoleEnum.developer, RoleEnum.tester])

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
    from dependencies import check_app_role
    app_id = request.cookies.get('current_app_id')
    if not app_id:
        raise HTTPException(status_code=400, detail="No app selected")

    check_app_role(db, user, app_id, [RoleEnum.admin, RoleEnum.project_manager, RoleEnum.developer, RoleEnum.tester])

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
    from dependencies import check_app_role
    app_id = request.cookies.get('current_app_id')
    if not app_id:
        raise HTTPException(status_code=400, detail="No app selected")

    check_app_role(db, user, app_id, [RoleEnum.admin, RoleEnum.project_manager])

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


class CreatePRRequest(BaseModel):
    branch_name: Optional[str] = None
    pr_title: Optional[str] = None
    pr_body: Optional[str] = None
    target_file: Optional[str] = None


@router.post("/api/bugs/{bug_id}/generate-fix")
async def generate_bug_fix_diff(
    bug_id: str,
    request: Request,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    app_id = request.cookies.get('current_app_id')
    if not app_id:
        raise HTTPException(status_code=400, detail="No app selected")

    bug = db.query(Bug).filter(Bug.id == bug_id, Bug.app_id == app_id).first()
    if not bug:
        raise HTTPException(status_code=404, detail="Bug not found")

    from models import AppErrorLog
    from services.ai_service import generate_fix_diff, extract_stack_location
    from sqlalchemy.orm.attributes import flag_modified
    import requests as http_requests

    meta = dict(bug.metadata_json or {})
    stack_trace = meta.get("stack_trace") or ""
    if not stack_trace:
        latest_log = (
            db.query(AppErrorLog)
            .filter(AppErrorLog.app_id == app_id)
            .order_by(AppErrorLog.timestamp.desc())
            .first()
        )
        if latest_log and latest_log.stack_trace:
            stack_trace = latest_log.stack_trace

    source_snippet = ""
    app_obj = db.query(App).filter(App.id == app_id).first()
    app_settings = (app_obj.settings or {}) if app_obj else {}
    repo = app_settings.get("github_repo")
    token = app_settings.get("github_token")

    if repo:
        loc = extract_stack_location(f"{bug.description}\n{stack_trace}")
        target_path = loc.get("file", "")
        if target_path and target_path != "app/handler.py":
            try:
                headers = {"Accept": "application/vnd.github.v3.raw"}
                if token:
                    headers["Authorization"] = f"token {token}"
                gh_res = http_requests.get(
                    f"https://api.github.com/repos/{repo}/contents/{target_path}",
                    headers=headers,
                    timeout=5,
                )
                if gh_res.status_code == 200:
                    source_snippet = gh_res.text[:4000]
            except Exception:
                pass

    ai_fix = generate_fix_diff(bug.title, bug.description or "", stack_trace, source_snippet)
    meta["ai_fix"] = ai_fix
    bug.metadata_json = meta
    flag_modified(bug, "metadata_json")
    db.commit()

    return {"fix": ai_fix, "bug_id": bug.id}


@router.post("/api/bugs/{bug_id}/create-pr")
async def create_bug_pr(
    bug_id: str,
    data: Optional[CreatePRRequest] = None,
    request: Request = None,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    import os
    import base64
    import requests as http_requests
    from sqlalchemy.orm.attributes import flag_modified
    from services.ai_service import generate_fix_diff

    app_id = request.cookies.get('current_app_id') if request else None
    if not app_id:
        raise HTTPException(status_code=400, detail="No app selected")

    bug = db.query(Bug).filter(Bug.id == bug_id, Bug.app_id == app_id).first()
    if not bug:
        raise HTTPException(status_code=404, detail="Bug not found")

    meta = dict(bug.metadata_json or {})
    ai_fix = meta.get("ai_fix")
    if not ai_fix:
        ai_fix = generate_fix_diff(bug.title, bug.description or "", meta.get("stack_trace", ""))
        meta["ai_fix"] = ai_fix

    branch_name = (data.branch_name if data and data.branch_name else None) or f"brexal/fix-{bug.id[:8]}"
    pr_title = (data.pr_title if data and data.pr_title else None) or ai_fix.get("pr_title") or f"fix: {bug.title[:65]}"
    pr_body = (
        (data.pr_body if data and data.pr_body else None)
        or ai_fix.get("pr_body")
        or f"Automated fix draft for bug #{bug.id}"
    )
    diff_text = ai_fix.get("unified_diff", "")
    full_pr_body = f"{pr_body}\n\n### Proposed Unified Diff\n```diff\n{diff_text}\n```"

    app_obj = db.query(App).filter(App.id == app_id).first()
    app_settings = (app_obj.settings or {}) if app_obj else {}
    repo = app_settings.get("github_repo")
    token = app_settings.get("github_token") or os.getenv("GITHUB_TOKEN")

    if not repo or not token:
        draft_info = {
            "status": "draft_ready",
            "branch_name": branch_name,
            "pr_title": pr_title,
            "pr_body": full_pr_body,
            "unified_diff": diff_text,
            "cli_command": f"git checkout -b {branch_name} && git apply <<'EOF'\n{diff_text}\nEOF\ngh pr create --title \"{pr_title}\" --body-file -",
            "message": "Configure GitHub Repository & Token in Settings to open PRs automatically via API, or apply locally with the patch command.",
        }
        meta["github_pr"] = draft_info
        bug.metadata_json = meta
        flag_modified(bug, "metadata_json")
        db.commit()
        return draft_info

    headers = {
        "Accept": "application/vnd.github.v3+json",
        "Authorization": f"token {token}",
    }

    try:
        repo_res = http_requests.get(f"https://api.github.com/repos/{repo}", headers=headers, timeout=8)
        if repo_res.status_code != 200:
            raise HTTPException(status_code=400, detail=f"GitHub repo lookup failed: {repo_res.text}")
        default_branch = repo_res.json().get("default_branch", "main")

        ref_res = http_requests.get(
            f"https://api.github.com/repos/{repo}/git/ref/heads/{default_branch}",
            headers=headers,
            timeout=8,
        )
        if ref_res.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to fetch base branch SHA from GitHub")
        base_sha = ref_res.json()["object"]["sha"]

        # Create branch (ignore if already exists)
        http_requests.post(
            f"https://api.github.com/repos/{repo}/git/refs",
            headers=headers,
            json={"ref": f"refs/heads/{branch_name}", "sha": base_sha},
            timeout=8,
        )

        # Commit patch record file so the PR has a concrete diff commit on the branch
        patch_path = f".brexal/patches/fix-{bug.id[:8]}.patch"
        patch_content_b64 = base64.b64encode((diff_text or pr_body).encode("utf-8")).decode("utf-8")

        existing_file = http_requests.get(
            f"https://api.github.com/repos/{repo}/contents/{patch_path}?ref={branch_name}",
            headers=headers,
            timeout=8,
        )
        commit_payload = {
            "message": pr_title,
            "content": patch_content_b64,
            "branch": branch_name,
        }
        if existing_file.status_code == 200:
            commit_payload["sha"] = existing_file.json().get("sha")

        put_res = http_requests.put(
            f"https://api.github.com/repos/{repo}/contents/{patch_path}",
            headers=headers,
            json=commit_payload,
            timeout=8,
        )
        if put_res.status_code not in (200, 201):
            raise HTTPException(status_code=400, detail=f"Failed to push fix commit: {put_res.text}")

        pr_res = http_requests.post(
            f"https://api.github.com/repos/{repo}/pulls",
            headers=headers,
            json={
                "title": pr_title,
                "body": full_pr_body,
                "head": branch_name,
                "base": default_branch,
                "draft": True,
            },
            timeout=8,
        )
        if pr_res.status_code not in (200, 201):
            raise HTTPException(status_code=400, detail=f"Failed to open GitHub PR: {pr_res.text}")

        pr_json = pr_res.json()
        pr_info = {
            "status": "created",
            "pr_number": pr_json.get("number"),
            "pr_url": pr_json.get("html_url"),
            "branch_name": branch_name,
            "pr_title": pr_title,
        }
        meta["github_pr"] = pr_info
        bug.metadata_json = meta
        flag_modified(bug, "metadata_json")

        db.add(
            ActivityLog(
                app_id=app_id,
                user_id=user.id,
                action=f"Opened AI Self-Healing Draft PR #{pr_info['pr_number']} for bug: {bug.title[:50]}",
                entity_type="bug",
                entity_id=bug.id,
                metadata_json=pr_info,
            )
        )
        db.commit()
        return pr_info
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"GitHub PR creation failed: {str(exc)}")
