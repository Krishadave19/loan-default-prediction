import { usePredictionContext } from '../context/PredictionContext';

// Thin convenience wrapper so components can `usePrediction()` without
// importing the context module directly.
export function usePrediction() {
  return usePredictionContext();
}
