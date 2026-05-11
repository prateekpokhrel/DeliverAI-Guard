# ============================
# api.py
# ============================

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import pandas as pd
import joblib
import os
import shap
import numpy as np

# =========================================================
# CREATE FASTAPI APP
# =========================================================

app = FastAPI(
    title="DeliverAI Guard API",
    description="AI-Powered Delivery Failure Prevention System",
    version="3.0"
)

# =========================================================
# ENABLE CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================================================
# BASE DIRECTORY
# =========================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# =========================================================
# LOAD MODEL & EXPLAINER
# =========================================================

model_path = os.path.join(BASE_DIR, "delivery_risk_model.pkl")
model = joblib.load(model_path)
explainer = shap.TreeExplainer(model)

# =========================================================
# LOAD ENCODERS
# =========================================================

label_encoders_path = os.path.join(BASE_DIR, "label_encoders.pkl")
target_encoder_path = os.path.join(BASE_DIR, "target_encoder.pkl")

label_encoders = joblib.load(label_encoders_path)
target_encoder = joblib.load(target_encoder_path)

print("Model and Encoders Loaded Successfully!")

# =========================================================
# GLOBAL STORAGE
# =========================================================

latest_recommendations = []
latest_causes = []
latest_prediction = "MEDIUM"

# LIVE DELIVERY EVENTS
delivery_logs = []

# =========================================================
# HOME ROUTE
# =========================================================

@app.get("/")
def home():
    return {
        "message": "DeliverAI Guard API Running Successfully!"
    }

# =========================================================
# SMART RECOMMENDATION ENGINE
# =========================================================

def generate_feedback(data, risk_level):
    causes = []
    recommendations = []

    # TRAFFIC ANALYSIS
    if data["Traffic"] in ["High", "Jam"]:
        causes.append("Heavy traffic congestion detected")
        recommendations.append("Avoid rush-hour delivery window")
        recommendations.append("Use alternate delivery route")

    # WEATHER ANALYSIS
    if data["Weather"] in ["Stormy", "Fog", "Rainy"]:
        causes.append("Adverse weather conditions impacting delivery")
        recommendations.append("Delay delivery until weather improves")

    # DISTANCE ANALYSIS
    if float(data["Distance_km"]) > 8:
        causes.append("Long delivery distance increases risk")
        recommendations.append("Assign nearest available delivery agent")

    # PICKUP DELAY ANALYSIS
    if float(data["Pickup_Delay_Minutes"]) > 15:
        causes.append("High pickup delay detected")
        recommendations.append("Prioritize warehouse dispatch")
        recommendations.append("Notify customer about potential delay")

    # RUSH HOUR ANALYSIS
    if int(data["Rush_Hour"]) == 1:
        causes.append("Rush hour traffic may delay delivery")
        recommendations.append("Reschedule delivery after peak hours")

    # LOW RISK CASE
    if risk_level == "LOW":
        recommendations.append("Delivery conditions are stable")
        recommendations.append("Proceed with standard delivery workflow")

    # HIGH RISK CASE
    if risk_level == "HIGH":
        recommendations.append("Assign backup delivery partner")
        recommendations.append("Enable proactive customer communication")

    return causes, recommendations

# =========================================================
# PREDICTION ROUTE
# =========================================================

@app.post("/predict")
def predict(data: dict):
    global latest_recommendations
    global latest_causes
    global latest_prediction
    global delivery_logs

    try:
        # INPUT DATAFRAME
        input_df = pd.DataFrame([data])

        # CATEGORICAL COLUMNS
        categorical_columns = ["Weather", "Traffic", "Vehicle", "Area", "Category"]

        # ENCODE CATEGORICAL DATA
        for col in categorical_columns:
            input_df[col] = label_encoders[col].transform(input_df[col])

        # NUMERIC COLUMNS
        numeric_columns = [
            "Agent_Age", "Agent_Rating", "Distance_km",
            "Pickup_Delay_Minutes", "Rush_Hour", "Order_Hour"
        ]

        for col in numeric_columns:
            input_df[col] = pd.to_numeric(input_df[col])

        # FEATURE ORDER
        feature_order = [
            "Agent_Age", "Agent_Rating", "Weather", "Traffic", "Vehicle",
            "Area", "Category", "Distance_km", "Pickup_Delay_Minutes",
            "Rush_Hour", "Order_Hour"
        ]
        input_df = input_df[feature_order]

        # MODEL PREDICTION
        prediction = model.predict(input_df)
        predicted_class = int(prediction[0])

        # ==========================================
        # SHAP EXPLAINABILITY
        # ==========================================

        feature_importance = {}
        features = input_df.columns.tolist()

        try:
            shap_values = explainer.shap_values(
                input_df
            )

            # MULTI-CLASS SAFE HANDLING
            if isinstance(shap_values, list):
                values = np.abs(
                    shap_values[predicted_class][0]
                )
            else:
                values = np.abs(
                    shap_values[0]
                )

            for i, feature in enumerate(features):
                feature_importance[feature] = round(
                    float(values[i]),
                    4
                )

        except Exception as shap_error:
            print(
                "SHAP ERROR:",
                str(shap_error)
            )

            # FALLBACK VALUES
            for feature in features:
                feature_importance[feature] = 0.1

        # SORT TOP 4 FEATURES
        sorted_features = dict(
            sorted(
                feature_importance.items(),
                key=lambda item: item[1],
                reverse=True
            )[:4]
        )

        # DECODE PREDICTION
        predicted_risk = target_encoder.inverse_transform(prediction)
        result = str(predicted_risk[0])

        # GENERATE AI FEEDBACK
        causes, recommendations = generate_feedback(data, result)

        # STORE LATEST RESULTS
        latest_prediction = result
        latest_causes = causes
        latest_recommendations = recommendations

        # STORE LIVE DELIVERY EVENT
        delivery_logs.append({
            "Risk_Level": result,
            "Weather": data["Weather"],
            "Traffic": data["Traffic"],
            "Distance_km": data["Distance_km"],
            "Pickup_Delay_Minutes": data["Pickup_Delay_Minutes"],
            "Recommendations_Count": len(recommendations)
        })

        print("Prediction:", result)

        # FINAL RESPONSE
        return {
            "Predicted_Delivery_Risk": result,
            "Main_Causes": causes,
            "Recommendations": recommendations,
            "Explainability": sorted_features
        }

    except Exception as e:
        print("ERROR:", str(e))
        return {
            "Predicted_Delivery_Risk": "ERROR",
            "error": str(e)
        }

# =========================================================
# RECOMMENDATION ROUTE
# =========================================================

@app.get("/recommendations")
def get_recommendations():
    return {
        "Prediction": latest_prediction,
        "Main_Causes": latest_causes,
        "Recommendations": latest_recommendations
    }

# =========================================================
# LIVE DELIVERY MONITORING API
# =========================================================

@app.get("/monitoring")
def monitoring():
    total_deliveries = len(delivery_logs)

    high_risk = len([x for x in delivery_logs if x["Risk_Level"] == "HIGH"])
    medium_risk = len([x for x in delivery_logs if x["Risk_Level"] == "MEDIUM"])
    low_risk = len([x for x in delivery_logs if x["Risk_Level"] == "LOW"])

    return {
        "Total_Deliveries": total_deliveries,
        "High_Risk": high_risk,
        "Medium_Risk": medium_risk,
        "Low_Risk": low_risk,
        "Live_Events": delivery_logs[-10:]
    }