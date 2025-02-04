import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import Modal from "./Modal";
import { useNavigate } from 'react-router-dom';

const socketUrl = "https://mobzway-task01.onrender.com";

const LiveUsers = () => {
    const [users, setUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const userId = localStorage.getItem("userId");
    const socketRef = useRef(null);

    useEffect(() => {
        if (!userId) return;

        // Connect the user only if logged in
        socketRef.current = io(socketUrl, { autoConnect: false });

        socketRef.current.connect();

        // Authenticate user with backend
        socketRef.current.emit("authenticate", userId);

        socketRef.current.on("allUsers", (users) => {
            console.log("Received Live Users List:", users);
            setUsers(users);
            setIsLoading(false);
        });

        socketRef.current.on("userDisconnected", (socketId) => {
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.socketId === socketId ? { ...user, socketId: null } : user
                )
            );
        });

        socketRef.current.on("connect_error", () => {
            console.log("Connection Error");
            setError("Failed to connect to server");
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [userId]);

    const fetchUserInfo = async (userId) => {
        try {
            setIsLoading(true);
            const response = await fetch(`${socketUrl}/getUserDetails/${userId}`);
            if (!response.ok) throw new Error("User not found");
            const data = await response.json();
            setUserInfo(data);
            setIsModalOpen(true);
        } catch (err) {
            setError("Failed to find user.");
        } finally {
            setIsLoading(false);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setUserInfo(null);
    };

    const handleLoginRedirect = () => {
        navigate('/viewUser');
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            {!userId ? (
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-gray-600 mb-4">
                        No user is logged in.
                    </h2>
                    <button
                        onClick={handleLoginRedirect}
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Go to Login Page
                    </button>
                </div>
            ) : (
                <>
                    <h1 className="text-center text-3xl font-extrabold text-gray-800 border-b pb-4 mb-6">
                        Live Users
                    </h1>

                    {error && (
                        <div className="bg-red-100 text-red-600 p-4 rounded mb-4 flex justify-between items-center">
                            <p>{error}</p>
                            <button className="text-red-600 font-bold" onClick={() => setError(null)}>
                                &times;
                            </button>
                        </div>
                    )}

                    {isLoading ? (
                        <div className="flex justify-center items-center min-h-[200px]">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
                        </div>
                    ) : users.length > 0 ? (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {users.map((user) => (
                                <div
                                    key={user._id}
                                    className={`p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer ${!user.socketId ? "opacity-50 cursor-not-allowed" : ""
                                        }`}
                                    onClick={() => fetchUserInfo(user._id)}
                                >
                                    <div className="mb-4 flex items-center space-x-2">
                                        <div
                                            className={`w-3 h-3 rounded-full ${user.socketId ? "bg-green-500" : "bg-red-400"
                                                }`}
                                        ></div>
                                        <span
                                            className={`${user.socketId ? "text-green-500" : "text-gray-400"
                                                } text-sm font-medium`}
                                        >
                                            {user.socketId ? "Online" : "Offline"}
                                        </span>
                                    </div>

                                    <div>
                                        <h3 className="text-gray-800 font-semibold text-lg">
                                            {user.firstName || "Unknown"} {user.lastName || "User"}
                                        </h3>
                                        <p className="text-gray-500">{user.email || "No Email Provided"}</p>
                                        <small className="text-gray-400">
                                            User ID: {user._id || "Unavailable"}
                                        </small>{" "}
                                        <br />
                                        <small className="text-gray-400">
                                            Socket ID: {user.socketId || "Unavailable"}
                                        </small>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-gray-500">
                            <p>No user is live. Please refresh the page to load live users.</p>
                        </div>
                    )}

                    {isModalOpen && userInfo && <Modal isOpen={isModalOpen} onClose={closeModal} userInfo={userInfo} />}
                </>
            )}
        </div>
    );
};

export default LiveUsers;
