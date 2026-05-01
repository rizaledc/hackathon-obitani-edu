from fastapi import APIRouter, Depends, HTTPException, status
from typing import Any
from pydantic import BaseModel
from app.db.database import supabase
from app.core.security import get_current_user
from app.models.schemas import FeedbackCreate

router = APIRouter()

@router.get("/")
async def list_history(current_user: dict = Depends(get_current_user)):
    
    if current_user["role"] == "superadmin":
        # Semua data
        result = supabase.table("satellite_results")\
            .select("*")\
            .order("created_at", desc=True)\
            .execute()
    
    elif current_user["role"] == "admin":
        # Filter by organization_id
        result = supabase.table("satellite_results")\
            .select("*")\
            .eq("organization_id", current_user["organization_id"])\
            .order("created_at", desc=True)\
            .execute()
    
    else:
        # User biasa: ambil lahan milik user dulu
        lahan_result = supabase.table("lahan")\
            .select("id")\
            .eq("user_id", current_user["id"])\
            .execute()
        
        lahan_ids = [l["id"] for l in lahan_result.data]
        
        if not lahan_ids:
            return []
        
        result = supabase.table("satellite_results")\
            .select("*")\
            .in_("lahan_id", lahan_ids)\
            .order("created_at", desc=True)\
            .execute()
    
    return result.data

@router.get("/export")
async def export_history(current_user: dict = Depends(get_current_user)) -> Any:
    data = await list_history(current_user)
    return {"export_data": data}

@router.get("/{lahan_id}")
async def get_history_by_lahan(lahan_id: str, current_user: dict = Depends(get_current_user)) -> Any:
    lahan_res = supabase.table("lahan").select("*").eq("id", lahan_id).execute()
    if not lahan_res.data:
        raise HTTPException(status_code=404, detail="Lahan not found")
        
    lahan = lahan_res.data[0]
    role = current_user.get("role")
    
    if role != "superadmin":
        if lahan.get("organization_id") != current_user.get("organization_id") and lahan.get("user_id") != current_user["id"]:
            raise HTTPException(status_code=403, detail="Not authorized")
            
    res = supabase.table("satellite_results").select("*").eq("lahan_id", lahan_id).execute()
    return res.data

@router.post("/{result_id}/feedback", status_code=status.HTTP_201_CREATED)
async def submit_feedback(result_id: str, payload: FeedbackCreate, current_user: dict = Depends(get_current_user)) -> Any:
    sat_res = supabase.table("satellite_results").select("*").eq("id", result_id).execute()
    if not sat_res.data:
        raise HTTPException(status_code=404, detail="Satellite result not found")
        
    result = sat_res.data[0]
    lahan_id = result["lahan_id"]
    
    feedback_data = {
        "lahan_id": lahan_id,
        "n": result.get("n", 0),
        "p": result.get("p", 0),
        "k": result.get("k", 0),
        "temperature": result.get("temperature", 0),
        "humidity": result.get("humidity", 0),
        "ph": result.get("ph", 6.5),
        "rainfall": result.get("rainfall", 0),
        "actual_label": payload.actual_crop,
        "rating": payload.rating,
        "submited_by": current_user["id"]
    }
    
    res = supabase.table("ml_feedback").insert(feedback_data).execute()
    if not res.data:
        raise HTTPException(status_code=500, detail="Failed to save feedback")
        
    return res.data[0]
