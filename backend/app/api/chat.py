from fastapi import APIRouter, Depends, HTTPException
from typing import Any, Optional
import os
import google.generativeai as genai
from app.db.database import supabase
from app.core.security import get_current_user
from app.models.schemas import ChatRequest

router = APIRouter()

MODEL_LIST = [
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite",
    "gemini-2.0-flash", 
    "gemini-2.0-flash-lite"
]

SYSTEM_PROMPT = """Kamu adalah Orbitani, asisten AI pakar agrikultur presisi yang dikembangkan oleh tim Arthree Vision. 
Kamu hanya boleh menjawab pertanyaan yang berkaitan dengan topik-topik berikut:
- Rekomendasi tanaman berdasarkan data sensor (NPK, suhu, kelembaban, curah hujan, pH)
- Interpretasi data satelit (NDVI, NDTI, Sentinel-2, Landsat-8)
- Agrikultur presisi, pertanian cerdas, dan teknologi pertanian modern
- Penjelasan hasil analisis lahan dari platform Orbitani Edu
- Edukasi pertanian untuk mahasiswa dan pelajar
- Cara membaca dan memahami data GIS/geospasial terkait pertanian

Jika pengguna mengirim pertanyaan di luar topik di atas (misalnya politik, hiburan, 
coding umum, pertanyaan pribadi, atau topik tidak relevan), tolak dengan sopan menggunakan 
respons berikut:
"Maaf, saya hanya dapat membantu pertanyaan seputar agrikultur presisi dan analisis lahan. 
Silakan ajukan pertanyaan yang berkaitan dengan pertanian, data sensor, atau rekomendasi tanaman."

Jika tersedia data lahan, gunakan format konteks berikut sebelum menjawab:
[KONTEKS LAHAN]
- Rata-rata NDVI: {ndvi}
- Rata-rata NPK: N={n}, P={p}, K={k}
- Suhu rata-rata: {temperature}°C
- Kelembaban: {humidity}%
- Curah hujan 30 hari: {rainfall}mm
- Rekomendasi tanaman mayoritas: {top_crop}
[/KONTEKS LAHAN]

Gunakan bahasa Indonesia yang mudah dipahami. Jika data lahan tersedia, 
jadikan data tersebut sebagai dasar utama jawabanmu. Jangan mengarang data 
yang tidak ada dalam konteks. Selalu akhiri jawaban dengan satu kalimat 
motivasi singkat untuk petani/mahasiswa.

Jangan gunakan format markdown seperti **, *, #, ##, bullet points dengan -, atau format lainnya. 
Tulis jawaban dalam paragraf biasa yang mudah dibaca. 
Gunakan angka 1. 2. 3. untuk penomoran jika diperlukan."""

_gemini_keys = []
for i in range(1, 6):
    key = os.getenv(f"GEMINI_API_KEY{i}")
    if key and not key.startswith("[KEY"):
        _gemini_keys.append(key)
_current_key_idx = 0

def get_next_gemini_key():
    global _current_key_idx
    if not _gemini_keys:
        single_key = os.getenv("GEMINI_API_KEY")
        if single_key:
            return single_key
        raise HTTPException(status_code=500, detail="Gemini API Key not configured")
    key = _gemini_keys[_current_key_idx]
    _current_key_idx = (_current_key_idx + 1) % len(_gemini_keys)
    return key

