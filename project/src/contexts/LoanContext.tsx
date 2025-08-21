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
}

interface LoanContextType {
  applications: LoanApplication[];
  addApplication: (application: Omit<LoanApplication, 'id' | 'status' | 'appliedDate'>) => void;
  updateApplicationStatus: (id: string, status: 'approved' | 'rejected', reason?: string) => void;
  getCustomerApplications: (customerId: string) => LoanApplication[];
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

  useEffect(() => {
    const savedApplications = localStorage.getItem('loanApplications');
    if (savedApplications) {
      setApplications(JSON.parse(savedApplications));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('loanApplications', JSON.stringify(applications));
  }, [applications]);

  const addApplication = (applicationData: Omit<LoanApplication, 'id' | 'status' | 'appliedDate'>) => {
    const newApplication: LoanApplication = {
      ...applicationData,
      id: Date.now().toString(),
      status: 'pending',
      appliedDate: new Date().toISOString()
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

  return (
    <LoanContext.Provider value={{
      applications,
      addApplication,
      updateApplicationStatus,
      getCustomerApplications
    }}>
      {children}
    </LoanContext.Provider>
  );
};