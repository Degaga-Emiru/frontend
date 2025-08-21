import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LoanProvider } from './contexts/LoanContext';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Landing from './pages/Landing';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import About from './pages/About';
import Contact from './pages/Contact';
import LoanProducts from './pages/LoanProducts';
import FAQ from './pages/FAQ';
import HowItWorks from './pages/HowItWorks';
import Register from './pages/auth/Register';
import Login from './pages/auth/Login';
import Profile from './pages/customer/Profile';

import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import LinkAccount from './pages/customer/LinkAccount';
import Dashboard from './pages/customer/Dashboard';
import LoanApplication from './pages/customer/LoanApplication';
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <LoanProvider>
        <Router>
          <Layout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/loan-products" element={<LoanProducts />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              

              {/* Customer Routes */}
              <Route
                path="/link-account"
                element={
                  <ProtectedRoute requiredRole="customer">
                    <LinkAccount />
                  </ProtectedRoute>
                }
              />
              <Route
         path="/profile"
               element={
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  }
        />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute requiredRole="customer">
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/apply-loan"
                element={
                  <ProtectedRoute requiredRole="customer" requireVerification>
                    <LoanApplication />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Layout>
        </Router>
      </LoanProvider>
    </AuthProvider>
  );
}

export default App;