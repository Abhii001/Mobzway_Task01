import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserActionsButtons = () => {
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  const handleRegister = () => {
    setStatus('Redirecting to registration...');
    navigate('/Userform');
  };

  const handleLogin = () => {
    setStatus('Redirecting to login...');
    navigate('/login');
  };

  const handleViewUsers = () => {
    setStatus('Fetching users...');
    navigate('/viewUser');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-50 to-purple-100 p-8">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-2xl border border-gray-300 space-y-8">
        <h2 className="text-3xl font-semibold text-center text-gray-800">User Actions</h2>
        <div className="space-y-6">
          <button
            onClick={handleRegister}
            className="w-full py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg shadow-lg transform transition-transform hover:scale-105 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            New User Register
          </button>
          <button
            onClick={handleLogin}
            className="w-full py-3 px-6 bg-green-600 text-white font-semibold rounded-lg shadow-lg transform transition-transform hover:scale-105 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
          >
            Login
          </button>
          <button
            onClick={handleViewUsers}
            className="w-full py-3 px-6 bg-yellow-600 text-white font-semibold rounded-lg shadow-lg transform transition-transform hover:scale-105 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-300"
          >
            View All Users
          </button>
        </div>
        <p className="mt-6 text-lg font-medium text-gray-600 text-center">{status}</p>
      </div>
    </div>
  );
};

export default UserActionsButtons;
