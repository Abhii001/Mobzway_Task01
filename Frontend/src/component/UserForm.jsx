import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import io from "socket.io-client"; // Add socket.io-client import

const UserForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    email: "",
    street: "",
    city: "",
    state: "",
    country: "",
    loginId: "",
    password: "",
  });

  useEffect(() => {
    const socket = io("https://mobzway-task01.onrender.com");

    socket.on("connect", () => {
      console.log("Socket connected with ID:", socket.id);
    });

    return () => {
      socket.disconnect(); // Cleanup the socket connection
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleMobileInput = (e) => {
    const { value, name } = e.target;
    if (!/^\d+$/.test(value)) {
      alert(`${name} field accepts numbers only.`);
      e.target.value = value.replace(/\D/g, ""); // Remove non-numeric characters
    }
    handleChange(e);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for missing required fields
    const requiredFields = ["firstName", "lastName", "mobile", "email", "loginId", "password"];
    for (const field of requiredFields) {
      if (!formData[field]) {
        alert(`Please fill out the ${field} field.`);
        return;
      }
    }

    const socket = io("https://mobzway-task01.onrender.com");
    const socketId = socket.id;
    const userDataForSocket = {
      email: formData.email,
      name: `${formData.firstName} ${formData.lastName}`,
      socketId: socketId,
    };

    try {
      const response = await fetch("https://mobzway-task01.onrender.com/saveUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userDataForSocket),
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message);
        setFormData({
          firstName: "",
          lastName: "",
          mobile: "",
          email: "",
          street: "",
          city: "",
          state: "",
          country: "",
          loginId: "",
          password: "",
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200">
      <motion.div
        className="bg-white shadow-xl rounded-lg p-8 max-w-xl w-full"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">User Form</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[...]}  {/* Fields rendering, similar as before */}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 via-green-600 to-green-700 text-white font-semibold py-3 px-6 rounded-md shadow-lg"
          >
            Save
          </button>

          <Link to="/ViewUser">
            <button
              type="button"
              className="w-full mt-4 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white font-semibold py-3 px-6 rounded-md shadow-lg"
            >
              View Users
            </button>
          </Link>
        </form>
      </motion.div>
    </div>
  );
};

export default UserForm;
