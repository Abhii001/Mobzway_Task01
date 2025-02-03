import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import Modal from './Modal';
import { nanoid } from 'nanoid';

const LiveUsers = () => {
    const [users, setUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [userJoinedMessage, setUserJoinedMessage] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const socketUrl = 'https://mobzway-task01.onrender.com';
    const socketRef = useRef(null);

    useEffect(() => {
        socketRef.current = io(socketUrl, {
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            pingInterval: 5000,
            pingTimeout: 5000,
        });

        socketRef.current.on('connected', (data) => {
            document.getElementById('chatRoomName').innerText = `Chat Room: ${data.room}`;
        });

        socketRef.current.on('allUsers', (users) => {
            console.log("Received Users from Server:", users);

            const updatedUsers = users.map(user => ({
                ...user,
                nanoId: nanoid(),
                socketId: user.socketId || null,
                mobile: user.mobile || 'N/A',
                address: user.address || 'Not Provided',
            }));

            console.log("Processed Users (Before State Update):", updatedUsers);
            setUsers(updatedUsers);
            setIsLoading(false);
        });

        socketRef.current.on('userJoined', (newUser) => {
            console.log("New User Joined:", newUser);
            setUsers(prevUsers => [
                ...prevUsers,
                { ...newUser, nanoId: nanoid() }
            ]);
            setUserJoinedMessage(`${newUser.firstName} has joined the chat.`);
        });

        socketRef.current.on('userDisconnected', (socketId) => {
            console.log(`User Disconnected, Socket ID: ${socketId}`);
            setUsers(prevUsers => {
                return prevUsers.map(user =>
                    user.socketId === socketId ? { ...user, socketId: "Offline" } : user
                );
            });
        });

        socketRef.current.on('connect_error', () => {
            setError('Failed to connect to server');
        });

        return () => {
            socketRef.current.off('allUsers');
            socketRef.current.off('userJoined');
            socketRef.current.off('userDisconnected');
            socketRef.current.off('connect_error');
            socketRef.current.disconnect();
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

    useEffect(() => {
        const timeout = setTimeout(() => {
            setUsers([]);
        }, 120000); // 2 minutes

        return () => clearTimeout(timeout);
    }, [users]);

    const fetchUserInfo = async (userId) => {
        try {
            setIsLoading(true);
            const response = await fetch(`${socketUrl}/getUserDetails/${userId}`);
            if (!response.ok) throw new Error('User not found');
            const data = await response.json();
            console.log("Fetched User Info:", data);
            setUserInfo(data);
            setIsModalOpen(true);
        } catch (err) {
            setError('Failed to find user.');
        } finally {
            setIsLoading(false);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setUserInfo(null);
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 id="chatRoomName" className="text-center text-3xl font-extrabold text-gray-800 border-b pb-4 mb-6">
                Chat Room
            </h1>

            {userJoinedMessage && (
                <p className="text-center text-green-500 font-bold mt-4">
                    {userJoinedMessage}
                </p>
            )}

            {error && (
                <div className="bg-red-100 text-red-600 p-4 rounded mb-4 flex justify-between items-center">
                    <p>{error}</p>
                    <button className="text-red-600 font-bold" onClick={() => setError(null)}>&times;</button>
                </div>
            )}

            {isLoading ? (
                <div className="flex justify-center items-center min-h-[200px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
                </div>
            ) : users.length > 0 ? (
                <div id="usersContainer" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {users.map((user) => (
                        <div
                            key={user.nanoId}
                            className={`p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer ${!user.socketId ? "opacity-50 cursor-not-allowed" : ""}`}
                            onClick={() => fetchUserInfo(user._id)}
                        >
                            <div className="mb-4 flex items-center space-x-2">
                                <div className={`w-3 h-3 rounded-full ${user.socketId ? "bg-green-500" : "bg-red-400"}`}></div>
                                <span className={`${user.socketId ? "text-green-500" : "text-gray-400"} text-sm font-medium`}>
                                    {user.socketId ? "Online" : "Offline"}
                                </span>
                            </div>

                            <div>
                                <h3 className="text-gray-800 font-semibold text-lg">
                                    {user.firstName || 'Unknown'} {user.lastName || 'User'}
                                </h3>
                                <p className="text-gray-500">{user.email || 'No Email Provided'}</p>
                                <small className="text-gray-400">
                                    User ID: {user._id || 'Unavailable'}
                                </small> <br />
                                <small className="text-gray-400">
                                    Socket ID: {user.socketId || 'Unavailable'}
                                </small>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="col-span-full text-center text-gray-500">
                    <p>No user is live. Please refresh the page to load live users.</p>
                    <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg" onClick={() => window.location.reload()}>
                        Refresh
                    </button>
                </div>
            )}

            {isModalOpen && userInfo && <Modal isOpen={isModalOpen} onClose={closeModal} userInfo={userInfo} />}
        </div>
    );
};

export default LiveUsers;
