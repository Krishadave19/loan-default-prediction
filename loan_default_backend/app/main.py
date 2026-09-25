import json
import random
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import List, Optional
from fastapi import APIRouter, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd

from app.constants import ALL_FEATURES
from app.model import get_metrics, get_model
from app.schemas import (
    BatchLoanApplication,
    BatchPredictionResponse,
    DatasetRow,
    DatasetStatsResponse,
    LoanApplication,
    ModelInfoResponse,
    PredictionResponse,
)

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_PATH = BASE_DIR / "data" / "Loan_default.csv"
HISTORY_FILE = BASE_DIR / "data" / "prediction_history.json"


app = FastAPI(
    title="Loan Default Prediction API",
    description=(
        "Predicts whether a loan applicant is likely to default, "
        "based on the model trained in loan.ipynb."
    ),
    version="1.0.0",
)

# Allow any frontend to call this API during development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory cache for fast dataset browsing
_cached_dataset_rows: List[dict] = []
_dataset_stats: dict = {
    "totalRecords": 255347,
    "defaultRate": 0.1161,
    "avgCreditScore": 574.5,
    "avgLoanAmount": 127578.86,
}


def load_dataset_cache():
    global _cached_dataset_rows
    if _cached_dataset_rows or not DATA_PATH.exists():
        return
    try:
        # Load first 1500 rows for high-performance frontend browsing
        df = pd.read_csv(DATA_PATH, nrows=1500)
        rows = []
        for _, r in df.iterrows():
            rows.append(
                {
                    "id": str(r["LoanID"]),
                    "creditScore": int(r["CreditScore"]),
                    "annualIncome": float(r["Income"]),
                    "loanAmount": float(r["LoanAmount"]),
                    "term": int(r["LoanTerm"]),
                    "purpose": str(r["LoanPurpose"]),
                    "defaulted": bool(int(r["Default"]) == 1),
                    "Age": int(r["Age"]),
                    "Education": str(r["Education"]),
                    "EmploymentType": str(r["EmploymentType"]),
                    "MonthsEmployed": int(r["MonthsEmployed"]),
                    "NumCreditLines": int(r["NumCreditLines"]),
                    "InterestRate": float(r["InterestRate"]),
                    "DTIRatio": float(r["DTIRatio"]),
                    "MaritalStatus": str(r["MaritalStatus"]),
                    "HasMortgage": str(r["HasMortgage"]),
                    "HasDependents": str(r["HasDependents"]),
                    "HasCoSigner": str(r["HasCoSigner"]),
                }
            )
        _cached_dataset_rows = rows
    except Exception as e:
        print(f"WARNING: could not cache dataset sample: {e}")


@app.on_event("startup")
def on_startup():
    try:
        get_model()
    except FileNotFoundError as e:
        print(f"WARNING: {e}")
    load_dataset_cache()


# Router to support both /path and /api/path seamlessly
router = APIRouter()


@router.get("/", tags=["Health"])
def root():
    return {
        "message": "Loan Default Prediction API is running.",
        "docs": "/docs",
    }


@router.get("/health", tags=["Health"])
def health_check():
    try:
        get_model()
        model_loaded = True
    except FileNotFoundError:
        model_loaded = False
    return {"status": "ok", "model_loaded": model_loaded}


@router.get("/model-info", response_model=ModelInfoResponse, tags=["Model"])
def model_info():
    try:
        model = get_model()
    except FileNotFoundError as e:
        raise HTTPException(status_code=503, detail=str(e))

    return ModelInfoResponse(
        model_name=model.model_name,
        features=ALL_FEATURES,
        metrics=get_metrics(),
    )


