import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import Model from "./Model";
import { nanoid } from "nanoid";

const LiveUsers = () => {
    const [users, setUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [userJoinedMessage, setUserJoinedMessage] = useState(null);

    const socketUrl = "https://mobzway-task01.onrender.com";
    let socket;

    useEffect(() => {
        socket = io(socketUrl, {
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            pingInterval: 5000,
            pingTimeout: 5000,
        });

        const fetchUsers = async () => {
            try {
                const response = await fetch(`${socketUrl}/Users`);
                if (!response.ok) throw new Error("Failed to fetch users");

                const data = await response.json();
                const usersWithIds = data.map((user) => ({
                    ...user,
                    nanoId: nanoid(),
                    socketId: user.socketId || null,
                    mobile: user.mobile || "N/A",
                    address: user.address || "Not Provided",
                }));
                setUsers(usersWithIds);

                usersWithIds.forEach((user) => {
                    socket.emit("joinRoom", {
                        _id: user._id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        mobile: user.mobile,
                        address: user.address,
                        loginId: user.loginId,
                        password: user.password,
                        updatedAt: user.updatedAt,
                        createdAt: user.createdAt,
                    });
                });
            } catch (err) {
                handleError("Unable to load user data.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();

        socket.on("userJoined", (data) => {
            console.log(data.message);
            setUserJoinedMessage(data.message);
        });

        socket.on("updateUserList", (updatedUsers) => {
            const updatedUser = updatedUsers[updatedUsers.length - 1];
            setUsers((prevUsers) => {
                const userIndex = prevUsers.findIndex((user) => user._id === updatedUser._id);
                if (userIndex !== -1) {
                    const updatedUserData = {
                        ...prevUsers[userIndex],
                        socketId: updatedUser.socketId || prevUsers[userIndex].socketId,
                        status: updatedUser.status || prevUsers[userIndex].status,
                    };
                    const newUsers = [...prevUsers];
                    newUsers[userIndex] = updatedUserData;
                    return newUsers;
                } else {
                    return prevUsers;
                }
            });
        });

        socket.on("userDisconnected", (socketId) => {
            setUsers((prevUsers) =>
                prevUsers.filter((user) => user.socketId !== socketId)
            );
        });

        return () => {
            socket.off("updateUserList");
            socket.off("userDisconnected");
            socket.off("userJoined");
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (userJoinedMessage) {
            const timer = setTimeout(() => {
                setUserJoinedMessage(null);
            }, 10000);

            return () => clearTimeout(timer);
        }
    }, [userJoinedMessage]);

    const fetchUserInfo = async (userId) => {
        try {
            const response = await fetch(`${socketUrl}/User/${userId}`);
            if (!response.ok) throw new Error("User not found");

            const data = await response.json();
            setUserInfo(data);
            setIsModalOpen(true);
        } catch (err) {
            setError("Failed to find user.");
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setUserInfo(null);
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-center text-3xl font-extrabold text-gray-800 border-b pb-4 mb-6">
                Live Users
            </h1>

            {userJoinedMessage && (
                <p className="text-center text-green-500 font-bold mt-4">
                    {userJoinedMessage}
                </p>
            )}

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
            ) : (
                <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {users.length > 0 ? (
                        users.map((user) => (
                            <li
                                key={user.nanoId || nanoid()}
                                className={`p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer ${!user.socketId ? "opacity-50 cursor-not-allowed" : ""}`}
                                onClick={() => user._id ? fetchUserInfo(user._id) : console.warn(`No user ID found for ${user.firstName} ${user.lastName}`)}
                            >
                                <div className="mb-4 flex items-center space-x-2">
                                    <div className={`w-3 h-3 rounded-full ${user.socketId ? "bg-green-500 glowing-dot" : "bg-gray-400"}`}></div>
                                    <span className={`${user.socketId ? "text-green-500" : "text-gray-400"} text-sm font-medium`}>
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
                                    </small>
                                </div>
                            </li>
                        ))
                    ) : (
                        <div className="col-span-full text-center text-gray-500">
                            <p>No user is live. Please refresh the page to load live users.</p>
                            <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg" onClick={() => window.location.reload()}>Refresh</button>
                        </div>
                    )}
                </ul>
            )}

            {isModalOpen && <Model isOpen={isModalOpen} onClose={closeModal} userInfo={userInfo} />}
        </div>
    );
};

export default LiveUsers;
