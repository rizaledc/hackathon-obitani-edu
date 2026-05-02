from fastapi import APIRouter, Depends, HTTPException, status
from typing import Any, Optional
from pydantic import BaseModel, EmailStr
from app.db.database import supabase
from app.core.security import get_current_user

router = APIRouter()

from app.models.schemas import UserUpdate

@router.get("/")
async def list_users(current_user: dict = Depends(get_current_user)) -> Any:
    role = current_user.get("role")
    if role == "superadmin":
        response = supabase.table("users").select("id, username, email, name, role, organization_id").execute()
    elif role == "admin":
        org_id = current_user.get("organization_id")
        if not org_id:
            return [current_user]
        response = supabase.table("users").select("id, username, email, name, role, organization_id").eq("organization_id", org_id).execute()
    else:
        response = supabase.table("users").select("id, username, email, name, role, organization_id").eq("id", current_user["id"]).execute()
        
    return response.data

@router.get("/{user_id}")
async def get_user(user_id: str, current_user: dict = Depends(get_current_user)) -> Any:
    response = supabase.table("users").select("id, username, email, name, role, organization_id").eq("id", user_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="User not found")
        
    user = response.data[0]
    
    role = current_user.get("role")
    if role != "superadmin":
        if role == "admin":
            if user.get("organization_id") != current_user.get("organization_id"):
                raise HTTPException(status_code=403, detail="Not authorized to access this user")
        else:
            if user_id != current_user["id"]:
                raise HTTPException(status_code=403, detail="Not authorized to access this user")
                
    return user

@router.put("/{user_id}")
async def update_user(user_id: str, payload: UserUpdate, current_user: dict = Depends(get_current_user)) -> Any:
    user = await get_user(user_id, current_user)
    
    update_data = {}
    if payload.name:
        update_data["name"] = payload.name
    if payload.email:
        existing = supabase.table("users").select("id").eq("email", payload.email).neq("id", user_id).execute()
        if existing.data:
            raise HTTPException(status_code=400, detail="Email already taken")
        update_data["email"] = payload.email
        
    if payload.role:
        if current_user.get("role") != "superadmin":
            raise HTTPException(status_code=403, detail="Only superadmin can update role")
        if user.get("role") == "superadmin" and str(user.get("id")) != str(current_user.get("id")):
            raise HTTPException(status_code=403, detail="Cannot update role of another superadmin")
        update_data["role"] = payload.role
        
    if payload.organization_id is not None:
        update_data["organization_id"] = payload.organization_id
        
    if not update_data:
        return user
        
    res = supabase.table("users").update(update_data).eq("id", user_id).execute()
    if not res.data:
        raise HTTPException(status_code=500, detail="Failed to update user")
    return res.data[0]

@router.delete("/{user_id}", status_code=status.HTTP_200_OK)
async def delete_user(user_id: str, current_user: dict = Depends(get_current_user)) -> Any:
    if user_id == current_user["id"]:
        raise HTTPException(status_code=400, detail="Cannot delete yourself")
        
    user = await get_user(user_id, current_user)
    
    role = current_user.get("role")
    if role not in ["superadmin", "admin"]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
        
    supabase.table("users").delete().eq("id", user_id).execute()
    return None
