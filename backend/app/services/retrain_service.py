import os
import joblib
import pandas as pd
from datetime import datetime
from sklearn.ensemble import RandomForestClassifier
from app.db.database import supabase

def retrain_model():
    res = supabase.table("ml_feedback").select("*").execute()
    if not res.data:
        raise ValueError("No feedback data available for retraining.")
        
    df = pd.DataFrame(res.data)
    
    features_cols = ["n", "p", "k", "temperature", "humidity", "ph", "rainfall"]
    for col in features_cols:
        if col not in df.columns:
            df[col] = 0.0
            
    if "actual_label" not in df.columns:
        raise ValueError("Target label 'actual_label' missing in ml_feedback data")

    X = df[features_cols]
    y = df["actual_label"]
    
    rf = RandomForestClassifier(n_estimators=100, random_state=42)
    rf.fit(X, y)
    
    accuracy = rf.score(X, y)
    
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    model_dir = os.path.join(base_dir, "models_ml")
    os.makedirs(model_dir, exist_ok=True)
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    model_name = f"model_rf_{timestamp}.pkl"
    model_path = os.path.join(model_dir, model_name)
    
    joblib.dump(rf, model_path)
    
    for f in os.listdir(model_dir):
        if f.endswith('.pkl') and f != model_name:
            os.remove(os.path.join(model_dir, f))
            
    return {
        "message": "Model retrained successfully",
        "accuracy": float(accuracy),
        "f1_score": float(accuracy) 
    }
