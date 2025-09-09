// components/SearchInput.jsx
import React from "react";
import { FaSearch } from "react-icons/fa";

const SearchInput = ({ value, onChange, onFocus, onBlur, inputRef, focused, placeholder }) => {
  return (
    <div className="relative w-64">
      <label
        htmlFor="search"
        className={`absolute left-3 text-gray-400 transition-all duration-200 cursor-text ${
          focused || value ? "-top-2 text-xs bg-white px-1" : "top-2"
        }`}
      >
        {placeholder}
      </label>
      <input
        ref={inputRef}
        id="search"
        type="text"
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        className="w-full border border-gray-300 rounded-lg py-2 pl-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <FaSearch
        onClick={() => inputRef.current?.focus()}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
        aria-label="Pesquisar"
      />
    </div>
  );
};

export default SearchInput;
