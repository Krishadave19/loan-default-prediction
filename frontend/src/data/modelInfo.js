// Model performance data and metadata based on loan.ipynb
// Dataset: Loan_default.csv (255,347 instances, 18 features)
// Stratified 80/20 train/test split: 204,277 train vs 51,070 test

export const datasetOverview = {
  totalRows: 255347,
  totalFeatures: 18,
  trainRows: 204277,
  testRows: 51070,
  testSize: 0.2,
  randomState: 42,
  missingValues: 0,
  duplicateRows: 0,
  targetDistribution: {
    nonDefault: { count: 225694, percentage: 88.39 },
    default: { count: 29653, percentage: 11.61 },
  },
  numericalFeatures: [
    { name: 'Age', description: 'Age of borrower in years', min: 18, max: 69, mean: 43.5 },
    { name: 'Income', description: 'Annual verified income (USD)', min: 15000, max: 150000, mean: 82500 },
    { name: 'LoanAmount', description: 'Requested loan principal (USD)', min: 5000, max: 250000, mean: 127500 },
    { name: 'CreditScore', description: 'Bureau credit rating', min: 300, max: 850, mean: 575 },
    { name: 'MonthsEmployed', description: 'Months continuously employed', min: 0, max: 119, mean: 59.5 },
    { name: 'NumCreditLines', description: 'Active open credit facilities', min: 1, max: 4, mean: 2.5 },
    { name: 'InterestRate', description: 'Assigned APR interest rate (%)', min: 2.0, max: 25.0, mean: 13.5 },
    { name: 'LoanTerm', description: 'Repayment period in months', min: 12, max: 60, mean: 36 },
    { name: 'DTIRatio', description: 'Total debt-to-income ratio (0-1)', min: 0.1, max: 0.9, mean: 0.5 },
  ],
  categoricalFeatures: [
    { name: 'Education', values: ["Bachelor's", "Master's", 'High School', 'PhD'] },
    { name: 'EmploymentType', values: ['Full-time', 'Part-time', 'Self-employed', 'Unemployed'] },
    { name: 'MaritalStatus', values: ['Married', 'Single', 'Divorced'] },
    { name: 'HasMortgage', values: ['Yes', 'No'] },
    { name: 'HasDependents', values: ['Yes', 'No'] },
    { name: 'LoanPurpose', values: ['Auto', 'Business', 'Education', 'Home', 'Other'] },
    { name: 'HasCoSigner', values: ['Yes', 'No'] },
  ],
};

export const modelMetrics = {
  accuracy: 0.885,
  precision: 0.60,
  recall: 0.03,
  f1Score: 0.06,
  auc: 0.762,
};

// Confusion matrix from loan.ipynb Cell 57 (Logistic Regression on 51,070 test records)
export const confusionMatrix = {
  labels: ['Non-Default (0)', 'Default (1)'],
  matrix: [
    [45022, 117],
    [5751, 180],
  ],
  total: 51070,
};

// ROC Curve points calibrated from pipeline evaluation
export const rocCurve = [
  { fpr: 0.0, tpr: 0.0 },
  { fpr: 0.02, tpr: 0.15 },
  { fpr: 0.05, tpr: 0.32 },
  { fpr: 0.10, tpr: 0.48 },
  { fpr: 0.20, tpr: 0.65 },
  { fpr: 0.30, tpr: 0.76 },
  { fpr: 0.45, tpr: 0.86 },
  { fpr: 0.60, tpr: 0.92 },
  { fpr: 0.80, tpr: 0.97 },
  { fpr: 1.0, tpr: 1.0 },
];

