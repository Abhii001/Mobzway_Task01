import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";

const socket = io("https://mobzway-task01.onrender.com", { autoConnect: false });

const Login = () => {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ loginId: "", password: "" });

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleLogin = async () => {
        try {
            console.log("Attempting to log in with:", credentials); // Debug input values

            const response = await fetch("https://mobzway-task01.onrender.com/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(credentials),
                credentials: "include",
            });

            console.log("Response Status:", response.status); // Debug HTTP response code

            const data = await response.json();
            console.log("Server Response:", data); // Debug response data

            if (response.ok) {
                localStorage.setItem("userId", data.userId);

                if (socket.connected) {
                    socket.disconnect();
                }

                socket.connect();
                socket.emit("authenticate", data.userId);

                alert("Login successful!");
                navigate("/liveUsers");
            } else {
                console.error("Login Failed:", data.error || "Unknown error");
                alert("Login failed! " + (data.error || "Unknown error"));
            }
        } catch (error) {
            console.error("Login Error:", error);
            alert("Error logging in! Check the console for details.");
        }
    };

    const handleSignUp = () => {
        navigate("/Userform");
    };

    const handleHome = () => {
        navigate("/");
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-purple-200">
            <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-xl relative">

                <button
                    onClick={handleHome}
                    className="absolute top-6 left-6 p-3 bg-blue-600 text-white font-semibold rounded-full transition-colors hover:bg-blue-700 focus:outline-none"
                >
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 9l9-7 9 7v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 22V12h6v10"
                        />
                    </svg>
                </button>

                <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-8">
                    Login
                </h2>

                <div className="space-y-4">
                    <input
                        type="text"
                        name="loginId"
                        onChange={handleChange}
                        placeholder="Login ID"
                        className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                    <input
                        type="password"
                        name="password"
                        onChange={handleChange}
                        placeholder="Password"
                        className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                </div>

                <button
                    onClick={handleLogin}
                    className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none mt-6"
                >
                    Login
                </button>

                <div className="mt-6 text-center">
                    <span className="text-gray-600 text-sm">
                        New User?{" "}
                        <button
                            onClick={handleSignUp}
                            className="text-blue-600 font-semibold hover:underline"
                        >
                            Sign Up
                        </button>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Login;
