import { api } from './api';

const SAMPLE_ROWS = Array.from({ length: 48 }).map((_, i) => {
  const creditScore = 580 + Math.round(Math.random() * 260);
  const income = 28000 + Math.round(Math.random() * 95000);
  const loanAmount = 4000 + Math.round(Math.random() * 48000);
  const defaulted = creditScore < 640 && Math.random() > 0.4;
  return {
    id: `LN-${88300 + i}`,
    creditScore,
    annualIncome: income,
    loanAmount,
    term: [12, 24, 36, 48, 60][Math.floor(Math.random() * 5)],
    purpose: ['Business', 'Auto', 'Education', 'Home', 'Other'][Math.floor(Math.random() * 5)],
    defaulted,
  };
});

export async function fetchDatasetRows({ search = '', filter = 'all' } = {}) {
  if (import.meta.env.VITE_USE_MOCK !== 'true') {
    try {
      const data = await api.get(
        `/dataset?search=${encodeURIComponent(search)}&filter=${filter}&limit=100`
      );
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    } catch (err) {
      console.warn('Backend /dataset unavailable, using sample records:', err.message);
    }
  }

  await new Promise((resolve) => setTimeout(resolve, 200));
  return SAMPLE_ROWS.filter((row) => {
    const matchesSearch = search
      ? row.id.toLowerCase().includes(search.toLowerCase()) ||
        row.purpose.toLowerCase().includes(search.toLowerCase())
      : true;
    const matchesFilter =
      filter === 'all' ? true : filter === 'defaulted' ? row.defaulted : !row.defaulted;
    return matchesSearch && matchesFilter;
  });
}

export async function fetchDatasetStats() {
  if (import.meta.env.VITE_USE_MOCK !== 'true') {
    try {
      const data = await api.get('/dataset/stats');
      if (data && data.totalRecords) {
        return data;
      }
    } catch (err) {
      console.warn('Backend /dataset/stats unavailable, using cached stats:', err.message);
    }
  }

  await new Promise((resolve) => setTimeout(resolve, 150));
  return {
    totalRecords: 255347,
    defaultRate: 0.1161,
    avgCreditScore: 575,
    avgLoanAmount: 127500,
  };
}
