import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, User, LogOut, DollarSign, } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <DollarSign className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">LoanPro</span>
            </Link>
            
            {user && (
              <nav className="hidden md:flex ml-10 space-x-8">
                {user.role === 'customer' ? (
                  <>
                    <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 transition-colors">
                      Dashboard
                    </Link>
                    <Link to="/apply-loan" className="text-gray-700 hover:text-blue-600 transition-colors">
                      Apply Loan
                    </Link>
                    <Link to="/profile" className="text-gray-700 hover:text-blue-600 transition-colors">
                      Profile
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/admin/dashboard" className="text-gray-700 hover:text-blue-600 transition-colors">
                      Admin Dashboard
                    </Link>
                    <Link to="/profile" className="text-gray-700 hover:text-blue-600 transition-colors">
                      Profile
                    </Link>
                  </>
                )}
              </nav>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <Bell className="h-5 w-5" />
                </button>
                
                <div className="relative group">
                  <button className="flex items-center space-x-2 p-2 text-gray-700 hover:text-blue-600 transition-colors">
                    <User className="h-5 w-5" />
                    <span className="hidden md:block">{user.firstName}</span>
                  </button>
                  
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-2">
                      <div className="px-4 py-2 text-sm text-gray-500">
                        {user.firstName} {user.lastName}
                      </div>
                      <hr className="my-1" />
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;