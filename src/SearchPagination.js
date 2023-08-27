function SearchPagination({ totalResults, resultsPerPage, currentPage, onPageChange }) {
    const totalPages = Math.ceil(totalResults / resultsPerPage);
  
    const handlePageClick = (pageNumber) => {
      onPageChange(pageNumber);
    };
  
    return (
      <div className="pagination-container">
        {[...Array(totalPages).keys()].map(index => {
          const pageNumber = index + 1;
          return (
            <span 
              key={index} 
              className={`page-number ${pageNumber === currentPage ? 'active' : ''}`}
              onClick={() => handlePageClick(pageNumber)}
            >
              {pageNumber}
            </span>
          );
        })}
      </div>
    );
  }
  
  export default SearchPagination; 