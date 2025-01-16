import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Model from "./Model"

const LiveUsers = () => {
    const [users, setUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch("https://mobzway-task01.onrender.com/Users");
                if (!response.ok) throw new Error('Failed to fetch users');
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();

        const socket = io('https://mobzway-task01.onrender.com');
        socket.emit('joinRoom', { name: 'Live User Page' });

        socket.on('updateUserList', (updatedUsers) => {
            setUsers(updatedUsers);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const fetchUserInfo = async (socketId) => {
        try {
            const response = await fetch(`https://mobzway-task01.onrender.com/User/${socketId}`);
            if (!response.ok) throw new Error('Failed to fetch user info');
            const data = await response.json();
            setUserInfo(data);
            setIsModalOpen(true);
        } catch (error) {
            console.error('Error fetching user info:', error);
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

            {isModalOpen && (
                <Modal 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)} 
                    userInfo={userInfo} 
                />
            )}
        </div>
    );
};

export default LiveUsers;
