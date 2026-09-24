"""
train_model.py
================
Reproduces the modeling steps from the original loan.ipynb notebook:

    1. Load Loan_default.csv
    2. Split into train / test (80/20, stratified on Default)
    3. Preprocess: StandardScaler on numeric features,
       OneHotEncoder on categorical features
    4. Train Logistic Regression, Decision Tree, Random Forest, KNN
    5. Compare them and pick Random Forest as the final model
       (this matches the notebook, where the tuned Random Forest
       was used as the final_model)
    6. Save the winning pipeline (preprocessing + model together)
       to model/loan_default_model.joblib so the FastAPI app can
       load it and serve predictions.

Run this once before starting the API:

    python train_model.py

It will re-create model/loan_default_model.joblib and
model/metrics.json (accuracy / precision / recall / f1 / roc-auc
for every model, so you can see why Random Forest was chosen).

NOTE ON HYPERPARAMETER TUNING
------------------------------
The notebook also runs a GridSearchCV over the Random Forest
(n_estimators, max_depth, min_samples_split). That grid search is
expensive (many model fits over 250k+ rows) so it is left here,
commented out, rather than run automatically every time you train.
Uncomment RUN_GRID_SEARCH = True below if you want to reproduce it.
"""

import json
import time
from pathlib import Path

import joblib
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    f1_score,
    precision_score,
    recall_score,
    roc_auc_score,
)
from sklearn.model_selection import GridSearchCV, train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.tree import DecisionTreeClassifier

from app.constants import CATEGORICAL_FEATURES, NUMERICAL_FEATURES, TARGET

BASE_DIR = Path(__file__).resolve().parent
DATA_PATH = BASE_DIR / "data" / "Loan_default.csv"
MODEL_DIR = BASE_DIR / "model"
MODEL_PATH = MODEL_DIR / "loan_default_model.joblib"
METRICS_PATH = MODEL_DIR / "metrics.json"

RANDOM_STATE = 42
RUN_GRID_SEARCH = False  # set True to reproduce the notebook's GridSearchCV (slow)


def build_preprocessor() -> ColumnTransformer:
    return ColumnTransformer(
        transformers=[
            ("num", StandardScaler(), NUMERICAL_FEATURES),
            (
                "cat",
                OneHotEncoder(handle_unknown="ignore", drop="first"),
                CATEGORICAL_FEATURES,
            ),
        ]
    )


def evaluate(name, model, X_test, y_test) -> dict:
    y_pred = model.predict(X_test)
    metrics = {
        "model": name,
        "accuracy": accuracy_score(y_test, y_pred),
        "precision": precision_score(y_test, y_pred, zero_division=0),
        "recall": recall_score(y_test, y_pred, zero_division=0),
        "f1_score": f1_score(y_test, y_pred, zero_division=0),
    }
    if hasattr(model, "predict_proba"):
        proba = model.predict_proba(X_test)[:, 1]
        metrics["roc_auc"] = roc_auc_score(y_test, proba)
    return metrics


def main():
    print(f"Loading dataset from {DATA_PATH} ...")
    df = pd.read_csv(DATA_PATH)

    X = df[NUMERICAL_FEATURES + CATEGORICAL_FEATURES]
    y = df[TARGET]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=RANDOM_STATE, stratify=y
    )
    print(f"Train shape: {X_train.shape}, Test shape: {X_test.shape}")

    preprocessor = build_preprocessor()

    candidates = {
        "Logistic Regression": LogisticRegression(max_iter=1000),
        "Decision Tree": DecisionTreeClassifier(random_state=RANDOM_STATE),
        # max_depth / min_samples_leaf are capped so the saved model stays a
        # reasonable size (an unconstrained forest on 250k rows can easily
        # exceed 500MB) without hurting accuracy - in testing this actually
        # scored a *higher* ROC-AUC than the unconstrained version.
        "Random Forest": RandomForestClassifier(
            n_estimators=200,
            max_depth=12,
            min_samples_leaf=20,
            random_state=RANDOM_STATE,
            n_jobs=-1,
        ),
        "KNN": KNeighborsClassifier(n_neighbors=5),
    }

    results = []
    fitted = {}

    for name, clf in candidates.items():
        print(f"Training {name} ...")
        t0 = time.time()
        pipe = Pipeline(steps=[("preprocessor", preprocessor), ("classifier", clf)])
        pipe.fit(X_train, y_train)
        fitted[name] = pipe
        metrics = evaluate(name, pipe, X_test, y_test)
        metrics["train_seconds"] = round(time.time() - t0, 2)
        results.append(metrics)
        print(f"  -> accuracy={metrics['accuracy']:.4f}  ({metrics['train_seconds']}s)")

    # Random Forest is the model the notebook settles on as final_model.
    final_name = "Random Forest"
    final_model = fitted[final_name]

    if RUN_GRID_SEARCH:
        print("Running GridSearchCV over Random Forest (this can take a while)...")
        param_grid = {
            "classifier__n_estimators": [100, 200],
            "classifier__max_depth": [None, 10, 20],
            "classifier__min_samples_split": [2, 5],
        }
        base_pipe = Pipeline(
            steps=[
                ("preprocessor", build_preprocessor()),
                (
                    "classifier",
                    RandomForestClassifier(random_state=RANDOM_STATE, n_jobs=-1),
                ),
            ]
        )
        grid_search = GridSearchCV(
            base_pipe, param_grid, cv=5, scoring="accuracy", n_jobs=-1
        )
        grid_search.fit(X_train, y_train)
        print("Best params:", grid_search.best_params_)
        final_model = grid_search.best_estimator_
        metrics = evaluate("Random Forest (tuned)", final_model, X_test, y_test)
        results.append(metrics)

    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    joblib.dump(final_model, MODEL_PATH)
    print(f"Saved final model ({final_name}) to {MODEL_PATH}")

    with open(METRICS_PATH, "w") as f:
        json.dump(
            {"final_model": final_name, "results": results},
            f,
            indent=2,
        )
    print(f"Saved metrics to {METRICS_PATH}")


if __name__ == "__main__":
    main()
