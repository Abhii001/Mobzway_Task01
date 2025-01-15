import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const LiveUsers = () => {
  const [userList, setUserList] = useState([]);
  const [modalUser, setModalUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch dynamic user data from localStorage
  const email = localStorage.getItem("email"); // Assume it's set after login
  const name = localStorage.getItem("name");   // Assume it's set after login
  const userData = { email, name };  // This will be dynamic now

  const socket = React.useMemo(() => io("https://mobzway-task01.onrender.com"), []);

  useEffect(() => {
    socket.emit("joinRoom", userData);

    socket.on("updateUserList", (liveUsers) => {
      setUserList(Object.values(liveUsers));
    });

    return () => {
      socket.disconnect();
    };
  }, [socket, userData]); 

  const showUserDetails = async (socketId) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`https://mobzway-task01.onrender.com/user/${socketId}`);
      if (!response.ok) throw new Error("Failed to fetch user details.");
      const userDetails = await response.json();
      setModalUser(userDetails);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setModalUser(null);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">Live Users</h1>

      <div className="space-y-4">
        {userList.length === 0 ? (
          <p>No live users available.</p>
        ) : (
          userList.map((user) => (
            <div
              key={user.socketId}
              className="p-4 bg-white shadow-md rounded-md cursor-pointer hover:bg-gray-200 transition"
              onClick={() => showUserDetails(user.socketId)}
            >
              <p className="text-lg font-medium">
                {user.email} - {user.socketId}
              </p>
            </div>
          ))
        )}
      </div>

      {modalUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">User Details</h2>
            <p>
              <strong>Name:</strong> {modalUser.name}
            </p>
            <p>
              <strong>Email:</strong> {modalUser.email}
            </p>
            <p>
              <strong>Socket ID:</strong> {modalUser.socketId}
            </p>
            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-800"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="text-white text-xl">Loading...</div>
        </div>
      )}

      {error && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded shadow-md">
          {error}
        </div>
      )}
    </div>
  );
};

export default LiveUsers;
