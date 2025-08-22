import React, { useState } from 'react';
import { X, CreditCard, Calendar, DollarSign, CheckCircle, XCircle, Loader } from 'lucide-react';
// Update the import path below if AuthContext is located elsewhere, for example:
import { useAuth } from '../contexts/AuthContext';
// If AuthContext does not exist, create it in src/contexts/AuthContext.tsx

interface RepaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  loan: loan;
    payment?: Payement;  // ✅ Add this line

}

const RepaymentModal: React.FC<RepaymentModalProps> = ({ isOpen, onClose, loan, payment }) => {
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [repaymentStatus, setRepaymentStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleRepayment = async () => {
    setIsProcessing(true);
    setRepaymentStatus('idle');
    setErrorMessage('');

    try {
      // Simulate API call for repayment processing
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate 90% success rate
          const isSuccess = Math.random() > 0.1;
          if (isSuccess) {
            resolve(true);
          } else {
            reject(new Error('Payment processing failed. Please try again.'));
          }
        }, 2000);
      });

      setRepaymentStatus('success');
      
      // Auto-close after success
      setTimeout(() => {
        onClose();
        setRepaymentStatus('idle');
      }, 3000);
    } catch (error: any) {
      setRepaymentStatus('error');
      setErrorMessage(error.message || 'Payment failed. Please try again.');
      setIsProcessing(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Make a Payment</h2>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Loan Summary */}
          <div className="bg-blue-50 rounded-lg p-4 mb-4">
            <h3 className="font-medium text-gray-900 mb-2">Loan Details</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-gray-600">Purpose:</span>
              <span className="font-medium">{loan.purpose}</span>
              
              <span className="text-gray-600">Amount:</span>
              <span className="font-medium">${loan.amount.toLocaleString()}</span>
              
              <span className="text-gray-600">EMI:</span>
              <span className="font-medium">${loan.emi.toLocaleString()}</span>
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-gray-900 mb-3 flex items-center">
              <CreditCard className="h-4 w-4 mr-2 text-blue-600" />
              Payment Information
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Account Number:</span>
                <span className="font-medium">
                  ****{user?.bankAccountNumber?.slice(-4) || 'XXXX'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Amount:</span>
                <span className="font-medium">${loan.emi.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Date:</span>
                <span className="font-medium">{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Payment Status */}
          {repaymentStatus === 'success' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                <div>
                  <h4 className="font-semibold text-green-900">Payment Successful!</h4>
                  <p className="text-sm text-green-700">Your payment has been processed successfully.</p>
                </div>
              </div>
            </div>
          )}

          {repaymentStatus === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-center">
                <XCircle className="h-5 w-5 text-red-600 mr-3" />
                <div>
                  <h4 className="font-semibold text-red-900">Payment Failed</h4>
                  <p className="text-sm text-red-700">{errorMessage}</p>
                </div>
              </div>
            </div>
          )}

          {/* Security Notice */}
          <div className="bg-blue-50 rounded-lg p-3 mb-6">
            <div className="flex items-start">
              <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-xs text-blue-700">
                Your payment is processed securely using bank-level encryption.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={handleRepayment}
              disabled={isProcessing || repaymentStatus === 'success'}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {isProcessing ? (
                <>
                  <Loader className="h-4 w-4 animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <DollarSign className="h-4 w-4 mr-2" />
                  Confirm Payment
                </>
              )}
            </button>
            
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepaymentModal;