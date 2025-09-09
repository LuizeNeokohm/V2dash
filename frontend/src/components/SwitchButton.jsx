// components/SwitchButton.jsx
import React from "react";

const SwitchButton = ({ active, onToggle }) => {
  return (
    <div
      onClick={onToggle}
      className={`w-14 h-7 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
        active ? "bg-green-500" : "bg-red-500"
      }`}
    >
      <div
        className={`bg-white w-5 h-5 rounded-full shadow-md transform duration-300 ${
          active ? "translate-x-7" : "translate-x-0"
        }`}
      />
    </div>
  );
};

export default SwitchButton;
