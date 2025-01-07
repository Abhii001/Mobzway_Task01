import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const userData = {
      ...formData,
      address: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        country: formData.country,
      },
    };

    try {
      const response = await fetch("http://localhost:5100/saveUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
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
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          User Form
        </h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="space-y-4"
        >
          {[
            { name: "firstName", placeholder: "First Name", type: "text" },
            { name: "lastName", placeholder: "Last Name", type: "text" },
            { name: "mobile", placeholder: "Mobile No", type: "text" },
            { name: "email", placeholder: "Email ID", type: "email" },
            { name: "street", placeholder: "Street", type: "text" },
            { name: "city", placeholder: "City", type: "text" },
            { name: "state", placeholder: "State", type: "text" },
            { name: "country", placeholder: "Country", type: "text" },
            { name: "loginId", placeholder: "Login ID", type: "text" },
            { name: "password", placeholder: "Password", type: "password" },
          ].map((field) => (
            <input
              key={field.name}
              type={field.type}
              name={field.name}
              placeholder={field.placeholder}
              value={formData[field.name]}
              onChange={handleChange}
              required={["firstName", "lastName", "mobile", "email", "loginId", "password"].includes(
                field.name
              )}
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          ))}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-semibold py-3 px-6 rounded-md shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
          >
            Save
          </button>

          <Link to="/ViewUser">
            <button
              type="button"
              className="w-full mt-4 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-md shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
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
