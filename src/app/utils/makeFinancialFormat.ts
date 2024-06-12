export const makeFinancialFormat = (value?: string | number | null) => (+(value || 0)).toFixed(2);
