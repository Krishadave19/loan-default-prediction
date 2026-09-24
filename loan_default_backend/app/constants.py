"""
Shared constants describing the dataset schema.
Keeping this separate means train_model.py and the FastAPI app
always agree on feature names / categories.
"""

NUMERICAL_FEATURES = [
    "Age",
    "Income",
    "LoanAmount",
    "CreditScore",
    "MonthsEmployed",
    "NumCreditLines",
    "InterestRate",
    "LoanTerm",
    "DTIRatio",
]

CATEGORICAL_FEATURES = [
    "Education",
    "EmploymentType",
    "MaritalStatus",
    "HasMortgage",
    "HasDependents",
    "LoanPurpose",
    "HasCoSigner",
]

ALL_FEATURES = NUMERICAL_FEATURES + CATEGORICAL_FEATURES

TARGET = "Default"

# Allowed categorical values, taken from Loan_default.csv.
# Used both for input validation (schemas.py) and for documenting the API.
CATEGORY_VALUES = {
    "Education": ["Bachelor's", "Master's", "High School", "PhD"],
    "EmploymentType": ["Full-time", "Unemployed", "Self-employed", "Part-time"],
    "MaritalStatus": ["Divorced", "Married", "Single"],
    "HasMortgage": ["Yes", "No"],
    "HasDependents": ["Yes", "No"],
    "LoanPurpose": ["Other", "Auto", "Business", "Home", "Education"],
    "HasCoSigner": ["Yes", "No"],
}