@router.post("/")
async def chat_with_gemini(request: ChatRequest, current_user: dict = Depends(get_current_user)):
    user_message = request.message
    prompt_context = SYSTEM_PROMPT
    
    if request.lahan_id:
        res = supabase.table("satellite_results").select("*").eq("lahan_id", request.lahan_id).execute()
        if res.data:
            df = res.data
            ndvi = sum(r.get('ndvi', 0) or 0 for r in df) / len(df)
            n = sum(r.get('n', 0) for r in df) / len(df)
            p = sum(r.get('p', 0) for r in df) / len(df)
            k = sum(r.get('k', 0) for r in df) / len(df)
            temp = sum(r.get('temperature', 0) for r in df) / len(df)
            hum = sum(r.get('humidity', 0) for r in df) / len(df)
            rain = sum(r.get('rainfall', 0) for r in df) / len(df)
            
            crops = [r.get('predicted_label') for r in df if r.get('predicted_label')]
            top_crop = max(set(crops), key=crops.count) if crops else "Tidak diketahui"
            
            context_str = f"""
[KONTEKS LAHAN]
- Rata-rata NDVI: {ndvi:.2f}
- Rata-rata NPK: N={n:.2f}, P={p:.2f}, K={k:.2f}
- Suhu rata-rata: {temp:.2f}°C
- Kelembaban: {hum:.2f}%
- Curah hujan 30 hari: {rain:.2f}mm
- Rekomendasi tanaman mayoritas: {top_crop}
[/KONTEKS LAHAN]
"""
            prompt_context = prompt_context.replace("[KONTEKS LAHAN]\n- Rata-rata NDVI: {ndvi}\n- Rata-rata NPK: N={n}, P={p}, K={k}\n- Suhu rata-rata: {temperature}°C\n- Kelembaban: {humidity}%\n- Curah hujan 30 hari: {rainfall}mm\n- Rekomendasi tanaman mayoritas: {top_crop}\n[/KONTEKS LAHAN]", context_str)
        else:
            # Data lahan kosong
            prompt_context = prompt_context.split("Jika tersedia data lahan")[0].strip()
    else:
        prompt_context = prompt_context.split("Jika tersedia data lahan")[0].strip()
        
    full_prompt = f"{prompt_context}\n\nPertanyaan Pengguna: {user_message}"
    
    response_text = ""
    errors = []
    success = False
    
    # 1. Tentukan pool keys yang akan dipakai
    if request.user_api_key:
        keys_to_try = [request.user_api_key]
    else:
        keys_to_try = _gemini_keys if _gemini_keys else [os.getenv("GEMINI_API_KEY")]
        if not keys_to_try or not keys_to_try[0]:
            raise HTTPException(status_code=500, detail="No Gemini API Key available")

    # 2. Coba request
    for api_key in keys_to_try:
        if success:
            break
            
        if not request.user_api_key and len(_gemini_keys) > 0:
            api_key = get_next_gemini_key()
            
        genai.configure(api_key=api_key)
        
        for model_name in MODEL_LIST:
            try:
                model = genai.GenerativeModel(model_name)
                response = model.generate_content(full_prompt)
                response_text = response.text
                success = True
                break
            except Exception as e:
                error_str = str(e)
                errors.append(f"Model {model_name} failed: {error_str}")
                # Jika error 429, skip model lain di key ini, lanjut ke key berikutnya
                if "429" in error_str or "quota" in error_str.lower() or "rate" in error_str.lower():
                    break
                    
    if not success:
        raise HTTPException(status_code=500, detail=f"Gemini API failed after trying keys/models: {errors}")
        
    session_id = request.session_id or "default"
    session_name = request.session_name or "New Chat"
    
    user_msg_data = {
        "user_id": current_user["id"],
        "session_id": session_id,
        "session_name": session_name,
        "role": "user",
        "content": user_message
    }
    
    ai_msg_data = {
        "user_id": current_user["id"],
        "session_id": session_id,
        "session_name": session_name,
        "role": "assistant",
        "content": response_text
    }
    
    supabase.table("ai_chat_history").insert([user_msg_data, ai_msg_data]).execute()
    
    return {"response": response_text}

@router.get("/history")
async def get_chat_history(
    lahan_id: Optional[int] = None,
    current_user: dict = Depends(get_current_user)
):
    query = supabase.table("ai_chat_history")\
        .select("*")\
        .eq("user_id", current_user["id"])\
        .order("created_at", desc=False)
    
    if lahan_id:
        session_id = f"lahan_{lahan_id}"
        query = query.eq("session_id", session_id)
    
    result = query.execute()
    return result.data

@router.delete("/history")
async def delete_chat_history(current_user: dict = Depends(get_current_user)):
    supabase.table("ai_chat_history").delete().eq("user_id", current_user["id"]).execute()
    return {"message": "Chat history deleted"}
