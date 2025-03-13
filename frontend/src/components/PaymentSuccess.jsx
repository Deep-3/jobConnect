import React from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

const PaymentSuccess = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg text-center">
        <div className="mb-6">
          <FaCheckCircle className="mx-auto text-[#0B877D] text-6xl" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-3">
          Payment Successful!
        </h1>
        
        <p className="text-gray-600 mb-6">
          Thank you for upgrading to Premium. Your payment has been processed successfully.
        </p>

        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h2 className="font-semibold text-gray-700 mb-2">Premium Benefits:</h2>
          <ul className="text-left text-gray-600 space-y-2">
            <li>✓ Access to all premium jobs</li>
            <li>✓ Priority application processing</li>
            <li>✓ Advanced profile features</li>
            <li>✓ Direct messaging with employers</li>
          </ul>
        </div>

        <div className="space-y-3">
          <Link 
            to="/dashboard" 
            className="block w-full py-3 px-4 bg-[#0B877D] hover:bg-[#0a7469] text-white rounded-lg transition-colors"
          >
            Go to Dashboard
          </Link>   
          
          <Link 
            to="/findjob" 
            className="block w-full py-3 px-4 border border-[#0B877D] text-[#0B877D] hover:bg-[#0B877D] hover:text-white rounded-lg transition-colors"
          >
            Browse Jobs
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;