import os
import joblib
import pandas as pd

PLANT_NAMES_ID = {
    "rice": "Padi",
    "maize": "Jagung",
    "chickpea": "Kacang Arab",
    "kidneybeans": "Kacang Merah",
    "pigeonpeas": "Kacang Gude",
    "mothbeans": "Kacang Moth",
    "mungbean": "Kacang Hijau",
    "blackgram": "Kacang Hitam",
    "lentil": "Lentil",
    "pomegranate": "Delima",
    "banana": "Pisang",
    "mango": "Mangga",
    "grapes": "Anggur",
    "watermelon": "Semangka",
    "muskmelon": "Melon",
    "apple": "Apel",
    "orange": "Jeruk",
    "papaya": "Pepaya",
    "coconut": "Kelapa",
    "cotton": "Kapas",
    "jute": "Rami",
    "coffee": "Kopi"
}

def predict_crop(features: dict):
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    model_dir = os.path.join(base_dir, "models_ml")
    
    model_path = None
    if os.path.exists(model_dir):
        for f in os.listdir(model_dir):
            if f.endswith('.pkl'):
                model_path = os.path.join(model_dir, f)
                break
                
    if not model_path or not os.path.exists(model_path):
        raise FileNotFoundError("Model ML (.pkl) belum tersedia di direktori models_ml.")
        
    try:
        model = joblib.load(model_path)
    except Exception as e:
        raise RuntimeError(f"Gagal memuat model: {e}")
        
    df = pd.DataFrame([{
        "N": features.get("n", features.get("N", 0)),
        "P": features.get("p", features.get("P", 0)),
        "K": features.get("k", features.get("K", 0)),
        "temperature": features.get("temperature", 0),
        "humidity": features.get("humidity", 0),
        "ph": features.get("ph", 6.5),
        "rainfall": features.get("rainfall", 0)
    }])
    
    try:
        if hasattr(model, "predict_proba"):
            probs = model.predict_proba(df)[0]
            pred_idx = probs.argmax()
            pred_label = model.classes_[pred_idx]
            probability = float(probs[pred_idx])
        else:
            pred_label = model.predict(df)[0]
            probability = 0.95
            
        label_id = PLANT_NAMES_ID.get(pred_label.lower(), pred_label)
        return {
            "label": label_id,
            "probability": probability,
            "raw_label": pred_label
        }
    except Exception as e:
        raise RuntimeError(f"Error saat melakukan prediksi: {e}")
