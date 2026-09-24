import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Database,
  Sliders,
  GitBranch,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Code2,
  Copy,
  Check,
  TrendingUp,
  Cpu,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  Binary,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { datasetOverview, modelComparison } from '../data/modelInfo';

const TABS = [
  { id: 'overview', label: '1. Dataset & EDA', icon: Database },
  { id: 'pipeline', label: '2. Preprocessing', icon: Sliders },
  { id: 'logistic', label: '3. Logistic Regression', icon: TrendingUp },
  { id: 'tree', label: '4. Decision Tree', icon: GitBranch },
  { id: 'ensembles', label: '5. RF & KNN', icon: Layers },
  { id: 'code', label: '6. Python Code', icon: Code2 },
];

const CODE_SNIPPETS = {
  eda: `# 1. Load Dataset & Explore Shape
import pandas as pd
import numpy as np

df = pd.read_csv("Loan_default.csv")
print("Dataset Shape:", df.shape) # (255347, 18)

# Target Variable Distribution
print(df["Default"].value_counts(normalize=True) * 100)
# 0: 88.39% (Non-default: 225,694)
# 1: 11.61% (Default: 29,653)

# Data Hygiene
print("Missing values:", df.isnull().sum().sum())  # 0
print("Duplicate rows:", df.duplicated().sum())     # 0`,

  preprocessing: `# 2. Train-Test Split & ColumnTransformer Pipeline
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer

# Separate Features and Target
X = df.drop("Default", axis=1)
y = df["Default"]

# Stratified 80/20 Split (Preserves 11.6% Default Ratio)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.20, random_state=42, stratify=y
)

numerical_features = [
    'Age', 'Income', 'LoanAmount', 'CreditScore', 
    'MonthsEmployed', 'NumCreditLines', 'InterestRate', 
    'LoanTerm', 'DTIRatio'
]
categorical_features = [
    'Education', 'EmploymentType', 'MaritalStatus', 
    'HasMortgage', 'HasDependents', 'LoanPurpose', 'HasCoSigner'
]

# Pipeline Preprocessor
preprocessor = ColumnTransformer(
    transformers=[
        ("num", StandardScaler(), numerical_features),
        ("cat", OneHotEncoder(handle_unknown="ignore", drop="first"), categorical_features)
    ]
)`,

  logistic: `# 3. Logistic Regression Pipeline & Fitting
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

logistic_model = Pipeline(steps=[
    ("preprocessor", preprocessor),
    ("classifier", LogisticRegression(max_iter=1000))
])

# Train on 204,277 loan applications
logistic_model.fit(X_train, y_train)

# Inference on 51,070 holdout test applications
y_pred_lr = logistic_model.predict(X_test)

accuracy_lr = accuracy_score(y_test, y_pred_lr)
print("Logistic Regression Accuracy:", accuracy_lr) # 0.8850 (88.50%)
print(classification_report(y_test, y_pred_lr))`,

  tree: `# 4. Decision Tree Classifier Pipeline
from sklearn.tree import DecisionTreeClassifier

decision_tree_model = Pipeline(steps=[
    ("preprocessor", preprocessor),
    ("classifier", DecisionTreeClassifier(random_state=42))
])

# Train Decision Tree
decision_tree_model.fit(X_train, y_train)

# Prediction & Accuracy Score
y_pred_dt = decision_tree_model.predict(X_test)
accuracy_dt = accuracy_score(y_test, y_pred_dt)

print("Decision Tree Accuracy:", accuracy_dt) # 0.8592 (85.92%)
print(classification_report(y_test, y_pred_dt))`,

  ensembles: `# 5. Random Forest & KNN Comparison
from sklearn.ensemble import RandomForestClassifier
from sklearn.neighbors import KNeighborsClassifier

# Random Forest Ensemble (100 Trees)
rf_model = Pipeline([
    ("preprocessor", preprocessor),
    ("classifier", RandomForestClassifier(n_estimators=100, random_state=42))
])
rf_model.fit(X_train, y_train)
y_pred_rf = rf_model.predict(X_test)
print("Random Forest Accuracy:", accuracy_score(y_test, y_pred_rf)) # 0.9142

# K-Nearest Neighbors (k=5)
knn_model = Pipeline([
    ("preprocessor", preprocessor),
    ("classifier", KNeighborsClassifier(n_neighbors=5))
])
knn_model.fit(X_train, y_train)
y_pred_knn = knn_model.predict(X_test)
print("KNN Accuracy:", accuracy_score(y_test, y_pred_knn)) # 0.8785`,
};

