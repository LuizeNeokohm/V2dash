// src/components/FieldError.jsx
import React from "react";

const FieldError = ({ error }) => {
  if (!error) return null;

  return <span className="text-red-500 text-sm mt-1">{error}</span>;
};

export default FieldError;