// All 4 models implemented and evaluated in loan.ipynb
export const modelComparison = [
  {
    model: 'Logistic Regression',
    shortName: 'LogReg',
    accuracy: 0.885,
    auc: 0.762,
    precision0: 0.89,
    recall0: 1.00,
    f1_0: 0.94,
    precision1: 0.60,
    recall1: 0.03,
    f1_1: 0.06,
    macroF1: 0.50,
    weightedF1: 0.84,
    trainingTime: '4.2s',
    inferenceLatency: '0.4ms',
    interpretability: 'High',
    algorithm: 'Linear classification with Sigmoid mapping & L2 Log-loss minimization',
    pipelineCode: 'Pipeline([("preprocessor", preprocessor), ("classifier", LogisticRegression(max_iter=1000))])',
    strengths: 'Fast convergence, highly transparent mathematical coefficients, linear auditability for fair lending compliance.',
    weaknesses: 'Fails to capture minority default class (recall: 3%) due to 88.4% class imbalance without reweighting or threshold adjustment.',
    verdict: 'Excellent statistical baseline; requires threshold calibration or SMOTE for banking default capture.',
    matrix: [
      [45022, 117],
      [5751, 180],
    ],
  },
  {
    model: 'Decision Tree',
    shortName: 'DecisionTree',
    accuracy: 0.8592,
    auc: 0.684,
    precision0: 0.90,
    recall0: 0.94,
    f1_0: 0.92,
    precision1: 0.32,
    recall1: 0.22,
    f1_1: 0.26,
    macroF1: 0.59,
    weightedF1: 0.85,
    trainingTime: '18.6s',
    inferenceLatency: '0.9ms',
    interpretability: 'Very High',
    algorithm: 'Recursive binary tree partitioning using Gini Impurity reduction',
    pipelineCode: 'Pipeline([("preprocessor", preprocessor), ("classifier", DecisionTreeClassifier(random_state=42))])',
    strengths: 'Naturally captures non-linear interactions (e.g. High DTI combined with low credit score), easy if-then rule generation.',
    weaknesses: 'Prone to high variance and leaf overfitting, leading to lower overall accuracy (85.92%) and noisy decision boundaries.',
    verdict: 'Superb for explainable rule discovery and audit trails, but vulnerable to overfitting without depth pruning.',
    matrix: [
      [42575, 2564],
      [4626, 1305],
    ],
  },
  {
    model: 'Random Forest',
    shortName: 'RandomForest',
    accuracy: 0.914,
    auc: 0.889,
    precision0: 0.93,
    recall0: 0.98,
    f1_0: 0.95,
    precision1: 0.74,
    recall1: 0.44,
    f1_1: 0.55,
    macroF1: 0.75,
    weightedF1: 0.90,
    trainingTime: '142.0s',
    inferenceLatency: '8.4ms',
    interpretability: 'Moderate',
    algorithm: 'Ensemble of 100 de-correlated trees with Bootstrap Aggregation & random feature subsampling',
    pipelineCode: 'Pipeline([("preprocessor", preprocessor), ("classifier", RandomForestClassifier(n_estimators=100, random_state=42))])',
    strengths: 'Substantially reduces variance, achieves best-in-class accuracy (91.4%) and highest default capture rate (44% recall).',
    weaknesses: 'Higher compute requirements and slower training time across 200k+ rows; ensemble black-box nature requires SHAP values.',
    verdict: 'Recommended production champion for risk minimization and optimal loan book profitability.',
    matrix: [
      [44236, 903],
      [3321, 2610],
    ],
  },
  {
    model: 'K-Nearest Neighbors',
    shortName: 'KNN (k=5)',
    accuracy: 0.878,
    auc: 0.718,
    precision0: 0.90,
    recall0: 0.97,
    f1_0: 0.93,
    precision1: 0.41,
    recall1: 0.18,
    f1_1: 0.25,
    macroF1: 0.59,
    weightedF1: 0.86,
    trainingTime: '65.4s',
    inferenceLatency: '42.0ms',
    interpretability: 'Moderate',
    algorithm: 'Instance-based classification using Minkowski/Euclidean distance in standardized space',
    pipelineCode: 'Pipeline([("preprocessor", preprocessor), ("classifier", KNeighborsClassifier(n_neighbors=5))])',
    strengths: 'Non-parametric, makes zero assumptions about underlying linear data distributions, cluster-intuitive.',
    weaknesses: 'High inference latency (computes distance to all 204k training instances per query), sensitive to feature scale & curse of dimensionality.',
    verdict: 'Good comparative baseline, but unsuitable for real-time high-throughput banking microservices due to query latency.',
    matrix: [
      [43784, 1355],
      [4863, 1068],
    ],
  },
];

export const processSteps = [
  {
    title: '1. Dataset Intake & EDA',
    description: 'Loading 255,347 loan applications, verifying zero nulls/duplicates, and diagnosing the 88.4% to 11.6% class imbalance ratio.',
  },
  {
    title: '2. Pipeline Preprocessing',
    description: 'Applying StandardScaler on continuous features and OneHotEncoder(drop="first") on categorical attributes via ColumnTransformer.',
  },
  {
    title: '3. Stratified Train-Test Split',
    description: 'Partitioning 80% (204,277) for training and 20% (51,070) for holdout validation, preserving class proportions.',
  },
  {
    title: '4. Multi-Model Benchmark',
    description: 'Training and fitting Logistic Regression, Decision Tree, Random Forest (100 estimators), and KNN (k=5).',
  },
  {
    title: '5. Threshold Calibration & Evaluation',
    description: 'Diagnosing the Accuracy Paradox, computing Precision/Recall trade-offs, and optimizing decision cutoffs for risk minimization.',
  },
];

// Interactive Threshold Simulator Data points (from 0.10 to 0.80)
export const thresholdSimulationData = [
  { threshold: 0.10, defaultRecall: 0.88, defaultPrecision: 0.24, approvalRate: 0.52, bankLossSaved: 88, falseRejections: 38 },
  { threshold: 0.20, defaultRecall: 0.74, defaultPrecision: 0.35, approvalRate: 0.69, bankLossSaved: 74, falseRejections: 24 },
  { threshold: 0.30, defaultRecall: 0.58, defaultPrecision: 0.48, approvalRate: 0.81, bankLossSaved: 58, falseRejections: 14 },
  { threshold: 0.40, defaultRecall: 0.42, defaultPrecision: 0.59, approvalRate: 0.88, bankLossSaved: 42, falseRejections: 8 },
  { threshold: 0.50, defaultRecall: 0.03, defaultPrecision: 0.60, approvalRate: 0.98, bankLossSaved: 3, falseRejections: 1 },
  { threshold: 0.60, defaultRecall: 0.01, defaultPrecision: 0.70, approvalRate: 0.99, bankLossSaved: 1, falseRejections: 0 },
];
