from typing import List, Literal

from pydantic import BaseModel, Field

from app.constants import CATEGORY_VALUES


class LoanApplication(BaseModel):
    """One loan applicant's data, matching the columns of Loan_default.csv
    (minus LoanID and the Default target, which is what we predict)."""

    Age: int = Field(..., ge=18, le=100, description="Applicant age in years")
    Income: float = Field(..., ge=0, description="Annual income")
    LoanAmount: float = Field(..., ge=0, description="Requested loan amount")
    CreditScore: int = Field(..., ge=300, le=850, description="Credit score")
    MonthsEmployed: int = Field(..., ge=0, description="Months at current employer")
    NumCreditLines: int = Field(..., ge=0, description="Number of open credit lines")
    InterestRate: float = Field(..., ge=0, description="Loan interest rate (%)")
    LoanTerm: int = Field(..., ge=0, description="Loan term in months")
    DTIRatio: float = Field(..., ge=0, description="Debt-to-income ratio")

    Education: Literal[tuple(CATEGORY_VALUES["Education"])]  # type: ignore
    EmploymentType: Literal[tuple(CATEGORY_VALUES["EmploymentType"])]  # type: ignore
    MaritalStatus: Literal[tuple(CATEGORY_VALUES["MaritalStatus"])]  # type: ignore
    HasMortgage: Literal[tuple(CATEGORY_VALUES["HasMortgage"])]  # type: ignore
    HasDependents: Literal[tuple(CATEGORY_VALUES["HasDependents"])]  # type: ignore
    LoanPurpose: Literal[tuple(CATEGORY_VALUES["LoanPurpose"])]  # type: ignore
    HasCoSigner: Literal[tuple(CATEGORY_VALUES["HasCoSigner"])]  # type: ignore

    model_config = {
        "json_schema_extra": {
            "example": {
                "Age": 45,
                "Income": 85994,
                "LoanAmount": 50587,
                "CreditScore": 520,
                "MonthsEmployed": 80,
                "NumCreditLines": 4,
                "InterestRate": 15.23,
                "LoanTerm": 36,
                "DTIRatio": 0.44,
                "Education": "Bachelor's",
                "EmploymentType": "Full-time",
                "MaritalStatus": "Divorced",
                "HasMortgage": "Yes",
                "HasDependents": "Yes",
                "LoanPurpose": "Other",
                "HasCoSigner": "Yes",
            }
        }
    }


class BatchLoanApplication(BaseModel):
    applications: List[LoanApplication]


class FeatureContribution(BaseModel):
    feature: str
    impact: float


class RiskLevelInfo(BaseModel):
    label: str
    color: str
    threshold: float


class PredictionResponse(BaseModel):
    default_prediction: int = Field(..., description="0 = will not default, 1 = will default")
    default_probability: float = Field(..., description="Predicted probability of default")
    risk_label: str = Field(..., description="Human-readable risk label")
    probability: float = Field(..., description="Alias for default_probability for frontend compatibility")
    riskLevel: RiskLevelInfo = Field(..., description="Color and threshold object for UI gauges")
    contributions: List[FeatureContribution] = Field(default_factory=list, description="Top feature drivers behind this prediction")
    scoredAt: str = Field(default="", description="ISO timestamp of scoring")


class BatchPredictionResponse(BaseModel):
    predictions: List[PredictionResponse]


class ModelInfoResponse(BaseModel):
    model_name: str
    features: List[str]
    metrics: dict


class DatasetRow(BaseModel):
    id: str
    creditScore: int
    annualIncome: float
    loanAmount: float
    term: int
    purpose: str
    defaulted: bool
    # Raw feature fields also included for detailed inspection
    Age: int
    Education: str
    EmploymentType: str
    MonthsEmployed: int
    NumCreditLines: int
    InterestRate: float
    DTIRatio: float
    MaritalStatus: str
    HasMortgage: str
    HasDependents: str
    HasCoSigner: str


class DatasetStatsResponse(BaseModel):
    totalRecords: int
    defaultRate: float
    avgCreditScore: float
    avgLoanAmount: float

