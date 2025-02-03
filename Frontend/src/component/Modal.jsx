import React from 'react';

const Modal = ({ isOpen, onClose, userInfo }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
            <div className="modal-content bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">User Information</h2>

                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <strong className="text-gray-700">ID:</strong>
                        <p className="text-gray-900">{userInfo._id}</p>
                    </div>
                    <div>
                        <strong className="text-gray-700">First Name:</strong>
                        <p className="text-gray-900">{userInfo.firstName}</p>
                    </div>
                    <div>
                        <strong className="text-gray-700">Last Name:</strong>
                        <p className="text-gray-900">{userInfo.lastName}</p>
                    </div>
                    <div>
                        <strong className="text-gray-700">Mobile:</strong>
                        <p className="text-gray-900">{userInfo.mobile}</p>
                    </div>
                    <div>
                        <strong className="text-gray-700">Email:</strong>
                        <p className="text-gray-900">{userInfo.email}</p>
                    </div>
                    <div>
                        <strong className="text-gray-700">Address:</strong>
                        <pre className="text-gray-900 bg-gray-50 p-2 rounded-md overflow-auto">{JSON.stringify(userInfo.address, null, 2)}</pre>
                    </div>
                    <div>
                        <strong className="text-gray-700">Login ID:</strong>
                        <p className="text-gray-900">{userInfo.loginId}</p>
                    </div>
                    <div>
                        <strong className="text-gray-700">Password:</strong>
                        <p className="text-gray-900">{userInfo.password}</p>
                    </div>
                    <div>
                        <strong className="text-gray-700">Created At:</strong>
                        <p className="text-gray-900">{new Date(userInfo.createdAt).toLocaleString()}</p>
                    </div>
                    <div>
                        <strong className="text-gray-700">Updated At:</strong>
                        <p className="text-gray-900">{new Date(userInfo.updatedAt).toLocaleString()}</p>
                    </div>
                </div>

                <div className="mt-6 flex justify-center">
                    <button
                        className="bg-blue-600 text-white py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 transition"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;