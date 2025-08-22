import React, { createContext, useContext, useState, useEffect } from 'react';

export interface LoanApplication {
  id: string;
  customerId: string;
  customerName: string;
  accountNumber: string;
  purpose: string;
  amount: number;
  duration: number;
  emi: number;
  interestRate: number;
  status: 'pending' | 'approved' | 'rejected';
  appliedDate: string;
  reason?: string;
  payments?: LoanPayment[];
}

export interface LoanPayment {
  id: string;
  loanId: string;
  amount: number;
  paymentDate: string;
  status: 'pending' | 'completed' | 'failed';
  emiMonth: number;
  principal: number;
  interest: number;
  remainingBalance: number;
}

interface LoanContextType {
  applications: LoanApplication[];
  payments: LoanPayment[];
  addApplication: (application: Omit<LoanApplication, 'id' | 'status' | 'appliedDate' | 'payments'>) => void;
  updateApplicationStatus: (id: string, status: 'approved' | 'rejected', reason?: string) => void;
  getCustomerApplications: (customerId: string) => LoanApplication[];
  getLoanById: (loanId: string, customerId: string) => LoanApplication | undefined;
  updateLoanPayment: (loanId: string, amount: number) => void;
  addPayment: (payment: Omit<LoanPayment, 'id'>) => void;
  getLoanPayments: (loanId: string) => LoanPayment[];
  calculateEMI: (principal: number, rate: number, tenure: number) => number;
  generateEmiSchedule: (loan: LoanApplication) => any[];
}

const LoanContext = createContext<LoanContextType | undefined>(undefined);

export const useLoan = () => {
  const context = useContext(LoanContext);
  if (context === undefined) {
    throw new Error('useLoan must be used within a LoanProvider');
  }
  return context;
};

export const LoanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [payments, setPayments] = useState<LoanPayment[]>([]);

  useEffect(() => {
    const savedApplications = localStorage.getItem('loanApplications');
    const savedPayments = localStorage.getItem('loanPayments');
    
    if (savedApplications) {
      setApplications(JSON.parse(savedApplications));
    }
    if (savedPayments) {
      setPayments(JSON.parse(savedPayments));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('loanApplications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('loanPayments', JSON.stringify(payments));
  }, [payments]);

  const calculateEMI = (principal: number, rate: number, tenure: number): number => {
    const monthlyRate = rate / 12 / 100;
    return principal * monthlyRate * Math.pow(1 + monthlyRate, tenure) / 
           (Math.pow(1 + monthlyRate, tenure) - 1);
  };

  const addApplication = (applicationData: Omit<LoanApplication, 'id' | 'status' | 'appliedDate' | 'payments'>) => {
    const emi = calculateEMI(applicationData.amount, applicationData.interestRate, applicationData.duration);
    
    const newApplication: LoanApplication = {
      ...applicationData,
      id: Date.now().toString(),
      status: 'pending',
      appliedDate: new Date().toISOString(),
      emi: Math.round(emi),
      payments: []
    };
    setApplications(prev => [...prev, newApplication]);
  };

  const updateApplicationStatus = (id: string, status: 'approved' | 'rejected', reason?: string) => {
    setApplications(prev =>
      prev.map(app =>
        app.id === id ? { ...app, status, reason } : app
      )
    );
  };

  const getCustomerApplications = (customerId: string) => {
    return applications.filter(app => app.customerId === customerId);
  };

  const getLoanById = (loanId: string, customerId: string) => {
    return applications.find(app => app.id === loanId && app.customerId === customerId);
  };

  const updateLoanPayment = (loanId: string, amount: number) => {
    setApplications(prev => prev.map(loan => 
      loan.id === loanId 
        ? { ...loan, amount: Math.max(0, loan.amount - amount) }
        : loan
    ));
  };

  const addPayment = (paymentData: Omit<LoanPayment, 'id'>) => {
    const newPayment: LoanPayment = {
      ...paymentData,
      id: Date.now().toString()
    };
    setPayments(prev => [...prev, newPayment]);
  };

  const getLoanPayments = (loanId: string) => {
    return payments.filter(payment => payment.loanId === loanId);
  };

  const generateEmiSchedule = (loan: LoanApplication): any[] => {
    const { amount, interestRate, duration, appliedDate } = loan;
    const emi = calculateEMI(amount, interestRate, duration);
    const monthlyRate = interestRate / 12 / 100;
    let balance = amount;
    const schedule = [];

    const startDate = new Date(appliedDate);
    
    for (let i = 1; i <= duration; i++) {
      const interest = balance * monthlyRate;
      const principal = emi - interest;
      balance -= principal;

      const dueDate = new Date(startDate);
      dueDate.setMonth(startDate.getMonth() + i);

      // Check if payment exists for this EMI
      const existingPayment = payments.find(p => p.loanId === loan.id && p.emiMonth === i);
      const status = existingPayment ? 'paid' : i === 1 ? 'overdue' : 'pending';
      const paymentDate = existingPayment ? existingPayment.paymentDate : null;

      schedule.push({
        month: i,
        dueDate: dueDate.toISOString(),
        paymentDate,
        emi: Math.round(emi),
        principal: Math.round(principal),
        interest: Math.round(interest),
        balance: Math.max(0, Math.round(balance)),
        status
      });
    }

    return schedule;
  };

  return (
    <LoanContext.Provider value={{
      applications,
      payments,
      addApplication,
      updateApplicationStatus,
      getCustomerApplications,
      getLoanById, // This should now work properly
      updateLoanPayment,
      addPayment,
      getLoanPayments,
      calculateEMI,
      generateEmiSchedule
    }}>
      {children}
    </LoanContext.Provider>
  );
};