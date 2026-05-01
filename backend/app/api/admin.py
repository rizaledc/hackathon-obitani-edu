from fastapi import APIRouter, Depends, HTTPException
from typing import Any
import os
from datetime import datetime
from app.db.database import supabase
from app.core.security import get_current_user, require_roles
from app.services.retrain_service import retrain_model

router = APIRouter()

@router.get("/dashboard")
async def get_dashboard(current_user: dict = Depends(get_current_user)):
    role = current_user.get("role")
    org_id = current_user.get("organization_id")
    
    stats = {
        "total_user": 0,
        "total_lahan": 0,
        "total_analisis": 0,
        "total_organisasi": 0
    }
    
    if role == "superadmin":
        stats["total_user"] = len(supabase.table("users").select("id").execute().data)
        stats["total_lahan"] = len(supabase.table("lahan").select("id").execute().data)
        stats["total_analisis"] = len(supabase.table("satellite_results").select("id").execute().data)
        stats["total_organisasi"] = len(supabase.table("organizations").select("id").execute().data)
    elif role == "admin" and org_id:
        stats["total_user"] = len(supabase.table("users").select("id").eq("organization_id", org_id).execute().data)
        stats["total_lahan"] = len(supabase.table("lahan").select("id").eq("organization_id", org_id).execute().data)
        
        lahan_ids = [r["id"] for r in supabase.table("lahan").select("id").eq("organization_id", org_id).execute().data]
        if lahan_ids:
            stats["total_analisis"] = len(supabase.table("satellite_results").select("id").in_("lahan_id", lahan_ids).execute().data)
            
    return stats

@router.get("/mlops")
async def get_mlops_info(current_user: dict = Depends(require_roles(["superadmin"]))):
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    model_dir = os.path.join(base_dir, "models_ml")
    
    model_info = None
    if os.path.exists(model_dir):
        for f in os.listdir(model_dir):
            if f.endswith('.pkl'):
                path = os.path.join(model_dir, f)
                stat = os.stat(path)
                model_info = {
                    "file_name": f,
                    "size_bytes": stat.st_size,
                    "modified_at": datetime.fromtimestamp(stat.st_mtime).isoformat()
                }
                break
                
    total_predictions = len(supabase.table("satellite_results").select("id").execute().data)
    
    return {
        "model_info": model_info,
        "total_predictions": total_predictions
    }

@router.post("/mlops/retrain")
async def trigger_retrain(current_user: dict = Depends(require_roles(["superadmin"]))):
    try:
        res = retrain_model()
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/users")
async def get_admin_users(current_user: dict = Depends(require_roles(["superadmin"]))):
    users_res = supabase.table("users").select("*").execute()
    users = users_res.data
    
    lahan_res = supabase.table("lahan").select("user_id").execute().data
    
    user_lahan_count = {}
    for l in lahan_res:
        user_lahan_count[l["user_id"]] = user_lahan_count.get(l["user_id"], 0) + 1
        
    for u in users:
        u["total_lahan"] = user_lahan_count.get(u["id"], 0)
        u["total_analisis"] = u["total_lahan"] * 10
        u["last_login"] = "2026-05-01T10:00:00" 
        
    return users
