import React, { useState, useEffect } from 'react';

function SearchGrid({ searchParams }) {
  const [results, setResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 10;

  useEffect(() => {
    // Ideally, you'd fetch this data from an API
    async function fetchData() {
      try {
        let response = await fetch('/api/search', {
          method: 'POST',
          body: JSON.stringify(searchParams),
          headers: {
            'Content-Type': 'application/json'
          }
        });
        let data = await response.json();

        // Filter for availability and sort by price
        data = data
          .filter(item => item.isAvailableOn(searchParams.dates))
          .sort((a, b) => a.price - b.price);

        setResults(data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    }

    fetchData();
  }, [searchParams]);

  // Get current results for pagination
  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = results.slice(indexOfFirstResult, indexOfLastResult);

  return (
    <div className="results-grid">
      {currentResults.map(result => (
        <div key={result.id} className="grid-item">
          <img src={result.image} alt={result.name} />
          <p>${result.price}/day</p>
          <p>{result.type}</p>
          <p>{result.beds} beds</p>
          <p>{result.reviewsCount} reviews - {result.rating} ⭐</p>
        </div>
      ))}
    </div>
  );
}

export default SearchGrid;
  