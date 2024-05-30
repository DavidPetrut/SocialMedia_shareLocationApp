import React from 'react';

function ConfirmationModal({ isOpen, onClose, onConfirm, message }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
            <div className="bg-white p-4 rounded-lg max-w-sm mx-auto">
                <p className="text-gray-800">{message}</p>
                <div className="mt-4 flex justify-end space-x-2">
                    <button onClick={onConfirm} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                        Delete
                    </button>
                    <button onClick={onClose} className="bg-gray-300 hover:bg-gray-500 text-black font-bold py-2 px-4 rounded">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmationModal;
