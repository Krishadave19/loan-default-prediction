# Loan Default Prediction API

A FastAPI backend that serves the loan-default classification model from
`loan.ipynb`. It preprocesses applicant data (scaling + one-hot encoding),
runs it through a trained Random Forest pipeline, and returns a default
prediction, probability, and risk label.

A **pretrained model is already included** (`model/loan_default_model.joblib`),
so the API works immediately — you don't have to retrain before starting it.

## Project structure

```
loan_default_backend/
├── app/
│   ├── main.py         # FastAPI app + routes
│   ├── model.py         # loads the pipeline, runs predictions
│   ├── schemas.py       # request/response validation (Pydantic)
│   └── constants.py     # feature names & allowed category values
├── data/
│   └── Loan_default.csv # training data
├── model/
│   ├── loan_default_model.joblib  # trained sklearn Pipeline (pretrained, included)
│   └── metrics.json               # accuracy/precision/recall/f1/roc-auc per model
├── train_model.py       # retrains the model from data/Loan_default.csv
├── requirements.txt
├── Dockerfile
└── README.md
```

## 1. Setup

```bash
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

## 2. (Optional) Retrain the model

The repo ships with an already-trained model, so this step is optional.
Run it if you change the data or want to regenerate everything yourself:

```bash
python train_model.py
```

This reproduces the notebook's steps — train/test split, preprocessing,
training Logistic Regression / Decision Tree / Random Forest / KNN, and
saving the best one (Random Forest) to `model/loan_default_model.joblib`,
plus a `model/metrics.json` comparing all four models.

To also reproduce the notebook's `GridSearchCV` hyperparameter tuning
(slower), open `train_model.py` and set `RUN_GRID_SEARCH = True`.

## 3. Run the API

```bash
uvicorn app.main:app --reload
```

The API is now at `http://127.0.0.1:8000`.
Interactive docs (Swagger UI): `http://127.0.0.1:8000/docs`

## 4. Endpoints

| Method | Path              | Description                              |
|--------|-------------------|-------------------------------------------|
| GET    | `/`               | Basic health/info message                 |
| GET    | `/health`         | Health check, reports if model is loaded  |
| GET    | `/model-info`     | Model name, feature list, saved metrics   |
| POST   | `/predict`        | Predict default risk for one applicant    |
| POST   | `/predict/batch`  | Predict for a list of applicants          |

### Example: `POST /predict`

Request body:

```json
{
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
  "HasCoSigner": "Yes"
}
```

Response:

```json
{
  "default_prediction": 0,
  "default_probability": 0.1234,
  "risk_label": "Low Risk"
}
```

Allowed values for the categorical fields:

- `Education`: `Bachelor's`, `Master's`, `High School`, `PhD`
- `EmploymentType`: `Full-time`, `Unemployed`, `Self-employed`, `Part-time`
- `MaritalStatus`: `Divorced`, `Married`, `Single`
- `HasMortgage`, `HasDependents`, `HasCoSigner`: `Yes`, `No`
- `LoanPurpose`: `Other`, `Auto`, `Business`, `Home`, `Education`

### Example: `POST /predict/batch`

```json
{
  "applications": [
    { "Age": 45, "Income": 85994, "...": "..." },
    { "Age": 30, "Income": 42000, "...": "..." }
  ]
}
```

Returns `{"predictions": [ {...}, {...} ]}` in the same order.

### curl example

```bash
curl -X POST http://127.0.0.1:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "Age": 45, "Income": 85994, "LoanAmount": 50587, "CreditScore": 520,
    "MonthsEmployed": 80, "NumCreditLines": 4, "InterestRate": 15.23,
    "LoanTerm": 36, "DTIRatio": 0.44, "Education": "Bachelor'"'"'s",
    "EmploymentType": "Full-time", "MaritalStatus": "Divorced",
    "HasMortgage": "Yes", "HasDependents": "Yes", "LoanPurpose": "Other",
    "HasCoSigner": "Yes"
  }'
```

## 5. Run with Docker

```bash
docker build -t loan-default-api .
docker run -p 8000:8000 loan-default-api
```

## Notes

- `LoanID` is dropped — it's an identifier, not a predictive feature.
- Unknown/invalid categorical values are rejected with a `422` validation
  error (Pydantic `Literal` fields), so bad input never reaches the model.
- `risk_label` buckets are a simple convenience on top of the raw
  probability: Low (<0.25), Medium (<0.50), High (<0.75), Very High (≥0.75).
  Adjust `RISK_THRESHOLDS` in `app/model.py` if you want different cutoffs.
- CORS is wide open (`allow_origins=["*"]`) for easy local development —
  lock this down in `app/main.py` before deploying publicly.
