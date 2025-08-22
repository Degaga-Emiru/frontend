import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, Download, FileText, Calendar, DollarSign, CreditCard, CheckCircle, Clock, AlertCircle,
  Printer, Receipt, TrendingDown, BarChart3
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLoan } from '../../contexts/LoanContext';
import PaymentModal from '../../components/RepaymentModal';

const RepaymentSchedule: React.FC = () => {
  const { loanId } = useParams<{ loanId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getLoanById, updateLoanPayment } = useLoan();
  
  const [loan, setLoan] = useState<any>(null);
  const [emiSchedule, setEmiSchedule] = useState<any[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('schedule');

  useEffect(() => {
    if (loanId && user) {
      const loanData = getLoanById(loanId, user.id);
      if (loanData) {
        setLoan(loanData);
        generateEmiSchedule(loanData);
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [loanId, user, getLoanById, navigate]);

  // Function to calculate EMI using standard formula
  const calculateEMI = (principal: number, rate: number, tenure: number) => {
    const monthlyRate = rate / 12 / 100;
    return principal * monthlyRate * Math.pow(1 + monthlyRate, tenure) / 
           (Math.pow(1 + monthlyRate, tenure) - 1);
  };

  // Generate EMI schedule
  const generateEmiSchedule = (loanData: any) => {
    const { amount, interestRate, duration, appliedDate } = loanData;
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

      // Simulate some payments for demo
      const status = i === 1 ? 'paid' : i === 2 ? 'overdue' : 'pending';
      const paymentDate = status === 'paid' ? 
        new Date(dueDate.getTime() - 5 * 24 * 60 * 60 * 1000) : null;

      schedule.push({
        month: i,
        dueDate: dueDate.toISOString(),
        paymentDate: paymentDate ? paymentDate.toISOString() : null,
        emi: Math.round(emi),
        principal: Math.round(principal),
        interest: Math.round(interest),
        balance: Math.max(0, Math.round(balance)),
        status
      });
    }

    setEmiSchedule(schedule);
  };

  const handlePayment = (payment: any) => {
    setSelectedPayment(payment);
    setIsPaymentModalOpen(true);
  };

  const handleFullPayment = () => {
    const fullPayment = {
      month: 'Full Payment',
      dueDate: new Date().toISOString(),
      emi: emiSchedule.reduce((sum, item) => sum + (item.status === 'pending' ? item.emi : 0), 0),
      principal: emiSchedule.reduce((sum, item) => sum + (item.status === 'pending' ? item.principal : 0), 0),
      interest: emiSchedule.reduce((sum, item) => sum + (item.status === 'pending' ? item.interest : 0), 0),
      balance: 0,
      status: 'pending'
    };
    setSelectedPayment(fullPayment);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    if (selectedPayment.month === 'Full Payment') {
      // Mark all pending payments as paid
      const updatedSchedule = emiSchedule.map(item => ({
        ...item,
        status: item.status === 'pending' ? 'paid' : item.status,
        paymentDate: item.status === 'pending' ? new Date().toISOString() : item.paymentDate
      }));
      setEmiSchedule(updatedSchedule);
    } else {
      // Mark specific payment as paid
      const updatedSchedule = emiSchedule.map(item => 
        item.month === selectedPayment.month 
          ? { ...item, status: 'paid', paymentDate: new Date().toISOString() }
          : item
      );
      setEmiSchedule(updatedSchedule);
      
      // Update loan balance
      if (loan) {
        updateLoanPayment(loan.id, selectedPayment.emi);
      }
    }
    
    setIsPaymentModalOpen(false);
    setSelectedPayment(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center w-fit"><CheckCircle className="h-3 w-3 mr-1" /> Paid</span>;
      case 'overdue':
        return <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full flex items-center w-fit"><AlertCircle className="h-3 w-3 mr-1" /> Overdue</span>;
      default:
        return <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full flex items-center w-fit"><Clock className="h-3 w-3 mr-1" /> Pending</span>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!loan) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading loan details...</p>
        </div>
      </div>
    );
  }

  const paidAmount = emiSchedule.filter(item => item.status === 'paid').reduce((sum, item) => sum + item.emi, 0);
  const remainingAmount = emiSchedule.filter(item => item.status !== 'paid').reduce((sum, item) => sum + item.emi, 0);
  const nextDue = emiSchedule.find(item => item.status === 'pending' || item.status === 'overdue');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Repayment Schedule</h1>
              <p className="text-gray-600 mt-1">Manage your loan payments and track your repayment progress</p>
            </div>
            <div className="flex space-x-2 mt-4 md:mt-0">
              <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
              <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                <Printer className="h-4 w-4 mr-2" />
                Print
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Loan Amount</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(loan.amount)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <TrendingDown className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Amount Paid</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(paidAmount)}</p>
                <p className="text-xs text-gray-500">{Math.round((paidAmount / loan.amount) * 100)}% paid</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-orange-100 p-3 rounded-lg">
                <FileText className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Remaining Balance</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(remainingAmount)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Next Due Date</p>
                <p className="text-2xl font-bold text-gray-900">
                  {nextDue ? formatDate(nextDue.dueDate) : 'N/A'}
                </p>
                <p className="text-xs text-gray-500">
                  {nextDue ? formatCurrency(nextDue.emi) : 'No pending payments'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Loan Details Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Loan Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-gray-600">Purpose</p>
              <p className="font-medium">{loan.purpose}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Monthly EMI</p>
              <p className="font-medium">{formatCurrency(loan.emi)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Interest Rate</p>
              <p className="font-medium">{loan.interestRate}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Tenure</p>
              <p className="font-medium">{loan.duration} months</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('schedule')}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === 'schedule'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <BarChart3 className="h-4 w-4" />
                <span>Payment Schedule</span>
              </button>
              <button
                onClick={() => setActiveTab('breakdown')}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === 'breakdown'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Receipt className="h-4 w-4" />
                <span>Payment History</span>
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'schedule' && (
              <>
                {/* Quick Actions */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <button
                    onClick={handleFullPayment}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <CreditCard className="h-5 w-5 mr-2" />
                    Pay Full Outstanding Amount
                  </button>
                </div>

                {/* EMI Schedule Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Month
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Due Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          EMI Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Principal
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Interest
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Balance
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {emiSchedule.map((payment) => (
                        <tr key={payment.month} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {payment.month}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDate(payment.dueDate)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(payment.emi)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(payment.principal)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(payment.interest)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(payment.balance)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(payment.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {payment.status !== 'paid' && (
                              <button
                                onClick={() => handlePayment(payment)}
                                className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 transition-colors"
                              >
                                Pay Now
                              </button>
                            )}
                            {payment.status === 'paid' && payment.paymentDate && (
                              <button className="text-blue-600 hover:text-blue-800 text-xs">
                                View Receipt
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {activeTab === 'breakdown' && (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Payment History</h3>
                <p className="text-gray-600">View your complete payment history and download receipts</p>
                <div className="mt-6">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    View All Payments
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Additional Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-yellow-600" />
              Important Notes
            </h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Payments may take 1-2 business days to reflect in your account</li>
              <li>• A late fee of 2% will be charged for payments overdue by more than 7 days</li>
              <li>• Early payments can reduce your total interest cost</li>
              <li>• Contact support if you need to modify your payment schedule</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
              Payment Methods
            </h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Automatic bank transfer (recommended)</li>
              <li>• Credit/Debit card (1.5% processing fee)</li>
              <li>• UPI/Net Banking</li>
              <li>• Wallet payments (Google Pay, PhonePe, etc.)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {selectedPayment && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          payment={selectedPayment}
          loan={loan}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default RepaymentSchedule;