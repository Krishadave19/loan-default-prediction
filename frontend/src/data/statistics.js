export const heroStatistics = [
  { label: 'Loans scored to date', value: 482_930, suffix: '' },
  { label: 'Model accuracy', value: 94.2, suffix: '%' },
  { label: 'Avg. scoring time', value: 180, suffix: 'ms' },
  { label: 'Default rate reduction', value: 27, suffix: '%' },
];

export const dashboardStats = [
  { label: 'Applications this month', value: 3_412, delta: 8.4, trend: 'up' },
  { label: 'Predicted defaults', value: 246, delta: -3.1, trend: 'down' },
  { label: 'Approval rate', value: 71.6, delta: 2.2, trend: 'up', suffix: '%' },
  { label: 'Avg. risk score', value: 0.34, delta: -0.5, trend: 'down', isProbability: true },
];

export const monthlyPredictionTrend = [
  { month: 'Jan', approved: 320, defaulted: 28 },
  { month: 'Feb', approved: 356, defaulted: 31 },
  { month: 'Mar', approved: 402, defaulted: 26 },
  { month: 'Apr', approved: 388, defaulted: 34 },
  { month: 'May', approved: 421, defaulted: 22 },
  { month: 'Jun', approved: 467, defaulted: 25 },
  { month: 'Jul', approved: 498, defaulted: 19 },
  { month: 'Aug', approved: 512, defaulted: 21 },
];

export const riskDistribution = [
  { name: 'Low', value: 62, color: '#10B981' },
  { name: 'Moderate', value: 27, color: '#F59E0B' },
  { name: 'High', value: 11, color: '#F43F5E' },
];

export const recentPredictions = [
  { id: 'LN-88213', name: 'A. Whitfield', amount: 24000, probability: 0.12, date: '2026-09-20' },
  { id: 'LN-88214', name: 'R. Okafor', amount: 8500, probability: 0.41, date: '2026-09-20' },
  { id: 'LN-88215', name: 'M. Laurent', amount: 51200, probability: 0.78, date: '2026-09-19' },
  { id: 'LN-88216', name: 'S. Nakamura', amount: 15600, probability: 0.22, date: '2026-09-19' },
  { id: 'LN-88217', name: 'J. Alvarez', amount: 32900, probability: 0.55, date: '2026-09-18' },
  { id: 'LN-88218', name: 'P. Kowalski', amount: 9800, probability: 0.09, date: '2026-09-18' },
];
