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
    
    scaler_path = os.path.join(model_dir, "minmax_scaler.pkl")
    model_path = os.path.join(model_dir, "random_forest_model.pkl")
    encoder_path = os.path.join(model_dir, "label_encoder.pkl")
                
    if not (os.path.exists(scaler_path) and os.path.exists(model_path) and os.path.exists(encoder_path)):
        raise FileNotFoundError("File model ML (.pkl) belum tersedia lengkap di direktori models_ml.")
        
    try:
        scaler = joblib.load(scaler_path)
        model = joblib.load(model_path)
        encoder = joblib.load(encoder_path)
    except Exception as e:
        raise RuntimeError(f"Gagal memuat model: {e}")
        
    # Pastikan urutan fitur PERSIS sama dengan urutan kolom dataset training
    # [N, P, K, temperature, humidity, ph, rainfall]
    df = pd.DataFrame([{
        "N": features.get("n", features.get("N", 0)),
        "P": features.get("p", features.get("P", 0)),
        "K": features.get("k", features.get("K", 0)),
        "temperature": features.get("temperature", 0),
        "humidity": features.get("humidity", 0),
        "ph": features.get("ph", 6.5),
        "rainfall": features.get("rainfall", 0)
    }], columns=["N", "P", "K", "temperature", "humidity", "ph", "rainfall"])
    
    try:
        # Scale fitur menggunakan minmax_scaler
        X_scaled = scaler.transform(df)
        
        # Predict menggunakan random_forest_model
        if hasattr(model, "predict_proba"):
            probs = model.predict_proba(X_scaled)[0]
            pred_idx = probs.argmax()
            
            # Predict juga mengembalikan numeric class (misal: 0, 1, 2...)
            pred_numeric = model.classes_[pred_idx]
            probability = float(probs[pred_idx])
        else:
            pred_numeric = model.predict(X_scaled)[0]
            probability = 0.95
            
        # Decode label menggunakan label_encoder
        pred_label_array = encoder.inverse_transform([pred_numeric])
        pred_label = pred_label_array[0]
            
        # Return label dalam Bahasa Indonesia
        label_id = PLANT_NAMES_ID.get(pred_label.lower(), pred_label)
        
        return {
            "label": label_id,
            "probability": probability,
            "raw_label": pred_label
        }
    except Exception as e:
        raise RuntimeError(f"Error saat melakukan prediksi: {e}")
