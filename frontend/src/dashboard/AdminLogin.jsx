// 📁 Login.jsx (FINAL UPDATED VERSION)

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaUser } from "react-icons/fa";
import toast from 'react-hot-toast'; 

import { adminLogin } from '../services/adminAuthService';

const Login = () => {
  // ⭐️ FIX 1: State ko username se email mein change kar diya
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
        // ⭐️ FIX 2: adminLogin ko credentials.email pass kiya
        const user = await adminLogin(credentials.email, credentials.password);

        if (user) {
            // Note: Agar aapka user object mein username nahi hai, to yahan user.email use karein
            toast.success(`Login Successful! Welcome, ${user.name || 'Admin'}.`); 
            navigate('/admin/users');
        }

    } catch (err) {
        const msg = err.response?.data?.message || err.message || 'Login failed. Please try again.';
        setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-700 p-5">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md animate-slideUp">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">IELTS Online Test</h2>
          <p className="text-gray-600">Administrator Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {error && (
            <div className="bg-red-100 text-red-700 border border-red-200 p-3 rounded-md text-center text-sm">
              {error}
            </div>
          )}

          {/* Email Input (Username se Email kar diya) */}
          <div className="relative">
            <input
              type="email" // ⭐️ FIX 3: type ko email kar diya
              name="email" // ⭐️ FIX 4: name ko email kar diya
              placeholder="Admin Email"
              value={credentials.email}
              onChange={handleInputChange}
              required
              className="w-full pl-4 pr-10 py-3 rounded-xl border-2 border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 bg-gray-100 text-gray-700 transition"
            />
            <FaUser className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* Password Input */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={credentials.password}
              onChange={handleInputChange}
              required
              className="w-full pl-4 pr-10 py-3 rounded-xl border-2 border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 bg-gray-100 text-gray-700 transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-500 transition text-lg"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:-translate-y-1 transition disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-6 pt-4 border-t border-gray-200">
          <p className="text-gray-500 text-sm">Please use correct credentials.</p>
        </div>
      </div>

      {/* Slide-up animation */}
      <style>
        {`
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-slideUp {
            animation: slideUp 0.6s ease-out;
          }
        `}
      </style>
    </div>
  );
};

export default Login;