import hmac
import hashlib
import json
from fastapi import APIRouter, Request, Depends, HTTPException, Header
from sqlalchemy.orm import Session
import os

from models import Issue
from dependencies import get_db

router = APIRouter(tags=["github"])

def verify_signature(payload: bytes, signature_header: str, secret: str):
    if not signature_header:
        raise HTTPException(status_code=403, detail="x-hub-signature-256 header is missing!")
    
    hash_object = hmac.new(secret.encode('utf-8'), msg=payload, digestmod=hashlib.sha256)
    expected_signature = "sha256=" + hash_object.hexdigest()
    
    if not hmac.compare_digest(expected_signature, signature_header):
        raise HTTPException(status_code=403, detail="Request signatures didn't match!")

@router.post("/api/github/webhook")
async def github_webhook(
    request: Request,
    x_hub_signature_256: str = Header(None),
    db: Session = Depends(get_db)
):
    # Try to verify payload if a webhook secret is configured
    # In a multi-tenant app, this might come from the App.settings, but for simplicity we use an env var
    webhook_secret = os.environ.get("GITHUB_WEBHOOK_SECRET")
    
    payload = await request.body()
    if webhook_secret:
        verify_signature(payload, x_hub_signature_256, webhook_secret)
        
    event = request.headers.get("x-github-event")
    
    if event == "pull_request":
        data = json.loads(payload)
        action = data.get("action")
        pr = data.get("pull_request", {})
        
        # We look for issue IDs in the branch name, e.g. "feature/BAP-123"
        # Or in the PR body. For this implementation, we will search for an issue 
        # where github_branch_name == PR's branch name
        branch_name = pr.get("head", {}).get("ref")
        merged = pr.get("merged", False)
        
        if branch_name:
            issue = db.query(Issue).filter(Issue.github_branch_name == branch_name).first()
            if issue:
                if action == "closed" and merged:
                    issue.status = "done"
                elif action == "opened" or action == "reopened":
                    issue.status = "review"
                
                db.commit()
                
    return {"message": "Webhook processed successfully"}
