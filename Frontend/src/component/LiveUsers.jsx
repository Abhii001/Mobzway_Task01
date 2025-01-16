import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Modal from './Model';

const LiveUsers = () => {
    const [userData, setUserData] = useState({ name: '', email: '' });
    const [users, setUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch("https://mobzway-task01.onrender.com/Users");
                if (!response.ok) throw new Error('Failed to fetch user data');
                const data = await response.json();

                console.log(data);

                if (Array.isArray(data) && data.length > 0) {
                    setUsers(data);
                    const firstUser = data[0];
                    const name = firstUser.firstName;
                    const email = firstUser.email;
                    setUserData({ name, email });
                    localStorage.setItem('name', name);
                    localStorage.setItem('email', email);
                } else {
                    throw new Error("User data is missing or in the wrong format");
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUserData();
    }, []);

    useEffect(() => {
        if (userData.name && userData.email) {
            const socket = io('http://localhost:5100');
            socket.emit('joinRoom', userData);
            socket.on('updateUserList', (updatedUsers) => setUsers(updatedUsers));

            return () => socket.disconnect();
        }
    }, [userData]);

    const fetchUserInfo = async (socketId) => {
        try {
            const response = await fetch(`http://localhost:5100/User/${socketId}`);
            const data = await response.json();
            setUserInfo(data);
            setIsModalOpen(true);
        } catch (error) {
            alert('Error fetching user info');
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-center text-2xl font-bold text-gray-800 border-b pb-4 mb-4">
                Live Users
            </h1>
            <ul className="space-y-4">
                {users.map((user, index) => (
                    <li
                        key={index}
                        className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => fetchUserInfo(user.socketId)}
                    >
                        <div className="text-gray-700 font-semibold">
                            {user.firstName} {user.lastName}
                        </div>
                        <div className="text-gray-500">{user.email}</div>
                        <small className="text-gray-400">Socket ID: {user.socketId}</small>
                    </li>
                ))}
            </ul>

            <Modal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                userInfo={userInfo} 
            />
        </div>
    );
};

export default LiveUsers;
