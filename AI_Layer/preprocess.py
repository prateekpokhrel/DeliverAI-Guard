import pandas as pd
import numpy as np
from math import radians, sin, cos, sqrt, atan2

# =========================================================
# LOAD DATASET
# =========================================================

df = pd.read_csv("AI_Layer/amazon_delivery.csv")

print("Dataset Loaded Successfully!")
print(f"Total Rows Before Cleaning: {len(df)}")

# =========================================================
# REMOVE DUPLICATES
# =========================================================

df.drop_duplicates(inplace=True)

# =========================================================
# DROP ROWS WITH CRITICAL NULL VALUES
# =========================================================

critical_columns = [
    "Store_Latitude",
    "Store_Longitude",
    "Drop_Latitude",
    "Drop_Longitude",
    "Order_Time",
    "Pickup_Time",
    "Weather",
    "Traffic"
]

df.dropna(subset=critical_columns, inplace=True)

# =========================================================
# CLEAN STRING COLUMNS
# =========================================================

string_columns = ["Weather", "Traffic", "Vehicle", "Area", "Category"]

for col in string_columns:
    if col in df.columns:
        df[col] = df[col].astype(str).str.strip()

# =========================================================
# CONVERT TIME COLUMNS
# =========================================================

df["Order_Time"] = pd.to_datetime(
    df["Order_Time"],
    format='%H:%M:%S',
    errors='coerce'
)

df["Pickup_Time"] = pd.to_datetime(
    df["Pickup_Time"],
    format='%H:%M:%S',
    errors='coerce'
)

# Remove invalid time rows
df.dropna(subset=["Order_Time", "Pickup_Time"], inplace=True)

# =========================================================
# CREATE ORDER_HOUR
# =========================================================

df["Order_Hour"] = df["Order_Time"].dt.hour

# =========================================================
# CREATE RUSH_HOUR
# =========================================================

df["Rush_Hour"] = df["Order_Hour"].apply(
    lambda x: 1 if (8 <= x <= 10) or (17 <= x <= 20) else 0
)

# =========================================================
# CREATE PICKUP_DELAY_MINUTES
# =========================================================

df["Pickup_Delay_Minutes"] = (
    (df["Pickup_Time"] - df["Order_Time"]).dt.total_seconds() / 60
)

# Remove negative pickup delays
df = df[df["Pickup_Delay_Minutes"] >= 0]

# =========================================================
# CREATE DISTANCE_KM USING HAVERSINE FORMULA
# =========================================================

def haversine(lat1, lon1, lat2, lon2):

    R = 6371  # Earth radius in KM

    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)

    a = (
        sin(dlat / 2) ** 2
        + cos(radians(lat1))
        * cos(radians(lat2))
        * sin(dlon / 2) ** 2
    )

    c = 2 * atan2(sqrt(a), sqrt(1 - a))

    return R * c


df["Distance_km"] = df.apply(
    lambda row: haversine(
        row["Store_Latitude"],
        row["Store_Longitude"],
        row["Drop_Latitude"],
        row["Drop_Longitude"]
    ),
    axis=1
)

# =========================================================
# REMOVE UNREALISTIC DISTANCES
# =========================================================

df = df[df["Distance_km"] <= 50]

# =========================================================
# CREATE DELIVERY_RISK
# =========================================================

def generate_risk(row):

    # HIGH RISK
    if (
        row["Traffic"] in ["High", "Jam"] and
        (
            row["Distance_km"] > 8 or
            row["Pickup_Delay_Minutes"] > 20 or
            row["Weather"] in ["Stormy", "Fog", "Rainy", "Sandstorms"]
        )
    ):
        return "HIGH"

    # MEDIUM RISK
    elif (
        row["Traffic"] == "Medium" or
        row["Traffic"] == "High" or
        row["Distance_km"] > 5 or
        row["Pickup_Delay_Minutes"] > 10
    ):
        return "MEDIUM"

    # LOW RISK
    else:
        return "LOW"


df["Delivery_Risk"] = df.apply(generate_risk, axis=1)

# =========================================================
# REMOVE UNNECESSARY COLUMNS
# =========================================================

columns_to_drop = [
    "Order_ID",
    "Order_Date"
]

for col in columns_to_drop:
    if col in df.columns:
        df.drop(col, axis=1, inplace=True)

# =========================================================
# RESET INDEX
# =========================================================

df.reset_index(drop=True, inplace=True)

# =========================================================
# SAVE CLEAN DATASET
# =========================================================

output_path = "AI_Layer/amazon_delivery_processed.csv"

df.to_csv(output_path, index=False)

# =========================================================
# FINAL OUTPUT
# =========================================================

print("\nDataset Processing Completed Successfully!")
print(f"Total Rows After Cleaning: {len(df)}")

print("\nNew Features Added:")
print("""
1. Order_Hour
2. Rush_Hour
3. Pickup_Delay_Minutes
4. Distance_km
5. Delivery_Risk
""")

print(f"\nClean Processed Dataset Saved At:\n{output_path}")

print("\nSample Processed Data:\n")

print(df[[
    "Weather",
    "Traffic",
    "Distance_km",
    "Pickup_Delay_Minutes",
    "Rush_Hour",
    "Delivery_Risk"
]].head())