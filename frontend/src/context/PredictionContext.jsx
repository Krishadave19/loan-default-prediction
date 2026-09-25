import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { runPrediction } from '../services/predictionService';
import {
  getLocalHistory,
  fetchHistory,
  savePredictionRecord,
  deleteHistoryRecord,
  clearHistory,
  SAMPLE_HISTORY_RECORDS,
  setLocalHistory,
} from '../services/historyService';

const PredictionContext = createContext(null);

export function PredictionProvider({ children }) {
  const [formData, setFormData] = useState({});
  const [result, setResult] = useState(null);
  const [latestRecord, setLatestRecord] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState(() => getLocalHistory());
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);

  const refreshHistory = useCallback(async () => {
    setIsHistoryLoading(true);
    try {
      const records = await fetchHistory();
      if (Array.isArray(records)) {
        setHistory(records);
      }
      return records;
    } catch (err) {
      console.warn('History refresh error:', err);
    } finally {
      setIsHistoryLoading(false);
    }
  }, []);

  // Sync history on mount
  useEffect(() => {
    let mounted = true;
    setIsHistoryLoading(true);
    fetchHistory()
      .then((records) => {
        if (mounted && Array.isArray(records)) {
          setHistory(records);
        }
      })
      .catch((err) => console.warn('History fetch error:', err))
      .finally(() => {
        if (mounted) setIsHistoryLoading(false);
      });

    const handleUpdate = () => {
      setHistory(getLocalHistory());
    };
    window.addEventListener('loanlens_history_updated', handleUpdate);
    return () => {
      mounted = false;
      window.removeEventListener('loanlens_history_updated', handleUpdate);
    };
  }, []);

  const updateForm = useCallback((fields) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  }, []);

  const submitPrediction = useCallback(
    async (payload) => {
      setIsLoading(true);
      setError(null);
      try {
        const fullInputs = { ...formData, ...payload };
        const data = await runPrediction(fullInputs);
        setResult(data);

        // Construct history record
        const applicantName =
          fullInputs.fullName?.trim() || `Applicant ${Math.floor(1000 + Math.random() * 9000)}`;

        const newRecord = {
          id: `PRED-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
          timestamp: new Date().toISOString(),
          applicant: {
            fullName: applicantName,
            Age: Number(fullInputs.Age ?? fullInputs.age ?? 45),
            Education: fullInputs.Education || fullInputs.education || "Bachelor's",
            EmploymentType: fullInputs.EmploymentType || fullInputs.employmentType || 'Full-time',
            MonthsEmployed: Number(fullInputs.MonthsEmployed ?? fullInputs.monthsEmployed ?? 80),
            MaritalStatus: fullInputs.MaritalStatus || fullInputs.maritalStatus || 'Single',
            HasDependents: fullInputs.HasDependents || fullInputs.hasDependents || 'No',
            Income: Number(fullInputs.Income ?? fullInputs.income ?? fullInputs.annualIncome ?? 85000),
            LoanAmount: Number(fullInputs.LoanAmount ?? fullInputs.loanAmount ?? 50000),
            LoanTerm: Number(fullInputs.LoanTerm ?? fullInputs.loanTerm ?? 36),
            InterestRate: Number(fullInputs.InterestRate ?? fullInputs.interestRate ?? 15.0),
            LoanPurpose: fullInputs.LoanPurpose || fullInputs.loanPurpose || 'Other',
            HasMortgage: fullInputs.HasMortgage || fullInputs.hasMortgage || 'No',
            CreditScore: Number(fullInputs.CreditScore ?? fullInputs.creditScore ?? 650),
            DTIRatio: Number(fullInputs.DTIRatio ?? fullInputs.dtiRatio ?? 0.35),
            NumCreditLines: Number(fullInputs.NumCreditLines ?? fullInputs.numCreditLines ?? 4),
            HasCoSigner: fullInputs.HasCoSigner || fullInputs.hasCoSigner || 'No',
          },
          result: {
            ...data,
            scoredAt: data.scoredAt || new Date().toISOString(),
          },
        };

        setLatestRecord(newRecord);
        const updatedList = await savePredictionRecord(newRecord);
        setHistory(updatedList);

        return { result: data, record: newRecord };
      } catch (err) {
        setError(err.message || 'Prediction failed');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [formData]
  );

  const removeRecord = useCallback(async (id) => {
    const updated = await deleteHistoryRecord(id);
    setHistory(updated);
  }, []);

  const clearHistoryRecords = useCallback(async () => {
    const updated = await clearHistory();
    setHistory(updated);
  }, []);

  const loadSampleHistory = useCallback(() => {
    setLocalHistory(SAMPLE_HISTORY_RECORDS);
    setHistory(SAMPLE_HISTORY_RECORDS);
    window.dispatchEvent(new CustomEvent('loanlens_history_updated'));
  }, []);

  const reset = useCallback(() => {
    setFormData({});
    setResult(null);
    setLatestRecord(null);
    setError(null);
  }, []);

  return (
    <PredictionContext.Provider
      value={{
        formData,
        updateForm,
        result,
        latestRecord,
        isLoading,
        error,
        submitPrediction,
        reset,
        history,
        isHistoryLoading,
        refreshHistory,
        removeRecord,
        clearHistoryRecords,
        loadSampleHistory,
      }}
    >
      {children}
    </PredictionContext.Provider>
  );
}

export function usePredictionContext() {
  const ctx = useContext(PredictionContext);
  if (!ctx) throw new Error('usePredictionContext must be used within a PredictionProvider');
  return ctx;
}
