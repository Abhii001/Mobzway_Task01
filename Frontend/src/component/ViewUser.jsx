import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ViewUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("https://mobzway-task01.onrender.com/Users");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col">
      <button
        onClick={() => navigate("/")}
        className="absolute top-10 left-6 flex items-center gap-2 px-4 py-2 bg-gray-800 text-white font-semibold rounded-full shadow-md hover:bg-gray-900 hover:scale-105 transition-all duration-300"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path>
        </svg>
        Back
      </button>

      <div className="max-w-6xl mx-auto p-4 font-sans text-gray-800 flex-grow">
        <h1 className="text-3xl font-bold text-blue-600 text-center mb-6">Users List</h1>

        {loading && (
          <p className="text-center text-blue-600">Loading users...</p>
        )}

        {error && !loading && (
          <p className="text-red-500 text-center mb-4">Error: {error}</p>
        )}

        {!loading && !error && users.length === 0 && (
          <p className="text-center text-gray-600">No users found</p>
        )}

        <div className="overflow-x-auto">
          <table className="w-full border-collapse shadow-md">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="px-4 py-2 text-left font-medium">Login ID</th>
                <th className="px-4 py-2 text-left font-medium">First Name</th>
                <th className="px-4 py-2 text-left font-medium">Last Name</th>
                <th className="px-4 py-2 text-left font-medium">Mobile</th>
                <th className="px-4 py-2 text-left font-medium">Email</th>
                <th className="px-4 py-2 text-left font-medium">Address</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user, index) => (
                  <tr key={index} className="bg-gray-100 hover:bg-gray-200 transition-colors">
                    <td className="px-4 py-2 border">{user.loginId}</td>
                    <td className="px-4 py-2 border">{user.firstName}</td>
                    <td className="px-4 py-2 border">{user.lastName}</td>
                    <td className="px-4 py-2 border">{user.mobile}</td>
                    <td className="px-4 py-2 border">{user.email}</td>
                    <td className="px-4 py-2 border">
                      {user.address
                        ? `${user.address.street}, ${user.address.city}, ${user.address.state}, ${user.address.country}`
                        : "No address available"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center p-4 text-gray-600">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewUsers;
