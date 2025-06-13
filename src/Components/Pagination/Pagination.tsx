import React from "react";
import styles from "./Pagination.module.css";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const renderPages = () => {
    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          className={`${styles.pageButton} ${
            currentPage === i ? styles.active : ""
          }`}
          onClick={() => onPageChange(i)}
        >
          {i}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className={styles.pagination}>
      <button
        className={styles.navButton}
        onClick={handlePrev}
        disabled={currentPage === 1}
      >
        ◀
      </button>
      {renderPages()}
      <button
        className={styles.navButton}
        onClick={handleNext}
        disabled={currentPage === totalPages}
      >
        ▶
      </button>
    </div>
  );
};

export default Pagination;
