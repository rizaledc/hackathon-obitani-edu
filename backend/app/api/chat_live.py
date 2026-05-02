from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
from typing import Any, List, Dict
from app.db.database import supabase
from app.core.security import get_current_user
import json

router = APIRouter()

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, room_id: str):
        await websocket.accept()
        if room_id not in self.active_connections:
            self.active_connections[room_id] = []
        self.active_connections[room_id].append(websocket)

    def disconnect(self, websocket: WebSocket, room_id: str):
        if room_id in self.active_connections:
            self.active_connections[room_id].remove(websocket)

    async def broadcast(self, message: str, room_id: str):
        if room_id in self.active_connections:
            for connection in self.active_connections[room_id]:
                await connection.send_text(message)

manager = ConnectionManager()

@router.websocket("/ws/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str):
    await manager.connect(websocket, room_id)
    try:
        while True:
            data = await websocket.receive_text()
            try:
                payload = json.loads(data)
                
                msg_data = {
                    "room_id": room_id,
                    "sender_id": payload.get("sender_id"),
                    "message": payload.get("message"),
                    "is_read": False
                }
                res = supabase.table("messages").insert(msg_data).execute()
                saved_msg = res.data[0] if res.data else msg_data
                
                await manager.broadcast(json.dumps(saved_msg), room_id)
            except Exception as e:
                print(f"Error processing message: {e}")
                
    except WebSocketDisconnect:
        manager.disconnect(websocket, room_id)

@router.get("/messages/{room_id}")
async def get_messages(room_id: str, current_user: dict = Depends(get_current_user)):
    res = supabase.table("messages").select("*").eq("room_id", room_id).order("created_at", desc=False).limit(50).execute()
    return res.data

@router.get("/unread")
async def get_unread(current_user: dict = Depends(get_current_user)):
    res = supabase.table("messages").select("id", count="exact").neq("sender_id", current_user["id"]).eq("is_read", False).execute()
    count = res.count if res.count is not None else len(res.data)
    return {"unread_count": count}

@router.put("/read/{room_id}")
async def mark_read(room_id: str, current_user: dict = Depends(get_current_user)):
    supabase.table("messages").update({"is_read": True}).eq("room_id", room_id).neq("sender_id", current_user["id"]).execute()
    return {"message": "Messages marked as read"}
