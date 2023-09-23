import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

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
        const data = await response.json();
        console.log("Response data:", data);

        if (Array.isArray(data)) {
          setResults(data);
        } else {
          console.error("Expected the response to be an array but received:", data);
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
  
    const styles = {
      resultsContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '16px',
        padding: '20px',
        backgroundColor: '#f3f4f6',
        fontFamily: 'Arial, sans-serif'
      },
      listingCard: {
        border: '1px solid #d1d5db',
        borderRadius: '8px',
        padding: '16px',
        backgroundColor: '#ffffff',
        transition: 'transform 0.2s, box-shadow 0.2s',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.2)',
        }
      },
      link: {
        textDecoration: 'none',
        color: '#111827',
        fontWeight: 'bold'
      },
      dateText: {
        color: '#6b7280',
        fontSize: '0.9em'
      },
      apartmentImage: {
        width: '100%',       // Make the image take the full width of the card
        height: '150px',     // Set a fixed height
        objectFit: 'cover',  // Cover the space without distorting the image
        borderRadius: '5px', // Optional: round the edges of the image
        marginBottom: '10px' // Space between image and text content
      }
    };
 
  
    return (
      <div style={styles.resultsContainer}>
        {results.map(apartment => (
          <div key={apartment.id} style={styles.listingCard}>
            <img 
              src={apartment.image_url} 
              alt={`Image of ${apartment.type_of_apartment} in ${apartment.location}`} 
              style={styles.apartmentImage}
            />
            <Link to={`/apartment/${apartment.id}`} style={styles.link}>
              {apartment.type_of_apartment} in {apartment.location}
              <div style={styles.dateText}>Open Date: {new Date(apartment.open_date).toLocaleDateString()}</div>
            <div style={styles.dateText}>Close Date: {new Date(apartment.close_date).toLocaleDateString()}</div>
            </Link>
          </div>
        ))}
      </div>
    );
}

export default SearchGrid;
