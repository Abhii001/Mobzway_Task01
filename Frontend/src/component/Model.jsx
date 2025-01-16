// Modal.js
import React from 'react';

const Modal = ({ isOpen, onClose, userInfo }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
        <div className="modal-content bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-xl font-semibold mb-4">User Info</h2>
            <div className="mb-4">
                <strong>_id: </strong>{userInfo._id}
            </div>
            <div className="mb-4">
                <strong>First Name: </strong>{userInfo.firstName}
            </div>
            <div className="mb-4">
                <strong>Last Name: </strong>{userInfo.lastName}
            </div>
            <div className="mb-4">
                <strong>Mobile: </strong>{userInfo.mobile}
            </div>
            <div className="mb-4">
                <strong>Email: </strong>{userInfo.email}
            </div>
            <div className="mb-4">
                <strong>Address: </strong>{JSON.stringify(userInfo.address, null, 2)}
            </div>
            <div className="mb-4">
                <strong>Login ID: </strong>{userInfo.loginId}
            </div>
            <div className="mb-4">
                <strong>Password: </strong>{userInfo.password}
            </div>
            <div className="mb-4">
                <strong>Created At: </strong>{new Date(userInfo.createdAt).toLocaleString()}
            </div>
            <div className="mb-4">
                <strong>Updated At: </strong>{new Date(userInfo.updatedAt).toLocaleString()}
            </div>
            <button
                className="bg-blue-500 text-white py-2 px-4 rounded-lg"
                onClick={onClose}
            >
                Close
            </button>
        </div>
    </div>
    
    );
};

export default Modal;
