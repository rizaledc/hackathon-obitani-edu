import joblib
import pandas as pd
import numpy as np
import os

def run_model_test():
    MODEL_PATH = 'models/random_forest_model.pkl'
    SCALER_PATH = 'models/minmax_scaler.pkl'
    ENCODER_PATH = 'models/label_encoder.pkl'

    print("Loading Model Components")
    
    try:
        model = joblib.load(MODEL_PATH)
        scaler = joblib.load(SCALER_PATH)
        encoder = joblib.load(ENCODER_PATH)
        print("Success: Model, Scaler, and Encoder loaded!\n")
    except Exception as e:
        print(f"Error saat loading file: {e}")
        return

    test_data = {
        'N': 90,
        'P': 42,
        'K': 43,
        'temperature': 20.87,
        'humidity': 82.00,
        'ph': 6.50,
        'rainfall': 202.93
    }

    df_input = pd.DataFrame([test_data])

    input_scaled = scaler.transform(df_input)

    prediction_encoded = model.predict(input_scaled)

    prediction_label = encoder.inverse_transform(prediction_encoded)

    print("INFERENCE TEST RESULT")
    print(f"Input Data  : {list(test_data.values())}")
    print(f"Prediction  : {prediction_label[0].upper()}")

if __name__ == "__main__":
    run_model_test()