import json
from typing import Dict, List
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from jose import JWTError, jwt

from models import User, ChatMessage, WorkspaceMember, Workspace
from dependencies import get_db, get_current_user, SECRET_KEY, ALGORITHM

router = APIRouter(tags=["chat"])

class ConnectionManager:
    def __init__(self):
        # Maps workspace_id to a list of connected websockets
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, workspace_id: str):
        await websocket.accept()
        if workspace_id not in self.active_connections:
            self.active_connections[workspace_id] = []
        self.active_connections[workspace_id].append(websocket)

    def disconnect(self, websocket: WebSocket, workspace_id: str):
        if workspace_id in self.active_connections:
            if websocket in self.active_connections[workspace_id]:
                self.active_connections[workspace_id].remove(websocket)
            if not self.active_connections[workspace_id]:
                del self.active_connections[workspace_id]

    async def broadcast(self, message: str, workspace_id: str):
        if workspace_id in self.active_connections:
            for connection in self.active_connections[workspace_id]:
                await connection.send_text(message)

manager = ConnectionManager()

def authenticate_ws(websocket: WebSocket, db: Session) -> User:
    token = websocket.cookies.get("access_token")
    if not token:
        return None
    
    if token.startswith("Bearer "):
        token = token.split(" ")[1]

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if not user_id:
            return None
    except JWTError:
        return None
        
    user = db.query(User).filter(User.id == user_id).first()
    return user


@router.websocket("/api/ws/chat/{workspace_id}")
async def websocket_endpoint(websocket: WebSocket, workspace_id: str, db: Session = Depends(get_db)):
    user = authenticate_ws(websocket, db)
    if not user:
        await websocket.close(code=1008) # Policy Violation
        return

    # Check if user has access to workspace
    workspace = db.query(Workspace).filter(Workspace.id == workspace_id).first()
    if not workspace:
        await websocket.close(code=1008)
        return
        
    is_owner = (workspace.owner_id == user.id)
    is_member = db.query(WorkspaceMember).filter(WorkspaceMember.workspace_id == workspace_id, WorkspaceMember.user_id == user.id).first() is not None
    
    if not is_owner and not is_member:
        await websocket.close(code=1008)
        return

    await manager.connect(websocket, workspace_id)
    try:
        while True:
            data = await websocket.receive_text()
            
            # Save message to DB
            new_msg = ChatMessage(
                workspace_id=workspace_id,
                sender_id=user.id,
                content=data
            )
            db.add(new_msg)
            db.commit()
            db.refresh(new_msg)
            
            # Broadcast to all users in workspace
            message_payload = json.dumps(new_msg.to_dict())
            await manager.broadcast(message_payload, workspace_id)
            
    except WebSocketDisconnect:
        manager.disconnect(websocket, workspace_id)

@router.get("/api/workspaces/{workspace_id}/messages")
async def get_messages(workspace_id: str, limit: int = 50, skip: int = 0, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    workspace = db.query(Workspace).filter(Workspace.id == workspace_id).first()
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
        
    is_owner = (workspace.owner_id == user.id)
    is_member = db.query(WorkspaceMember).filter(WorkspaceMember.workspace_id == workspace_id, WorkspaceMember.user_id == user.id).first() is not None
    
    if not is_owner and not is_member:
        raise HTTPException(status_code=403, detail="Not authorized to access this workspace's chat")
        
    # Get messages
    messages = db.query(ChatMessage).filter(ChatMessage.workspace_id == workspace_id).order_by(ChatMessage.created_at.desc()).offset(skip).limit(limit).all()
    
    # Return in chronological order
    messages.reverse()
    
    return {"messages": [m.to_dict() for m in messages]}