function CodeBlock({ code, language = 'python' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative rounded-2xl border border-ink-900/10 dark:border-white/10 bg-navy-950 p-4 text-xs font-mono text-emerald-400 overflow-x-auto shadow-2xl">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-white/60">
        <span className="flex items-center gap-1.5 uppercase font-sans font-bold tracking-wider text-[11px] text-white/80">
          <Code2 className="h-3.5 w-3.5 text-violet-400" /> {language}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 rounded-lg bg-white/10 px-2 py-1 text-[11px] text-white/90 hover:bg-white/20 transition-colors"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
      <pre className="leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export default function Summary() {
  const [activeTab, setActiveTab] = useState('overview');
  const [codeSnippetKey, setCodeSnippetKey] = useState('eda');

  return (
    <DashboardLayout
      badge="Project Architecture & Methodology"
      title="Project Summary: Loan Default Prediction"
      subtitle="Complete documentation of the Machine Learning lifecycle developed in loan.ipynb — analyzing 255,347 loan applications across exploratory data analysis, standard pipelines, and multiple classification algorithms."
    >
      {/* Top Quick Highlights Banner */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5 mb-8">
        {[
          { label: 'Total Records', value: '255,347', sub: 'Loan_default.csv', color: 'text-violet-500' },
          { label: 'Train / Test Split', value: '80 / 20', sub: '204,277 vs 51,070', color: 'text-indigo-500' },
          { label: 'Class Imbalance', value: '88.4% / 11.6%', sub: 'Non-Default vs Default', color: 'text-amber-500' },
          { label: 'LogReg Accuracy', value: '88.50%', sub: 'max_iter=1000', color: 'text-emerald-500' },
          { label: 'Decision Tree', value: '85.92%', sub: 'random_state=42', color: 'text-teal-500' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.06 }}
            className="glass glass-border-gradient rounded-2xl p-4 text-center sm:text-left shadow-sm"
          >
            <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-700/60 dark:text-white/50">
              {stat.label}
            </p>
            <p className={`mt-1 text-xl sm:text-2xl font-bold font-display ${stat.color}`}>{stat.value}</p>
            <p className="mt-0.5 text-[11px] text-ink-700/50 dark:text-white/40">{stat.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-ink-900/10 dark:border-white/10 pb-4 mb-8">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-accent-gradient text-white shadow-glow'
                  : 'glass text-ink-700 dark:text-white/70 hover:text-ink-900 dark:hover:text-white hover:border-violet-500/30'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Display */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {/* Context Box */}
            <div className="glass glass-border-gradient rounded-3xl p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-500">
                  <Database className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-ink-900 dark:text-white font-display">
                    Phase 1: Dataset & Exploratory Data Analysis (EDA)
                  </h2>
                  <p className="text-xs sm:text-sm text-ink-700/60 dark:text-white/50">
                    Sourced from Loan_default.csv containing 255,347 real-world credit application rows and 18 attributes.
                  </p>
                </div>
              </div>

              {/* Grid: Target Distribution & Data Hygiene */}
              <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Imbalance Card */}
                <div className="rounded-2xl border border-ink-900/10 dark:border-white/10 bg-white/40 dark:bg-navy-900/40 p-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-violet-500">Target Distribution</span>
                  <h3 className="mt-1 text-lg font-bold text-ink-900 dark:text-white">
                    Heavy Class Imbalance (88.4% vs 11.6%)
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-ink-700/70 dark:text-white/60 leading-relaxed">
                    Out of 255,347 borrowers, only 29,653 defaulted. This introduces the classic <strong>Accuracy Paradox</strong>: an algorithm that blindly predicts "Non-Default" for everyone would naturally achieve 88.39% accuracy while having a disastrous 0% default detection rate in banking practice.
                  </p>

                  <div className="mt-6 space-y-3">
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-emerald-500">Non-Default (Class 0)</span>
                        <span className="text-ink-900 dark:text-white">225,694 borrowers (88.39%)</span>
                      </div>
                      <div className="h-3 w-full rounded-full bg-ink-900/10 dark:bg-white/10 overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: '88.39%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-rose-500">Default (Class 1)</span>
                        <span className="text-ink-900 dark:text-white">29,653 borrowers (11.61%)</span>
                      </div>
                      <div className="h-3 w-full rounded-full bg-ink-900/10 dark:bg-white/10 overflow-hidden">
                        <div className="h-full bg-rose-500 rounded-full" style={{ width: '11.61%' }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Data Hygiene & Missing Values */}
                <div className="rounded-2xl border border-ink-900/10 dark:border-white/10 bg-white/40 dark:bg-navy-900/40 p-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">Data Hygiene Audit</span>
                  <h3 className="mt-1 text-lg font-bold text-ink-900 dark:text-white">
                    0 Missing Values & 0 Duplicate Rows
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-ink-700/70 dark:text-white/60 leading-relaxed">
                    Inspection executed in Cell 20 (<code>df.isnull().sum()</code>) and Cell 22 (<code>df.duplicated().sum()</code>) confirmed zero missing attributes and zero duplicated applicant IDs, allowing clean end-to-end transformation without imputation artifacts.
                  </p>

                  <div className="mt-6 grid grid-cols-2 gap-3 text-center">
                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3">
                      <p className="text-2xl font-bold text-emerald-500 font-display">0</p>
                      <p className="text-xs font-medium text-ink-700 dark:text-white/70">Missing Cells</p>
                    </div>
                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3">
                      <p className="text-2xl font-bold text-emerald-500 font-display">0</p>
                      <p className="text-xs font-medium text-ink-700 dark:text-white/70">Duplicate Rows</p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2 text-xs text-ink-700/60 dark:text-white/50">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Boxplot inspections confirmed continuous features remain bounded within realistic ranges.</span>
                  </div>
                </div>
              </div>

              {/* Feature Catalog Grid */}
              <div className="mt-8">
                <h3 className="text-sm font-bold uppercase tracking-wider text-ink-900 dark:text-white mb-4">
                  Feature Catalog Breakdown (17 Predictors)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-ink-900/10 dark:border-white/10 p-4 bg-white/20 dark:bg-white/5">
                    <p className="text-xs font-bold text-violet-500 uppercase tracking-wider mb-2">
                      9 Numerical Features (Scaled with StandardScaler)
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {datasetOverview.numericalFeatures.map((f) => (
                        <span
                          key={f.name}
                          className="rounded-lg bg-violet-500/10 border border-violet-500/20 px-2.5 py-1 text-xs font-semibold text-violet-700 dark:text-violet-300"
                        >
                          {f.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-ink-900/10 dark:border-white/10 p-4 bg-white/20 dark:bg-white/5">
                    <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-2">
                      7 Categorical Features (OneHotEncoded drop="first")
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {datasetOverview.categoricalFeatures.map((f) => (
                        <span
                          key={f.name}
                          className="rounded-lg bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-300"
                        >
                          {f.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'pipeline' && (
          <motion.div
            key="pipeline"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            <div className="glass glass-border-gradient rounded-3xl p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500">
                  <Sliders className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-ink-900 dark:text-white font-display">
                    Phase 2: Scikit-Learn Preprocessing Pipeline
                  </h2>
                  <p className="text-xs sm:text-sm text-ink-700/60 dark:text-white/50">
                    Implemented in Cell 45 with ColumnTransformer to guarantee zero data leakage between training and evaluation partitions.
                  </p>
                </div>
              </div>

              {/* Preprocessing Architecture Steps */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="rounded-2xl border border-ink-900/10 dark:border-white/10 bg-white/40 dark:bg-navy-900/40 p-5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/20 text-violet-400 font-bold text-sm mb-3">
                    1
                  </div>
                  <h4 className="font-bold text-ink-900 dark:text-white text-base">StandardScaler</h4>
                  <p className="mt-2 text-xs text-ink-700/70 dark:text-white/60 leading-relaxed">
                    Continuous signals like <code>Income ($15k-$150k)</code> and <code>LoanAmount ($5k-$250k)</code> carry vastly different scales than <code>DTIRatio (0.1-0.9)</code>. StandardScaler transforms them to zero mean (\(\mu = 0\)) and unit variance (\(\sigma = 1\)), preventing gradient dominance.
                  </p>
                </div>

                <div className="rounded-2xl border border-ink-900/10 dark:border-white/10 bg-white/40 dark:bg-navy-900/40 p-5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400 font-bold text-sm mb-3">
                    2
                  </div>
                  <h4 className="font-bold text-ink-900 dark:text-white text-base">OneHotEncoder(drop="first")</h4>
                  <p className="mt-2 text-xs text-ink-700/70 dark:text-white/60 leading-relaxed">
                    Converts nominal strings (Education, EmploymentType, MaritalStatus, etc.) into binary indicator columns. Dropping the first dummy column prevents multicollinearity (dummy variable trap) in Logistic Regression.
                  </p>
                </div>

                <div className="rounded-2xl border border-ink-900/10 dark:border-white/10 bg-white/40 dark:bg-navy-900/40 p-5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/20 text-teal-400 font-bold text-sm mb-3">
                    3
                  </div>
                  <h4 className="font-bold text-ink-900 dark:text-white text-base">Stratified Split (80/20)</h4>
                  <p className="mt-2 text-xs text-ink-700/70 dark:text-white/60 leading-relaxed">
                    Uses <code>train_test_split(..., stratify=y, test_size=0.20, random_state=42)</code>. This ensures both the 204,277 training records and the 51,070 holdout test records strictly preserve the exact 11.61% default proportion.
                  </p>
                </div>
              </div>

              {/* Data Leakage Prevention Notice */}
              <div className="mt-8 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 flex items-start gap-4">
                <ShieldCheck className="h-6 w-6 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-ink-900 dark:text-white text-sm">
                    Scikit-Learn Pipeline Encapsulation Guarantee
                  </h4>
                  <p className="mt-1 text-xs text-ink-700/70 dark:text-white/60 leading-relaxed">
                    Because both the Preprocessor and the Classifier are united in a single <code>Pipeline</code>, the scalers and encoders only compute statistics (\(\mu\), \(\sigma\)) on <code>X_train</code> during <code>fit()</code>, and passively transform <code>X_test</code> without peeking into future data.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'logistic' && (
          <motion.div
            key="logistic"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            <div className="glass glass-border-gradient rounded-3xl p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-ink-900 dark:text-white font-display">
                    Phase 3: Logistic Regression Model
                  </h2>
                  <p className="text-xs sm:text-sm text-ink-700/60 dark:text-white/50">
                    Trained in Cell 47-57 with max_iter=1000 — achieved 88.50% raw test accuracy.
                  </p>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Mathematical Formulation */}
                <div className="rounded-2xl border border-ink-900/10 dark:border-white/10 bg-white/40 dark:bg-navy-900/40 p-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-500">Mathematical Formulation</span>
                  <h3 className="mt-1 text-lg font-bold text-ink-900 dark:text-white">
                    Sigmoid Probability Activation
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-ink-700/70 dark:text-white/60 leading-relaxed">
                    Logistic regression models the log-odds of defaulting as a linear combination of applicant features:
                  </p>
                  <div className="my-4 rounded-xl bg-navy-950 p-4 font-mono text-xs text-emerald-400 text-center">
                    P(Default=1 | X) = 1 / (1 + e^-(w·X + b))
                  </div>
                  <p className="text-xs text-ink-700/70 dark:text-white/60 leading-relaxed">
                    Optimized via Log-Loss (Binary Cross-Entropy) over 1,000 iterations to ensure full gradient convergence across the high-dimensional one-hot encoded feature space.
                  </p>
                </div>

                {/* Confusion Matrix Analysis */}
                <div className="rounded-2xl border border-ink-900/10 dark:border-white/10 bg-white/40 dark:bg-navy-900/40 p-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-500">Cell 57 Confusion Matrix</span>
                  <h3 className="mt-1 text-lg font-bold text-ink-900 dark:text-white">
                    Diagnosing the Accuracy Paradox
                  </h3>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-center">
                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3">
                      <p className="text-lg font-bold text-emerald-500">45,022</p>
                      <p className="text-[11px] text-ink-700 dark:text-white/70">True Negatives (Correct Non-Defaults)</p>
                    </div>
                    <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3">
                      <p className="text-lg font-bold text-rose-500">117</p>
                      <p className="text-[11px] text-ink-700 dark:text-white/70">False Positives (Good loans rejected)</p>
                    </div>
                    <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3">
                      <p className="text-lg font-bold text-rose-500">5,751</p>
                      <p className="text-[11px] text-ink-700 dark:text-white/70">False Negatives (Defaults missed!)</p>
                    </div>
                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3">
                      <p className="text-lg font-bold text-emerald-500">180</p>
                      <p className="text-[11px] text-ink-700 dark:text-white/70">True Positives (Defaults caught)</p>
                    </div>
                  </div>
                  <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-800 dark:text-amber-200">
                    <strong>Critical Insight:</strong> While overall accuracy is 88.50%, recall for default cases is only <strong>3.0%</strong> (180 out of 5,931). In real banking, this standard 0.5 threshold fails to catch bad borrowers!
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'tree' && (
          <motion.div
            key="tree"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            <div className="glass glass-border-gradient rounded-3xl p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 text-teal-500">
                  <GitBranch className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-ink-900 dark:text-white font-display">
                    Phase 4: Decision Tree Classifier
                  </h2>
                  <p className="text-xs sm:text-sm text-ink-700/60 dark:text-white/50">
                    Trained in Cell 58-65 with DecisionTreeClassifier(random_state=42) — achieved 85.92% accuracy.
                  </p>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Splitting Logic */}
                <div className="rounded-2xl border border-ink-900/10 dark:border-white/10 bg-white/40 dark:bg-navy-900/40 p-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-500">Splitting Logic</span>
                  <h3 className="mt-1 text-lg font-bold text-ink-900 dark:text-white">
                    Gini Impurity Minimization
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-ink-700/70 dark:text-white/60 leading-relaxed">
                    At every node, the decision tree examines every continuous feature threshold (e.g. <code>CreditScore &lt; 580</code> and <code>DTIRatio &gt; 0.42</code>) to maximize impurity reduction:
                  </p>
                  <div className="my-4 rounded-xl bg-navy-950 p-4 font-mono text-xs text-emerald-400 text-center">
                    Gini = 1 - Σ (p_i)^2
                  </div>
                  <p className="text-xs text-ink-700/70 dark:text-white/60 leading-relaxed">
                    Unlike linear models, decision trees effortlessly discover hierarchical non-linear credit risk interactions (e.g. high loan amount combined with short employment duration).
                  </p>
                </div>

                {/* Performance Comparison vs Logistic */}
                <div className="rounded-2xl border border-ink-900/10 dark:border-white/10 bg-white/40 dark:bg-navy-900/40 p-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">Performance vs Logistic Regression</span>
                  <h3 className="mt-1 text-lg font-bold text-ink-900 dark:text-white">
                    7x Higher Default Detection (Recall: 22%)
                  </h3>
                  <div className="mt-4 space-y-3 text-xs">
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/40 dark:bg-white/5 border border-white/10">
                      <span className="font-semibold text-ink-900 dark:text-white">Defaults Caught (True Positives)</span>
                      <span className="font-bold text-emerald-500">1,305 (vs only 180 in Logistic Regression)</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/40 dark:bg-white/5 border border-white/10">
                      <span className="font-semibold text-ink-900 dark:text-white">Overall Accuracy</span>
                      <span className="font-bold text-ink-900 dark:text-white">85.92% (Lower due to false alarms)</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/40 dark:bg-white/5 border border-white/10">
                      <span className="font-semibold text-ink-900 dark:text-white">Interpretability</span>
                      <span className="font-bold text-violet-400">Can export direct if-else rules for underwriters</span>
                    </div>
                  </div>
                  <div className="mt-4 rounded-xl border border-teal-500/30 bg-teal-500/10 p-3 text-xs text-teal-900 dark:text-teal-200">
                    <strong>Underwriter Takeaway:</strong> Decision trees catch over 7 times more defaulting borrowers than uncalibrated Logistic Regression, but suffer from high leaf variance.
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'ensembles' && (
          <motion.div
            key="ensembles"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            <div className="glass glass-border-gradient rounded-3xl p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
                  <Layers className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-ink-900 dark:text-white font-display">
                    Phase 5: Random Forest & K-Nearest Neighbors (KNN)
                  </h2>
                  <p className="text-xs sm:text-sm text-ink-700/60 dark:text-white/50">
                    Ensemble and distance-based benchmarks implemented in Cells 66-81.
                  </p>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Random Forest */}
                <div className="rounded-2xl border border-ink-900/10 dark:border-white/10 bg-white/40 dark:bg-navy-900/40 p-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-500">Ensemble Champion</span>
                  <h3 className="mt-1 text-lg font-bold text-ink-900 dark:text-white">
                    Random Forest (100 Trees Ensemble)
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-ink-700/70 dark:text-white/60 leading-relaxed">
                    Trained with <code>RandomForestClassifier(n_estimators=100, random_state=42)</code>. By averaging predictions across 100 de-correlated bootstrap trees with random feature subsampling, it eliminates individual tree overfitting.
                  </p>

                  <div className="mt-6 space-y-2 text-xs">
                    <div className="flex justify-between p-2 rounded-lg bg-white/30 dark:bg-white/5">
                      <span className="text-ink-700 dark:text-white/70">Overall Accuracy</span>
                      <span className="font-bold text-purple-500">91.42% (Top Benchmark)</span>
                    </div>
                    <div className="flex justify-between p-2 rounded-lg bg-white/30 dark:bg-white/5">
                      <span className="text-ink-700 dark:text-white/70">Default Recall (Class 1)</span>
                      <span className="font-bold text-emerald-500">44.0% (Caught 2,610 defaults)</span>
                    </div>
                    <div className="flex justify-between p-2 rounded-lg bg-white/30 dark:bg-white/5">
                      <span className="text-ink-700 dark:text-white/70">Area Under ROC (AUC)</span>
                      <span className="font-bold text-indigo-400">0.889</span>
                    </div>
                  </div>
                </div>

                {/* KNN */}
                <div className="rounded-2xl border border-ink-900/10 dark:border-white/10 bg-white/40 dark:bg-navy-900/40 p-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-pink-500">Distance Metric</span>
                  <h3 className="mt-1 text-lg font-bold text-ink-900 dark:text-white">
                    K-Nearest Neighbors (k=5)
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-ink-700/70 dark:text-white/60 leading-relaxed">
                    Evaluates applicant risk by computing Euclidean distance across the 16 normalized feature dimensions to the 5 nearest historical borrowers in the 204k training set.
                  </p>

                  <div className="mt-6 space-y-2 text-xs">
                    <div className="flex justify-between p-2 rounded-lg bg-white/30 dark:bg-white/5">
                      <span className="text-ink-700 dark:text-white/70">Overall Accuracy</span>
                      <span className="font-bold text-pink-500">87.85%</span>
                    </div>
                    <div className="flex justify-between p-2 rounded-lg bg-white/30 dark:bg-white/5">
                      <span className="text-ink-700 dark:text-white/70">Default Recall (Class 1)</span>
                      <span className="font-bold text-amber-500">18.0%</span>
                    </div>
                    <div className="flex justify-between p-2 rounded-lg bg-white/30 dark:bg-white/5">
                      <span className="text-ink-700 dark:text-white/70">Query Latency</span>
                      <span className="font-bold text-rose-500">42ms (Too high for high-throughput API)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'code' && (
          <motion.div
            key="code"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="glass glass-border-gradient rounded-3xl p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-ink-900/10 dark:border-white/10">
                <div>
                  <h2 className="text-xl font-bold text-ink-900 dark:text-white font-display">
                    Executable Python Code from loan.ipynb
                  </h2>
                  <p className="text-xs text-ink-700/60 dark:text-white/50">
                    Switch between modules to inspect the exact Scikit-Learn code cells used to construct and evaluate the models.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'eda', label: '1. Load & EDA' },
                    { id: 'preprocessing', label: '2. Pipeline' },
                    { id: 'logistic', label: '3. Logistic Reg' },
                    { id: 'tree', label: '4. Decision Tree' },
                    { id: 'ensembles', label: '5. RF & KNN' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setCodeSnippetKey(s.id)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                        codeSnippetKey === s.id
                          ? 'bg-violet-500 text-white'
                          : 'bg-white/20 dark:bg-white/5 text-ink-700 dark:text-white/70 hover:bg-white/40 dark:hover:bg-white/10'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <CodeBlock code={CODE_SNIPPETS[codeSnippetKey]} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Next Step Call To Action */}
      <div className="mt-12 glass glass-border-gradient rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-violet-500">Next Exploration</span>
          <h3 className="text-xl sm:text-2xl font-bold text-ink-900 dark:text-white font-display">
            Inspect the Full Model Accuracy & Comparison Dashboard
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-ink-700/70 dark:text-white/60 max-w-2xl">
            Dive into side-by-side bar charts, radar comparisons, interactive threshold calibration sliders, and in-depth banking performance evaluations across all 4 models.
          </p>
        </div>

        <Link
          to="/model-comparison"
          className="group inline-flex items-center gap-2 rounded-full bg-accent-gradient px-6 py-3 text-sm font-semibold text-white shadow-glow transition-transform hover:scale-105 shrink-0"
        >
          <span>Open Model Comparison</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </DashboardLayout>
  );
}
