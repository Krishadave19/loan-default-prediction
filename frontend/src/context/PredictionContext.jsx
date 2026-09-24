import { createContext, useContext, useState, useCallback } from 'react';
import { runPrediction } from '../services/predictionService';

const PredictionContext = createContext(null);

export function PredictionProvider({ children }) {
  const [formData, setFormData] = useState({});
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateForm = useCallback((fields) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  }, []);

  const submitPrediction = useCallback(async (payload) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await runPrediction(payload ?? formData);
      setResult(data);
      return data;
    } catch (err) {
      setError(err.message || 'Prediction failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [formData]);

  const reset = useCallback(() => {
    setFormData({});
    setResult(null);
    setError(null);
  }, []);

  return (
    <PredictionContext.Provider
      value={{ formData, updateForm, result, isLoading, error, submitPrediction, reset }}
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
