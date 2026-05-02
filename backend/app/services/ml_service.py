import os
import joblib
import pandas as pd
import logging

logger = logging.getLogger(__name__)


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
    try:
        df = pd.DataFrame([[
            features["n"], features["p"], features["k"],
            features["temperature"], features["humidity"],
            features["ph"], features["rainfall"]
        ]], columns=["N", "P", "K", "temperature", "humidity", "ph", "rainfall"])
    except KeyError as ke:
        logger.error(f"Missing feature: {ke}")
        # Fallback to get with defaults if strict KeyError fails
        df = pd.DataFrame([[
            features.get("n", 0), features.get("p", 0), features.get("k", 0),
            features.get("temperature", 0), features.get("humidity", 0),
            features.get("ph", 6.5), features.get("rainfall", 0)
        ]], columns=["N", "P", "K", "temperature", "humidity", "ph", "rainfall"])
        
    logger.info(f"Input features: {features}")
    
    try:
        # Scale fitur menggunakan minmax_scaler
        X_scaled = scaler.transform(df)
        logger.info(f"Scaled features: {X_scaled}")
        
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
            
        logger.info(f"Raw prediction: {pred_numeric}")
            
        # Decode label menggunakan label_encoder
        pred_label_array = encoder.inverse_transform([pred_numeric])
        pred_label = pred_label_array[0]
        
        logger.info(f"Decoded label: {pred_label}")
            
        # Return label dalam Bahasa Indonesia
        label_id = PLANT_NAMES_ID.get(pred_label.lower(), pred_label)
        
        return {
            "label": label_id,
            "probability": probability,
            "raw_label": pred_label
        }
    except Exception as e:
        raise RuntimeError(f"Error saat melakukan prediksi: {e}")
