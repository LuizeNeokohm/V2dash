// src/components/ErrorAlert.jsx
import React from "react";

const ErrorAlert = ({ message }) => {
  if (!message) return null;

  return (
    <div className="mb-6 p-3 text-red-700 bg-red-100 border border-red-300 rounded">
      {message}
    </div>
  );
};

export default ErrorAlert;
