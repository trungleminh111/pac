"use client";

import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      <button
        className="pagination__arrow"
        disabled={page === 0}
        onClick={() => onPageChange(page - 1)}
      >
        <FaChevronLeft />
      </button>

      {Array.from({ length: totalPages }).map((_, index) => (
        <button
          key={index}
          className={`pagination__item ${page === index ? "active" : ""}`}
          onClick={() => onPageChange(index)}
        >
          {String(index + 1).padStart(2, "0")}
        </button>
      ))}

      <button
        className="pagination__arrow"
        disabled={page === totalPages - 1}
        onClick={() => onPageChange(page + 1)}
      >
        <FaChevronRight />
      </button>
    </div>
  );
}