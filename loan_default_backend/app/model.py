import json
from pathlib import Path
from functools import lru_cache

import joblib
import pandas as pd

from app.constants import ALL_FEATURES

BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_PATH = BASE_DIR / "model" / "loan_default_model.joblib"
METRICS_PATH = BASE_DIR / "model" / "metrics.json"

from datetime import datetime, timezone

RISK_TIERS = [
    (0.75, "Very High Risk", "#F43F5E", 1.0),
    (0.50, "High Risk", "#F97316", 0.75),
    (0.25, "Medium Risk", "#F59E0B", 0.50),
    (0.0, "Low Risk", "#10B981", 0.25),
]


def get_risk_info(probability: float) -> tuple[str, str, float]:
    for threshold, label, color, max_thresh in RISK_TIERS:
        if probability >= threshold:
            return label, color, max_thresh
    return "Low Risk", "#10B981", 0.25


def risk_label(probability: float) -> str:
    label, _, _ = get_risk_info(probability)
    return label


def compute_contributions(record: dict, probability: float) -> list[dict]:
    """Calculates directional feature attribution for applicant scoring."""
    credit_score = float(record.get("CreditScore", 650))
    dti = float(record.get("DTIRatio", 0.35))
    income = float(record.get("Income", 80000))
    loan_amount = float(record.get("LoanAmount", 50000))
    interest_rate = float(record.get("InterestRate", 13.5))
    months_employed = float(record.get("MonthsEmployed", 40))
    loan_term = float(record.get("LoanTerm", 36))
    emp_type = str(record.get("EmploymentType", "Full-time"))
    has_cosigner = str(record.get("HasCoSigner", "No"))
    has_mortgage = str(record.get("HasMortgage", "No"))

    lti = loan_amount / max(income, 1.0)

    # Positive impact = increases risk of default
    # Negative impact = decreases risk of default
    impacts = [
        {"feature": "Credit score", "impact": round(-(credit_score - 650) / 1100, 3)},
        {"feature": "Debt-to-income ratio", "impact": round((dti - 0.35) * 0.45, 3)},
        {"feature": "Interest rate", "impact": round((interest_rate - 12.0) / 75, 3)},
        {"feature": "Loan-to-income ratio", "impact": round((lti - 0.5) * 0.15, 3)},
        {"feature": "Months employed", "impact": round(-(months_employed - 48) / 400, 3)},
        {"feature": "Employment type", "impact": 0.12 if emp_type == "Unemployed" else (-0.05 if emp_type == "Full-time" else 0.03)},
        {"feature": "Co-signer status", "impact": -0.06 if has_cosigner == "Yes" else 0.04},
        {"feature": "Existing mortgage", "impact": 0.03 if has_mortgage == "Yes" else -0.02},
        {"feature": "Loan term duration", "impact": round((loan_term - 36) / 500, 3)},
    ]

    impacts.sort(key=lambda x: abs(x["impact"]), reverse=True)
    return impacts[:6]


class LoanDefaultModel:
    """Thin wrapper around the trained sklearn Pipeline (preprocessing +
    classifier) saved by train_model.py."""

    def __init__(self, model_path: Path = MODEL_PATH):
        if not model_path.exists():
            raise FileNotFoundError(
                f"Model file not found at {model_path}. "
                "Run `python train_model.py` first to train and save the model."
            )
        self.pipeline = joblib.load(model_path)
        self.model_name = type(self.pipeline.named_steps["classifier"]).__name__

    def _to_dataframe(self, records: list[dict]) -> pd.DataFrame:
        return pd.DataFrame.from_records(records)[ALL_FEATURES]

    def predict_one(self, record: dict) -> dict:
        return self.predict_many([record])[0]

    def predict_many(self, records: list[dict]) -> list[dict]:
        df = self._to_dataframe(records)
        preds = self.pipeline.predict(df)
        probs = self.pipeline.predict_proba(df)[:, 1]
        results = []
        now_iso = datetime.now(timezone.utc).isoformat()
        for record, pred, prob in zip(records, preds, probs):
            prob_float = float(round(prob, 4))
            label, color, threshold = get_risk_info(prob_float)
            contributions = compute_contributions(record, prob_float)
            results.append(
                {
                    "default_prediction": int(pred),
                    "default_probability": prob_float,
                    "risk_label": label,
                    "probability": prob_float,
                    "riskLevel": {
                        "label": label,
                        "color": color,
                        "threshold": threshold,
                    },
                    "contributions": contributions,
                    "scoredAt": now_iso,
                }
            )
        return results


@lru_cache(maxsize=1)
def get_model() -> LoanDefaultModel:
    """Cached so the model is loaded from disk only once per process."""
    return LoanDefaultModel()


def get_metrics() -> dict:
    if not METRICS_PATH.exists():
        return {}
    with open(METRICS_PATH) as f:
        return json.load(f)
