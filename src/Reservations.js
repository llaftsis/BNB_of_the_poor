import React, { useState, useEffect, useContext } from 'react';
import AuthContext from './AuthContext';
import { Link } from 'react-router-dom';



function Reservations() {
    const { user } = useContext(AuthContext);
    const userRole = user && user.role;
    const isApproved = user && user.isApproved;
    
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    
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

    useEffect(() => {
        if (user && userRole === 'Ενοικιαστής' && isApproved) {
            const fetchUserReservations = async () => {
                try {
                    const response = await fetch(`http://localhost:5000/api/reservations/${user.username}`);
                    if (!response.ok) {
                        throw new Error("Failed to fetch user's reservations");
                    }
                    const data = await response.json();
                    console.log("Fetched data:", data);
                    setReservations(data);
                } catch (error) {
                    console.error("Error fetching user's reservations:", error);
                }
                setLoading(false);
            };
            fetchUserReservations();
        } else {
            setLoading(false);
        }
    }, [user, userRole, isApproved]);

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div style={styles.resultsContainer}>
            <h2>ΟΙ ΚΡΑΤΗΣΕΙΣ ΜΟΥ</h2>
            {reservations.length === 0 ? (
                <p>You have no reservations.</p>
            ) : (
                reservations.map(reservation => (
                    <div key={reservation.id} style={styles.listingCard}>
                        <img 
                            src={reservation.imageURL}  // Assuming reservation has imageURL property
                            alt={reservation.listingName}
                            style={styles.apartmentImage} 
                        />
                        <Link 
                            to={`/apartment/${reservation.apartment_id}?checkInDate=${reservation.start_date}&checkOutDate=${reservation.end_date}`} 
                            style={styles.link}
                        >
                            <h3>{reservation.listingName}</h3>  {/* Assuming reservation has listingName property */}
                            <p style={styles.dateText}>Check-in Date: {new Date(reservation.start_date).toLocaleDateString()}</p>
                            <p style={styles.dateText}>Check-out Date: {new Date(reservation.end_date).toLocaleDateString()}</p>
                            {/* Add other reservation details here */}
                        </Link>
                    </div>
                ))
            )}
        </div>
    );
    
}

export default Reservations;
