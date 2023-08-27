import React, { useState } from 'react';
import SearchFilters from './SearchFilters';
import SearchPagination from './SearchPagination';
import SearchGrid from './SearchGrid';

function SearchResults({ searchParams }) {
    // Fetch results based on searchParams (location, dates, number of people)
    // Sort by price and filter out unavailable spaces
    // Paginate the results (10 results per page)
   
    const [currentPage, setCurrentPage] = useState(1);

    const handleFilterChange = (filters) => {
        // Update the search parameters with the new filters and fetch new results
      };

      const [results, setResults] = useState([]);  // All the fetched results

      // Logic to compute paginatedResults based on currentPage and resultsPerPage
      const indexOfLastResult = currentPage * resultsPerPage;
      const indexOfFirstResult = indexOfLastResult - resultsPerPage;
      const paginatedResults = results.slice(indexOfFirstResult, indexOfLastResult);
      
    const resultsPerPage = 10;
      
    return (
      <div>
        <SearchFilters onFilterChange={handleFilterChange} />
        <SearchPagination />
        <SearchGrid results={paginatedResults} />
        <SearchPagination
        totalResults={results.length}
        resultsPerPage={10}
        currentPage={currentPage}
        onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    );
  }
  
  export default SearchResults;

  