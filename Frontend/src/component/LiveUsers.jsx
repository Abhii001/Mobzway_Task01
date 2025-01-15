import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const LiveUsers = () => {
  const [users, setUsers] = useState([]);
  const [popupData, setPopupData] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);

  useEffect(() => {
    const socket = io("https://mobzway-task01-3.onrender.com");
  
    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });
  
    const fetchUserData = async () => {
      try {
        const response = await fetch("https://mobzway-task01-3.onrender.com/saveUser");
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const userData = await response.json();
  
        socket.emit("joinRoom", {
          email: userData.email,
          name: userData.name,
        });
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      }
    };
  
    fetchUserData();
  
    socket.on("updateUserList", (updatedUsers) => {
      setUsers(updatedUsers);
    });
  
    return () => {
      socket.disconnect();
    };
  }, []);  

  const showUserInfo = async (email, socketId) => {
    try {
      const response = await fetch(`/getUserInfo?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      setPopupData({ ...data, socketId });
      setPopupVisible(true);
    } catch (error) {
      alert("Error fetching user info: " + error.message);
    }
  };

  const closePopup = () => {
    setPopupVisible(false);
    setPopupData(null);
  };

  return (
    <div className="font-sans p-6">
      <h1 className="text-2xl font-bold mb-4">Live Users</h1>
      <div className="space-y-3">
        {users.map((user) => (
          <div key={user.socketId} className="text-blue-600 hover:underline">
            <button
              className="text-left"
              onClick={() => showUserInfo(user.email, user.socketId)}
            >
              {user.email} ({user.socketId})
            </button>
          </div>
        ))}
      </div>

      {popupVisible && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <button
              className="ml-auto mb-4 bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
              onClick={closePopup}
            >
              Close
            </button>
            {popupData && (
              <div>
                <h2 className="text-xl font-semibold mb-4">User Info</h2>
                <p className="mb-2">
                  <span className="font-medium">Email:</span> {popupData.email}
                </p>
                <p className="mb-2">
                  <span className="font-medium">Name:</span> {popupData.name}
                </p>
                <p>
                  <span className="font-medium">Socket ID:</span>{" "}
                  {popupData.socketId}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveUsers;
