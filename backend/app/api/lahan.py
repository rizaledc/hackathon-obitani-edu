from fastapi import APIRouter, Depends, HTTPException, status
from typing import Any, List
from app.db.database import supabase
from app.models.schemas import LahanCreate, LahanUpdate
from app.core.security import get_current_user
from app.services.gee_service import analyze_lahan
from app.services.ml_service import predict_crop

router = APIRouter()

@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_lahan(lahan: LahanCreate, current_user: dict = Depends(get_current_user)) -> Any:
    lahan_dict = lahan.model_dump()
    lahan_dict["user_id"] = current_user["id"]
    lahan_dict["organization_id"] = current_user.get("organization_id")
    
    response = supabase.table("lahan").insert(lahan_dict).execute()
    if not response.data:
        raise HTTPException(status_code=500, detail="Failed to create lahan")
        
    return response.data[0]

@router.get("/")
async def list_lahan(current_user: dict = Depends(get_current_user)) -> Any:
    organization_id = current_user.get("organization_id")
    if not organization_id:
        response = supabase.table("lahan").select("*").eq("user_id", current_user["id"]).execute()
    else:
        response = supabase.table("lahan").select("*").eq("organization_id", organization_id).execute()
        
    return response.data

@router.get("/{lahan_id}")
async def get_lahan(lahan_id: str, current_user: dict = Depends(get_current_user)) -> Any:
    response = supabase.table("lahan").select("*").eq("id", lahan_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Lahan not found")
        
    lahan = response.data[0]
    
    if lahan.get("organization_id") != current_user.get("organization_id") and lahan.get("user_id") != current_user["id"]:
        raise HTTPException(status_code=403, detail="Not authorized to access this lahan")
        
    return lahan

@router.delete("/{lahan_id}", status_code=status.HTTP_200_OK)
async def delete_lahan(lahan_id: str, current_user: dict = Depends(get_current_user)) -> Any:
    response = supabase.table("lahan").select("*").eq("id", lahan_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Lahan not found")
        
    lahan = response.data[0]
    if lahan.get("organization_id") != current_user.get("organization_id") and lahan.get("user_id") != current_user["id"]:
        raise HTTPException(status_code=403, detail="Not authorized to delete this lahan")
        
    supabase.table("lahan").delete().eq("id", lahan_id).execute()
    return None

@router.post("/{lahan_id}/analyze")
async def analyze_lahan_endpoint(lahan_id: str, current_user: dict = Depends(get_current_user)) -> Any:
    lahan = await get_lahan(lahan_id, current_user)
    
    polygon_geojson = lahan.get("koordinat")
    if not polygon_geojson:
        raise HTTPException(status_code=400, detail="Lahan does not have coordinate data")
        
    try:
        points_data = analyze_lahan(polygon_geojson, lahan_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"GEE Analysis failed: {e}")
        
    results_to_insert = []
    response_data = []
    
    for pt in points_data:
        try:
            ml_result = predict_crop(pt)
        except Exception as e:
            ml_result = {"label": "Unknown", "probability": 0.0, "raw_label": "Error"}
            print(f"ML Prediction failed: {e}")
            
        record = {
            "lahan_id": lahan_id,
            "organization_id": lahan.get("organization_id"),
            "longitude": pt["longitude"],
            "latitude": pt["latitude"],
            "n": pt["n"],
            "p": pt["p"],
            "k": pt["k"],
            "temperature": pt["temperature"],
            "humidity": pt["humidity"],
            "ph": pt["ph"],
            "rainfall": pt["rainfall"],
            "ndti": pt.get("ndti"),
            "hasil_rekomendasi": ml_result["label"]
        }
        results_to_insert.append(record)
        
    if results_to_insert:
        try:
            sup_res = supabase.table("satellite_results").insert(results_to_insert).execute()
            response_data = sup_res.data
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to save results: {e}")
            
    return {
        "message": "Analysis completed successfully",
        "results": response_data or results_to_insert
    }

@router.put("/{lahan_id}", response_model=dict)
def update_lahan(
    lahan_id: int,
    lahan_update: LahanUpdate,
    current_user: dict = Depends(get_current_user)
):
    try:
        # Cek lahan milik user atau superadmin
        existing = supabase.table("lahan").select("*").eq(
            "id", lahan_id).execute()
        if not existing.data:
            raise HTTPException(status_code=404, detail="Lahan tidak ditemukan")
        
        lahan = existing.data[0]
        if current_user["role"] != "superadmin" and \
           lahan["user_id"] != current_user["id"]:
            raise HTTPException(status_code=403, detail="Tidak punya akses")
        
        update_data = {}
        if lahan_update.nama is not None:
            update_data["nama"] = lahan_update.nama
        if lahan_update.deskripsi is not None:
            update_data["deskripsi"] = lahan_update.deskripsi
        update_data["updated_at"] = "now()"
        
        result = supabase.table("lahan").update(
            update_data).eq("id", lahan_id).execute()
        return {"message": "Lahan berhasil diupdate", "data": result.data[0]}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
