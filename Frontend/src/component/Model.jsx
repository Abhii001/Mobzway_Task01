// Modal.js
import React from 'react';

const Modal = ({ isOpen, onClose, userInfo }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
            <div className="modal-content bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
                <h2 className="text-xl font-semibold mb-4">User Info</h2>
                <div className="mb-4">
                    <strong>Name: </strong>{userInfo.name}
                </div>
                <div className="mb-4">
                    <strong>Email: </strong>{userInfo.email}
                </div>
                <div className="mb-4">
                    <strong>Socket ID: </strong>{userInfo.socketId}
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
