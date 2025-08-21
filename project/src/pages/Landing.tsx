import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, DollarSign, Shield, Zap, Users } from 'lucide-react';

const Landing: React.FC = () => {
  const features = [
    {
      icon: <Zap className="h-6 w-6 text-blue-600" />,
      title: 'Fast Approval',
      description: 'Get approved in minutes with our streamlined process'
    },
    {
      icon: <Shield className="h-6 w-6 text-blue-600" />,
      title: 'Secure & Safe',
      description: 'Bank-level security to protect your financial information'
    },
    {
      icon: <DollarSign className="h-6 w-6 text-blue-600" />,
      title: 'Competitive Rates',
      description: 'Best-in-class interest rates starting from 7.5%'
    },
    {
      icon: <Users className="h-6 w-6 text-blue-600" />,
      title: '24/7 Support',
      description: 'Expert support team available round the clock'
    }
  ];

  const steps = [
    { number: '01', title: 'Sign Up', description: 'Create your account in under 2 minutes' },
    { number: '02', title: 'Verify Account', description: 'Link and verify your bank account securely' },
    { number: '03', title: 'Apply', description: 'Fill out your loan application' },
    { number: '04', title: 'Get Funded', description: 'Receive funds directly in your account' }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                Your Financial
                <span className="text-blue-200"> Dreams</span>
                <br />Made Reality
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                Get instant access to personal loans with competitive rates, transparent terms, 
                and lightning-fast approval. No hidden fees, no lengthy paperwork.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register"
                  className="bg-white text-blue-700 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-200 flex items-center justify-center space-x-2 group"
                >
                  <span>Apply Now</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/how-it-works"
                  className="border border-blue-300 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-600 transition-all duration-200"
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                <h3 className="text-2xl font-semibold mb-6">Loan Calculator</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Loan Amount</label>
                    <div className="bg-white/20 rounded-lg p-3 text-center text-2xl font-bold">
                      $25,000
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Monthly Payment</label>
                    <div className="bg-blue-500 rounded-lg p-3 text-center text-xl font-semibold">
                      $512/month
                    </div>
                  </div>
                  <div className="text-sm text-blue-200">
                    Interest Rate: 8.5% APR | Term: 5 years
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose LoanPro?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're revolutionizing the lending industry with technology-first approach and customer-centric solutions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 group"
              >
                <div className="bg-blue-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Get your loan in 4 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-8">
                Everything You Need in One Place
              </h2>
              
              <div className="space-y-4">
                {[
                  'Instant pre-qualification with no impact to credit score',
                  'Flexible repayment terms from 2-7 years',
                  'No prepayment penalties or hidden fees',
                  'Direct deposit to your bank account',
                  'Mobile-friendly application process'
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-blue-200 flex-shrink-0 mt-0.5" />
                    <span className="text-blue-100">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <h3 className="text-2xl font-semibold mb-6">Loan Options</h3>
              <div className="space-y-4">
                <div className="bg-white/20 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Personal Loans</span>
                    <span className="text-blue-200">12.5% APR</span>
                  </div>
                  <div className="text-sm text-blue-200">$1,000 - $50,000</div>
                </div>
                <div className="bg-white/20 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Auto Loans</span>
                    <span className="text-blue-200">8.5% APR</span>
                  </div>
                  <div className="text-sm text-blue-200">$5,000 - $100,000</div>
                </div>
                <div className="bg-white/20 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Home Loans</span>
                    <span className="text-blue-200">7.5% APR</span>
                  </div>
                  <div className="text-sm text-blue-200">$50,000 - $1,000,000</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of satisfied customers who trust LoanPro for their financial needs
          </p>
          <Link
            to="/register"
            className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all duration-200 inline-flex items-center space-x-2 group"
          >
            <span>Apply for Your Loan Today</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Landing;