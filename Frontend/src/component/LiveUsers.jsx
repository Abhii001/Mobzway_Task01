import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import Model from "./Model";

const LiveUsers = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Loading state for fetching users

  const socketUrl = "http://mobzway-task01.onrender.com"; 

  // For tracking users' last active time
  const [userLastActive, setUserLastActive] = useState({});

  useEffect(() => {
    const socket = io(socketUrl, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    // Socket event to track users' online/offline status
    socket.emit("joinRoom", { name: "Live User Page" });

    // Fetching initial user list
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${socketUrl}/Users`);
        if (!response.ok) throw new Error("Failed to fetch users");
        const data = await response.json();
        setUsers(data);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Unable to load user data.");
        setIsLoading(false);
      }
    };

    fetchUsers();

    // Socket event to update the list of users
    socket.on("updateUserList", (updatedUsers) => {
      setUsers(updatedUsers);
      updatedUsers.forEach((user) => {
        setUserLastActive((prevState) => ({
          ...prevState,
          [user.socketId]: Date.now(),
        }));
      });
    });

    // Listen for when a user goes offline
    socket.on("userDisconnected", (socketId) => {
      setUsers((prevUsers) => prevUsers.filter((user) => user.socketId !== socketId));
    });

    // Cleanup socket events on component unmount
    return () => {
      socket.off("updateUserList");
      socket.off("userDisconnected");
      socket.disconnect();
    };
  }, []); // Empty dependency array to ensure effect runs only once on mount

  const fetchUserInfo = async (socketId) => {
    if (!socketId) return;

    try {
      const response = await fetch(`${socketUrl}/User/${socketId}`);
      if (!response.ok) throw new Error("Failed to fetch user info");
      const data = await response.json();
      setUserInfo(data);
      setIsModalOpen(true);
    } catch (err) {
      console.error("Error fetching user info:", err);
      setError("Unable to load user details.");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setUserInfo(null);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-center text-2xl font-bold text-gray-800 border-b pb-4 mb-4">
        Live Users
      </h1>

      {error && (
        <div className="bg-red-100 text-red-600 p-4 rounded mb-4">
          <p>{error}</p>
        </div>
      )}

      {isLoading ? (
        <div className="text-center text-gray-500">Loading users...</div>
      ) : (
        <ul className="space-y-4">
          {users.length > 0 ? (
            users.map((user, index) => (
              <li
                key={index}
                className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer flex items-center justify-between"
                onClick={() => fetchUserInfo(user.socketId)}
              >
                <div>
                  <div className="text-gray-700 font-semibold">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="text-gray-500">{user.email}</div>
                  <small className="text-gray-400">Socket ID: {user.socketId || "N/A"}</small>
                </div>

                {user.status === "online" ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-green-500 text-sm font-medium">Online</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                    <span className="text-gray-400 text-sm font-medium">Offline</span>
                  </div>
                )}
              </li>
            ))
          ) : (
            <p className="text-center text-gray-500">No users available.</p>
          )}
        </ul>
      )}

      {isModalOpen && (
        <Model isOpen={isModalOpen} onClose={closeModal} userInfo={userInfo} />
      )}
    </div>
  );
};

export default LiveUsers;
