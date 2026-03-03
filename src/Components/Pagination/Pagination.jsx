import React from 'react';
import './Pagination.css';

const Pagination = ({ 
  currentPage = 0, 
  totalPages = 1, 
  totalElements = 0,
  pageSize = 12,
  onPageChange,
  isLastPage = false,
  isLoading = false 
}) => {
  
  // Don't render if no pagination needed
  if (totalPages <= 1 && !isLoading) {
    return null;
  }

  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages && page !== currentPage && !isLoading) {
      onPageChange(page);
      
      // Smooth scroll to top
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 7;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Smart pagination with ellipsis
      if (currentPage <= 3) {
        // Show first pages
        for (let i = 0; i < 5; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages - 1);
      } else if (currentPage >= totalPages - 4) {
        // Show last pages
        pages.push(0);
        pages.push('ellipsis');
        for (let i = totalPages - 5; i < totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Show middle pages
        pages.push(0);
        pages.push('ellipsis');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages - 1);
      }
    }
    
    return pages;
  };

  const pageNumbers = generatePageNumbers();
  
  const startItem = currentPage * pageSize + 1;
  const endItem = Math.min((currentPage + 1) * pageSize, totalElements);

  return (
    <div className="pagination-container">
      {/* Results info */}
      <div className="pagination-info">
        <span className="results-range">
          {totalElements > 0 ? (
            <>Showing {startItem}-{endItem} of {totalElements} interviews</>
          ) : (
            'No interviews found'
          )}
        </span>
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="pagination-controls">
          {/* Previous button */}
          <button
            className={`pagination-btn prev-btn ${currentPage === 0 || isLoading ? 'disabled' : ''}`}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0 || isLoading}
            aria-label="Previous page"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="btn-text">Previous</span>
          </button>

          {/* Page numbers */}
          <div className="page-numbers">
            {pageNumbers.map((page, index) => {
              if (page === 'ellipsis') {
                return (
                  <span key={`ellipsis-${index}`} className="pagination-ellipsis">
                    ...
                  </span>
                );
              }
              
              return (
                <button
                  key={page}
                  className={`page-number ${page === currentPage ? 'active' : ''} ${isLoading ? 'disabled' : ''}`}
                  onClick={() => handlePageChange(page)}
                  disabled={isLoading}
                  aria-label={`Go to page ${page + 1}`}
                  aria-current={page === currentPage ? 'page' : undefined}
                >
                  {page + 1}
                </button>
              );
            })}
          </div>

          {/* Next button */}
          <button
            className={`pagination-btn next-btn ${currentPage === totalPages - 1 || isLastPage || isLoading ? 'disabled' : ''}`}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages - 1 || isLastPage || isLoading}
            aria-label="Next page"
          >
            <span className="btn-text">Next</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      )}

      {/* Quick navigation for large datasets */}
      {totalPages > 10 && (
        <div className="quick-navigation">
          <label htmlFor="page-jump" className="page-jump-label">
            Go to page:
          </label>
          <select
            id="page-jump"
            value={currentPage}
            onChange={(e) => handlePageChange(Number(e.target.value))}
            className="page-jump-select"
            disabled={isLoading}
          >
            {Array.from({ length: totalPages }, (_, i) => (
              <option key={i} value={i}>
                {i + 1}
              </option>
            ))}
          </select>
          <span className="page-jump-total">of {totalPages}</span>
        </div>
      )}

      {/* Loading overlay */}
      {isLoading && (
        <div className="pagination-loading">
          <div className="loading-spinner" />
        </div>
      )}
    </div>
  );
};

export default Pagination;