# Default demo seed records if no history exists yet
DEFAULT_SAMPLE_HISTORY = [
    {
        "id": "PRED-K8M2-101",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "applicant": {
            "fullName": "Sarah Jenkins",
            "Age": 42,
            "Education": "Master's",
            "EmploymentType": "Full-time",
            "MonthsEmployed": 96,
            "MaritalStatus": "Married",
            "HasDependents": "Yes",
            "Income": 115000,
            "LoanAmount": 35000,
            "LoanTerm": 36,
            "InterestRate": 8.5,
            "LoanPurpose": "Home",
            "HasMortgage": "Yes",
            "CreditScore": 780,
            "DTIRatio": 0.22,
            "NumCreditLines": 5,
            "HasCoSigner": "Yes",
        },
        "result": {
            "default_prediction": 0,
            "default_probability": 0.084,
            "probability": 0.084,
            "risk_label": "Low Risk",
            "riskLevel": {"label": "Low Risk", "color": "#10B981", "threshold": 0.25},
            "contributions": [
                {"feature": "Credit score", "impact": -0.118},
                {"feature": "Debt-to-income ratio", "impact": -0.058},
                {"feature": "Loan-to-income ratio", "impact": -0.032},
                {"feature": "Months employed", "impact": -0.024},
            ],
            "scoredAt": datetime.now(timezone.utc).isoformat(),
        },
    },
    {
        "id": "PRED-V4X9-204",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "applicant": {
            "fullName": "Marcus Vance",
            "Age": 38,
            "Education": "Bachelor's",
            "EmploymentType": "Self-employed",
            "MonthsEmployed": 42,
            "MaritalStatus": "Divorced",
            "HasDependents": "Yes",
            "Income": 58000,
            "LoanAmount": 62000,
            "LoanTerm": 60,
            "InterestRate": 18.4,
            "LoanPurpose": "Business",
            "HasMortgage": "No",
            "CreditScore": 540,
            "DTIRatio": 0.48,
            "NumCreditLines": 7,
            "HasCoSigner": "No",
        },
        "result": {
            "default_prediction": 1,
            "default_probability": 0.725,
            "probability": 0.725,
            "risk_label": "High Risk",
            "riskLevel": {"label": "High Risk", "color": "#F97316", "threshold": 0.75},
            "contributions": [
                {"feature": "Credit score", "impact": 0.100},
                {"feature": "Debt-to-income ratio", "impact": 0.058},
                {"feature": "Interest rate", "impact": 0.080},
                {"feature": "Loan-to-income ratio", "impact": 0.085},
            ],
            "scoredAt": datetime.now(timezone.utc).isoformat(),
        },
    },
]


