import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Garantir que totalPages nunca seja menor que 1
  const total = Math.max(totalPages, 1);
  const isDisabled = totalPages === 0;

  return (
    <div className="flex justify-center items-center mt-2 space-x-4 text-gray-600">
      {/* Primeira página */}
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1 || isDisabled}
        aria-label="Primeira página"
        className={`hover:text-blue-600 transition ${
          currentPage === 1 || isDisabled ? "opacity-40 cursor-default" : ""
        }`}
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z"></path>
        </svg>
      </button>

      {/* Página anterior */}
      <button
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1 || isDisabled}
        aria-label="Página anterior"
        className={`hover:text-blue-600 transition ${
          currentPage === 1 || isDisabled ? "opacity-40 cursor-default" : ""
        }`}
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M15.41 16.59L10.82 12l4.59-4.59L14 6l-6 6 6 6z"></path>
        </svg>
      </button>

      <span className="text-sm">
        Página {currentPage} de {total}
      </span>

      {/* Próxima página */}
      <button
        onClick={() => onPageChange(Math.min(currentPage + 1, total))}
        disabled={currentPage === total || isDisabled}
        aria-label="Próxima página"
        className={`hover:text-blue-600 transition ${
          currentPage === total || isDisabled ? "opacity-40 cursor-default" : ""
        }`}
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8.59 16.59L13.18 12 8.59 7.41 10 6l6 6-6 6z"></path>
        </svg>
      </button>

      {/* Última página */}
      <button
        onClick={() => onPageChange(total)}
        disabled={currentPage === total || isDisabled}
        aria-label="Última página"
        className={`hover:text-blue-600 transition ${
          currentPage === total || isDisabled ? "opacity-40 cursor-default" : ""
        }`}
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z"></path>
        </svg>
      </button>
    </div>
  );
};

export default Pagination;