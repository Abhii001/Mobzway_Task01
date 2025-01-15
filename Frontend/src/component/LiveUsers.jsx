import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const LiveUsers = () => {
  const [userList, setUserList] = useState([]);
  const [modalUser, setModalUser] = useState(null);
  const [socket] = useState(io("/"));

  useEffect(() => {
    // Join the "live users" room with user data
    const userData = { email: "user@example.com", name: "John Doe" }; // Replace this with dynamic user data
    socket.emit("joinRoom", userData);

    // Listen for the updated user list
    socket.on("updateUserList", (liveUsers) => {
      setUserList(Object.values(liveUsers));
    });

    // Cleanup on component unmount
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  // Show the user details in a modal
  const showUserDetails = async (socketId) => {
    try {
      const response = await fetch(`/user/${socketId}`);
      const userDetails = await response.json();
      setModalUser(userDetails);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const closeModal = () => {
    setModalUser(null);
  };

  return (
    <div>
      <h1>Live Users</h1>
      <div id="userList" style={{ marginTop: "20px" }}>
        {userList.map((user) => (
          <div
            key={user.socketId}
            className="user"
            style={{
              margin: "10px 0",
              padding: "5px",
              border: "1px solid #ddd",
              cursor: "pointer",
            }}
            onClick={() => showUserDetails(user.socketId)}
          >
            <strong>{user.name}</strong> ({user.email}) - Socket ID:{" "}
            {user.socketId}
          </div>
        ))}
      </div>

      {modalUser && (
        <div
          id="userModal"
          style={{
            display: "flex",
            backgroundColor: "rgba(0,0,0,0.5)",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              width: "300px",
            }}
          >
            <h2>User Details</h2>
            <p>
              <strong>Name:</strong> {modalUser.name} <br />
              <strong>Email:</strong> {modalUser.email} <br />
              <strong>Socket ID:</strong> {modalUser.socketId}
            </p>
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveUsers;
