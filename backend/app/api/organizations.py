from fastapi import APIRouter, Depends, HTTPException, status
from typing import Any
from pydantic import BaseModel
from app.db.database import supabase
from app.core.security import get_current_user, require_roles
from app.models.schemas import OrganizationCreate

router = APIRouter()

class OrganizationUpdate(BaseModel):
    nama: str

@router.get("/")
async def list_organizations(current_user: dict = Depends(require_roles(["superadmin", "admin"]))) -> Any:
    if current_user["role"] == "admin":
        response = supabase.table("organizations")\
            .select("*")\
            .eq("id", current_user["organization_id"])\
            .execute()
    else:
        response = supabase.table("organizations")\
            .select("*")\
            .execute()
    return response.data

@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_organization(org: OrganizationCreate, current_user: dict = Depends(require_roles(["superadmin"]))) -> Any:
    response = supabase.table("organizations").insert(org.model_dump()).execute()
    if not response.data:
        raise HTTPException(status_code=500, detail="Failed to create organization")
    return response.data[0]

@router.get("/{org_id}")
def get_organization(
    org_id: int,
    current_user: dict = Depends(get_current_user)
):
    # Superadmin bisa akses semua
    if current_user["role"] != "superadmin":
        # Admin/user hanya bisa akses org sendiri
        if current_user.get("organization_id") != org_id:
            raise HTTPException(
                status_code=403,
                detail="Tidak punya akses ke organisasi ini"
            )
    
    result = supabase.table("organizations")\
        .select("*")\
        .eq("id", org_id)\
        .execute()
    
    if not result.data:
        raise HTTPException(status_code=404, 
            detail="Organisasi tidak ditemukan")
    
    org = result.data[0]
    
    # Hitung jumlah user
    users = supabase.table("users")\
        .select("id")\
        .eq("organization_id", org_id)\
        .execute()
    
    org["user_count"] = len(users.data)
    return org

@router.put("/{org_id}")
async def update_organization(org_id: str, payload: OrganizationUpdate, current_user: dict = Depends(require_roles(["superadmin"]))) -> Any:
    org_res = supabase.table("organizations").select("*").eq("id", org_id).execute()
    if not org_res.data:
        raise HTTPException(status_code=404, detail="Organization not found")
        
    res = supabase.table("organizations").update(payload.model_dump()).eq("id", org_id).execute()
    if not res.data:
        raise HTTPException(status_code=500, detail="Failed to update organization")
    return res.data[0]

@router.delete("/{org_id}", status_code=status.HTTP_200_OK)
async def delete_organization(org_id: str, current_user: dict = Depends(require_roles(["superadmin"]))) -> Any:
    org_res = supabase.table("organizations").select("*").eq("id", org_id).execute()
    if not org_res.data:
        raise HTTPException(status_code=404, detail="Organization not found")
        
    supabase.table("organizations").delete().eq("id", org_id).execute()
    return None
