import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from xgboost import XGBClassifier
import joblib

# =========================================================
# LOAD DATASET
# =========================================================

df = pd.read_csv("AI_Layer/amazon_delivery_processed.csv")

print("Dataset Loaded Successfully!")

# =========================================================
# REMOVE UNUSED COLUMNS
# =========================================================

columns_to_drop = [
    "Store_Latitude",
    "Store_Longitude",
    "Drop_Latitude",
    "Drop_Longitude",
    "Order_Time",
    "Pickup_Time"
]

df.drop(columns=columns_to_drop, inplace=True)

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

label_encoders = {}

for col in categorical_columns:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])
    label_encoders[col] = le

# =========================================================
# ENCODE TARGET VARIABLE
# =========================================================

target_encoder = LabelEncoder()

df["Delivery_Risk"] = target_encoder.fit_transform(df["Delivery_Risk"])

# =========================================================
# SPLIT FEATURES AND TARGET
# =========================================================

X = df.drop("Delivery_Risk", axis=1)

y = df["Delivery_Risk"]

# =========================================================
# TRAIN TEST SPLIT
# =========================================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

print("\nTraining Samples:", len(X_train))
print("Testing Samples:", len(X_test))

# =========================================================
# CREATE XGBOOST MODEL
# =========================================================

model = XGBClassifier(
    objective='multi:softmax',
    num_class=3,
    n_estimators=200,
    max_depth=8,
    learning_rate=0.1,
    subsample=0.8,
    colsample_bytree=0.8,
    random_state=42
)

# =========================================================
# TRAIN MODEL
# =========================================================

print("\nTraining Model...\n")

model.fit(X_train, y_train)

print("Model Training Completed!")

# =========================================================
# MAKE PREDICTIONS
# =========================================================

y_pred = model.predict(X_test)

# =========================================================
# EVALUATION
# =========================================================

accuracy = accuracy_score(y_test, y_pred)

print("\n==============================")
print("MODEL PERFORMANCE")
print("==============================")

print(f"\nAccuracy: {accuracy * 100:.2f}%")

print("\nClassification Report:\n")

print(classification_report(y_test, y_pred))

print("\nConfusion Matrix:\n")

print(confusion_matrix(y_test, y_pred))

# =========================================================
# SAVE MODEL
# =========================================================

joblib.dump(model, "AI_Layer/delivery_risk_model.pkl")
joblib.dump(label_encoders, "AI_Layer/label_encoders.pkl")

joblib.dump(target_encoder, "AI_Layer/target_encoder.pkl")

print("\nModel Saved Successfully!")
print("Saved as: delivery_risk_model.pkl")