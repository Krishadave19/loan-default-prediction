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


@router.post("/predict", response_model=PredictionResponse, tags=["Prediction"])
def predict(application: LoanApplication):
    try:
        model = get_model()
    except FileNotFoundError as e:
        raise HTTPException(status_code=503, detail=str(e))

    try:
        result = model.predict_one(application.model_dump())
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Prediction failed: {e}")

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


# Include router under both root and /api prefixes
app.include_router(router)
app.include_router(router, prefix="/api")
