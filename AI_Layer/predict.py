import pandas as pd
import joblib

# =========================================================
# LOAD TRAINED MODEL
# =========================================================

model = joblib.load("AI_Layer/delivery_risk_model.pkl")

# =========================================================
# LOAD ENCODERS
# =========================================================

label_encoders = joblib.load("AI_Layer/label_encoders.pkl")

target_encoder = joblib.load("AI_Layer/target_encoder.pkl")

print("Model and Encoders Loaded Successfully!")

# =========================================================
# SAMPLE INPUT DATA
# =========================================================

sample_data = {
    "Agent_Age": 35,
    "Agent_Rating": 4.7,
    "Weather": "Sunny",
    "Traffic": "High",
    "Vehicle": "motorcycle",
    "Area": "Urban",
    "Category": "Clothing",
    "Distance_km": 8.5,
    "Pickup_Delay_Minutes": 18,
    "Rush_Hour": 1,
    "Order_Hour": 18
}

# =========================================================
# CONVERT TO DATAFRAME
# =========================================================

input_df = pd.DataFrame([sample_data])

# =========================================================
# ENCODE CATEGORICAL FEATURES
# =========================================================

categorical_columns = [
    "Weather",
    "Traffic",
    "Vehicle",
    "Area",
    "Category"
]

for col in categorical_columns:
    input_df[col] = label_encoders[col].transform(input_df[col])

# =========================================================
# MAKE PREDICTION
# =========================================================

prediction = model.predict(input_df)

# =========================================================
# DECODE PREDICTION
# =========================================================

predicted_risk = target_encoder.inverse_transform(prediction)

# =========================================================
# FINAL OUTPUT
# =========================================================

print("\n==============================")
print("DELIVERY RISK PREDICTION")
print("==============================")

print(f"\nPredicted Risk Level: {predicted_risk[0]}")