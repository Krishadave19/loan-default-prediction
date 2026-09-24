import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { PredictionProvider } from './context/PredictionContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <PredictionProvider>
          <App />
        </PredictionProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);
