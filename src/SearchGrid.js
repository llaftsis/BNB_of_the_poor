import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function SearchGrid() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [results, setResults] = useState([]);  // Ensure initialized as an empty array
  const location = useLocation();
  
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const checkInDate = searchParams.get('checkInDate');
    const checkOutDate = searchParams.get('checkOutDate');
    const guests = searchParams.get('guests');
    const city = searchParams.get('city');
    const category = searchParams.get('category');
    
    const fetchResults = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/search?checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&guests=${guests}&city=${city}&category=${category}`);
        const contentType = response.headers.get("content-type");
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        } else if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          console.log("Response data:", data);
          
          setResults(data || []);  // Set results directly, defaulting to an empty array if undefined
        } else {
          throw new Error('Invalid content type: Expected application/json but received ' + contentType);
        }
      } catch (err) {
          setError(err.message);  // Setting the error message
      } finally {
          setLoading(false);
      }
    };

    fetchResults();
  }, [location.search]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="results-container">
      {Array.isArray(results) && results.map(listing => (  // Ensure results is an array before mapping
        <div key={listing.id} className="listing-card">
          <div><strong>Check-in:</strong> {listing.check_in_date}</div>
          <div><strong>Check-out:</strong> {listing.check_out_date}</div>
          <div><strong>Guests:</strong> {listing.number_of_guests}</div>
          <div><strong>Location:</strong> {listing.location}</div>
          <div><strong>Category:</strong> {listing.category}</div>
        </div>
      ))}
    </div>
  );
}

export default SearchGrid;