def _load_history() -> List[dict]:
    if not HISTORY_FILE.exists():
        _save_history(DEFAULT_SAMPLE_HISTORY)
        return list(DEFAULT_SAMPLE_HISTORY)
    try:
        with open(HISTORY_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
            if isinstance(data, list) and len(data) > 0:
                return data
            # Seed if file is empty
            _save_history(DEFAULT_SAMPLE_HISTORY)
            return list(DEFAULT_SAMPLE_HISTORY)
    except Exception as e:
        print(f"WARNING: could not load history: {e}")
        return list(DEFAULT_SAMPLE_HISTORY)


def _save_history(records: List[dict]):
    try:
        HISTORY_FILE.parent.mkdir(parents=True, exist_ok=True)
        with open(HISTORY_FILE, "w", encoding="utf-8") as f:
            json.dump(records, f, indent=2)
    except Exception as e:
        print(f"WARNING: could not save history: {e}")


def _prepend_history(record: dict):
    records = _load_history()
    rec_id = str(record.get("id", ""))
    if rec_id:
        records = [r for r in records if str(r.get("id", "")) != rec_id]
    records.insert(0, record)
    if len(records) > 500:
        records = records[:500]
    _save_history(records)


@router.post("/predict", response_model=PredictionResponse, tags=["Prediction"])
def predict(application: LoanApplication):
    try:
        model = get_model()
    except FileNotFoundError as e:
        raise HTTPException(status_code=503, detail=str(e))

    try:
        app_dict = application.model_dump()
        result = model.predict_one(app_dict)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Prediction failed: {e}")

    # Automatically save prediction into shared history so all users can see it
    try:
        pred_id = f"PRED-{int(time.time()*1000):X}-{random.randint(100, 999)}"
        record = {
            "id": pred_id,
            "timestamp": result.get("scoredAt") or datetime.now(timezone.utc).isoformat(),
            "applicant": {
                "fullName": f"Applicant #{random.randint(1000, 9999)}",
                **app_dict,
            },
            "result": result,
        }
        _prepend_history(record)
    except Exception as e:
        print(f"WARNING: failed to auto-record prediction to history: {e}")

    return PredictionResponse(**result)


@router.post("/predict/batch", response_model=BatchPredictionResponse, tags=["Prediction"])
def predict_batch(batch: BatchLoanApplication):
    if not batch.applications:
        raise HTTPException(status_code=400, detail="applications list is empty")

    try:
        model = get_model()
    except FileNotFoundError as e:
        raise HTTPException(status_code=503, detail=str(e))

    try:
        records = [app_.model_dump() for app_ in batch.applications]
        results = model.predict_many(records)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Prediction failed: {e}")

    # Auto-record batch predictions
    for app_dict, res in zip(records, results):
        try:
            pred_id = f"PRED-{int(time.time()*1000):X}-{random.randint(100, 999)}"
            rec = {
                "id": pred_id,
                "timestamp": res.get("scoredAt") or datetime.now(timezone.utc).isoformat(),
                "applicant": {
                    "fullName": f"Applicant #{random.randint(1000, 9999)}",
                    **app_dict,
                },
                "result": res,
            }
            _prepend_history(rec)
        except Exception:
            pass

    return BatchPredictionResponse(
        predictions=[PredictionResponse(**r) for r in results]
    )


@router.get("/dataset", response_model=List[DatasetRow], tags=["Dataset"])
def get_dataset(
    search: Optional[str] = Query(default="", description="Search by ID or Purpose"),
    filter: Optional[str] = Query(default="all", description="all, defaulted, or repaid"),
    limit: int = Query(default=100, ge=1, le=500),
    offset: int = Query(default=0, ge=0),
):
    load_dataset_cache()
    filtered = _cached_dataset_rows

    search_str = search if isinstance(search, str) else ""
    filter_str = filter if isinstance(filter, str) else "all"
    limit_num = limit if isinstance(limit, int) else 100
    offset_num = offset if isinstance(offset, int) else 0

    if filter_str == "defaulted":
        filtered = [r for r in filtered if r["defaulted"]]
    elif filter_str == "repaid":
        filtered = [r for r in filtered if not r["defaulted"]]

    if search_str:
        s = search_str.lower().strip()
        filtered = [
            r
            for r in filtered
            if s in r["id"].lower()
            or s in r["purpose"].lower()
            or s in r["EmploymentType"].lower()
            or s in r["Education"].lower()
        ]

    return filtered[offset_num : offset_num + limit_num]


@router.get("/dataset/stats", response_model=DatasetStatsResponse, tags=["Dataset"])
def get_dataset_stats():
    return DatasetStatsResponse(**_dataset_stats)


@router.get("/dataset/overview", tags=["Dataset"])
def get_dataset_overview():
    return {
        "totalRows": 255347,
        "totalFeatures": 18,
        "trainRows": 204277,
        "testRows": 51070,
        "testSize": 0.2,
        "randomState": 42,
        "missingValues": 0,
        "duplicateRows": 0,
        "targetDistribution": {
            "nonDefault": {"count": 225694, "percentage": 88.39},
            "default": {"count": 29653, "percentage": 11.61},
        },
        "numericalFeatures": [
            {"name": "Age", "description": "Age of borrower in years", "min": 18, "max": 69, "mean": 43.5},
            {"name": "Income", "description": "Annual verified income (USD)", "min": 15000, "max": 150000, "mean": 82500},
            {"name": "LoanAmount", "description": "Requested loan principal (USD)", "min": 5000, "max": 250000, "mean": 127500},
            {"name": "CreditScore", "description": "Bureau credit rating", "min": 300, "max": 850, "mean": 575},
            {"name": "MonthsEmployed", "description": "Months continuously employed", "min": 0, "max": 119, "mean": 59.5},
            {"name": "NumCreditLines", "description": "Active open credit facilities", "min": 1, "max": 4, "mean": 2.5},
            {"name": "InterestRate", "description": "Assigned APR interest rate (%)", "min": 2.0, "max": 25.0, "mean": 13.5},
            {"name": "LoanTerm", "description": "Repayment period in months", "min": 12, "max": 60, "mean": 36},
            {"name": "DTIRatio", "description": "Total debt-to-income ratio (0-1)", "min": 0.1, "max": 0.9, "mean": 0.5},
        ],
        "categoricalFeatures": [
            {"name": "Education", "values": ["Bachelor's", "Master's", "High School", "PhD"]},
            {"name": "EmploymentType", "values": ["Full-time", "Part-time", "Self-employed", "Unemployed"]},
            {"name": "MaritalStatus", "values": ["Married", "Single", "Divorced"]},
            {"name": "HasMortgage", "values": ["Yes", "No"]},
            {"name": "HasDependents", "values": ["Yes", "No"]},
            {"name": "LoanPurpose", "values": ["Auto", "Business", "Education", "Home", "Other"]},
            {"name": "HasCoSigner", "values": ["Yes", "No"]},
        ],
    }


@router.get("/history", tags=["History"])
def get_history(limit: int = Query(default=200, ge=1, le=1000)):
    records = _load_history()
    return records[:limit]


@router.post("/history", tags=["History"])
def add_history(record: dict):
    _prepend_history(record)
    return {"status": "success", "id": str(record.get("id", ""))}


@router.delete("/history/{record_id}", tags=["History"])
def delete_history_item(record_id: str):
    records = _load_history()
    new_records = [r for r in records if str(r.get("id")) != str(record_id)]
    _save_history(new_records)
    return {"status": "success", "deleted": record_id}


@router.delete("/history", tags=["History"])
def clear_history():
    _save_history([])
    return {"status": "success", "message": "History cleared"}


# Include router under both root and /api prefixes
app.include_router(router)
app.include_router(router, prefix="/api")

