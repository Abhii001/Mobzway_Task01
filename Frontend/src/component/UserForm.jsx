import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

const UserForm = () => {
  const navigate = useNavigate();

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

  const [isUserSaved, setIsUserSaved] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleTextOnlyInput = (e) => {
    const { value, name } = e.target;
    if (/[0-9]/.test(value)) {
      alert(`${name} field accepts text only. Please avoid entering numbers.`);
      e.target.value = value.replace(/[0-9]/g, "");
    }
    handleChange(e);
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
      const response = await fetch("https://mobzway-task01.onrender.com/saveUser", {
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
        setIsUserSaved(true);

        // Redirect to login page after successful registration
        navigate("/login");
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200">

      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 p-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-full shadow-lg transform transition-all hover:scale-110 hover:shadow-2xl focus:outline-none"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>


      <motion.div
        className="bg-white shadow-xl rounded-lg p-8 max-w-xl w-full"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          User Registration
        </h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="space-y-4"
        >
          {[
            { name: "firstName", placeholder: "First Name", type: "text", textOnly: true },
            { name: "lastName", placeholder: "Last Name", type: "text", textOnly: true },
            { name: "mobile", placeholder: "Mobile No", type: "number" },
            { name: "email", placeholder: "Email ID", type: "email" },
            { name: "street", placeholder: "Street", type: "text" },
            { name: "city", placeholder: "City", type: "text", textOnly: true },
            { name: "state", placeholder: "State", type: "text", textOnly: true },
            { name: "country", placeholder: "Country", type: "text", textOnly: true },
            { name: "loginId", placeholder: "Login ID", type: "text" },
            { name: "password", placeholder: "Password", type: "password" }
          ].map((field) => (
            <input
              key={field.name}
              type={field.type}
              name={field.name}
              placeholder={field.placeholder}
              value={formData[field.name]}
              onChange={field.textOnly ? handleTextOnlyInput : handleChange}
              required={["firstName", "lastName", "mobile", "email", "loginId", "password"].includes(field.name)}
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          ))}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-semibold py-3 px-6 rounded-md shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
          >
            Register User
          </button>

          <Link to="/login">
            <button
              type="button"
              className="w-full mt-4 bg-gradient-to-r from-gray-600 via-gray-700 to-gray-800 hover:from-gray-700 hover:to-gray-900 text-white font-semibold py-3 px-6 rounded-md shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
            >
              Already have an account? Login
            </button>
          </Link>
        </form>
      </motion.div>
    </div>
  );
};

export default UserForm;
