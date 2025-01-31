import React, { useState, useEffect } from "react";

const ViewUsers = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

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
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4 font-sans text-gray-800">
      <h1 className="text-3xl font-bold text-blue-600 text-center mb-6">Users List</h1>
      {error && <p className="text-red-500 text-center mb-4">Error: {error}</p>}
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
                <tr
                  key={index}
                  className="bg-gray-100 hover:bg-gray-200 transition-colors"
                >
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
  );
};

export default ViewUsers;
