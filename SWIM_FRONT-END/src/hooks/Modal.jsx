import React from "react";

const Modal = ({ children, onClose }) => {
  return (
    <div className="fixed inset-0 overflow-y-auto z-50 flex justify-center items-center bg-gray-900 bg-opacity-50">
      <div className="relative bg-white rounded-lg p-8 max-w-md w-full">
        <button
          onClick={onClose}
          className="absolute top-0 right-0 p-2 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
