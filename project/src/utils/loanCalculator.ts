export const calculateEMI = (principal: number, annualRate: number, tenureMonths: number): number => {
  if (principal <= 0 || annualRate <= 0 || tenureMonths <= 0) return 0;
  
  const monthlyRate = annualRate / (12 * 100);
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / 
              (Math.pow(1 + monthlyRate, tenureMonths) - 1);
  
  return Math.round(emi * 100) / 100;
};

export const getLoanPurposes = () => [
  'Personal',
  'Car',
  'Home',
  'Education',
  'Business',
  'Medical'
];

export const getInterestRate = (purpose: string): number => {
  const rates: Record<string, number> = {
    'Personal': 12.5,
    'Car': 8.5,
    'Home': 7.5,
    'Education': 10.0,
    'Business': 15.0,
    'Medical': 11.0
  };
  return rates[purpose] || 12.0;
};