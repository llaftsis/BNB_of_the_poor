import './Listings.css';
import React, { useState, useEffect, useContext } from 'react';
import AuthContext from './AuthContext';
import { Link } from 'react-router-dom';


function Listings() {
  const { user } = useContext(AuthContext);
  const userRole = user && user.role;
  const isApproved = user && user.isApproved;

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
      //fontWeight: 'bold'
    },
    apartmentImage: {
      width: '100%',       
      height: '150px',     
      objectFit: 'cover',  
      borderRadius: '5px', 
      marginBottom: '10px' 
    }
  };
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [guestuser, setGuestuser] = useState(true);  // Assuming default is true


  useEffect(() => {
    if (user && userRole === 'Ενοικιαστής' && isApproved) {
        setGuestuser(false); 
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
    } else if (guestuser) {
        //setLoading(false);

        const fetchApartmentsWithFirstImage = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/apartments-with-first-image`);
                if (!response.ok) {
                    throw new Error("Failed to fetch apartments with first image");
                }
                const data = await response.json();
                console.log("Fetched data:", data);
                setReservations(data.apartments);
            } catch (error) {
                console.error("Error fetching apartments or images:", error);
            }
            setLoading(false);
        };
        fetchApartmentsWithFirstImage();
    }
    else
    {
        setLoading(false);  
    }
  }, [user, userRole, isApproved,guestuser]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
    {guestuser ? (
      <div className="carousel-container">
      <div className="carousel-content">
          {reservations.map(listing => (
              <div key={listing.id} className="listing">
                  <Link 
                      to={`/apartment/${listing.id}`} 
                      style={styles.link}
                  >
                  <img src={`http://localhost:5000/${listing.firstImage}`} className="listing-image" alt="Apartment"/>
                  <h2>{listing.nickname}</h2>
                  <p>Start Date: {new Date(listing.open_date).toLocaleDateString() }</p>
                  <p>End Date: {new Date(listing.close_date).toLocaleDateString()}</p>
                  </Link>
              </div>
          ))}
      </div>
  </div>
    ):
(

        <div className="carousel-container">
            <div className="carousel-content">
                {reservations.map(listing => (
                    <div key={listing.id} className="listing">
                        <Link 
                            to={`/apartment/${listing.apartment_id}?checkInDate=${listing.start_date}&checkOutDate=${listing.end_date}`} 
                            style={styles.link}
                        >
                        <img src={`http://localhost:5000/${listing.imageURL}`} className="listing-image"/>
                        <h2>{listing.nickname}</h2>
                        <p>Check-in Date: {new Date(listing.start_date).toLocaleDateString() }</p>
                        <p>Check-out Date: {new Date(listing.start_date).toLocaleDateString()}</p>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
)}


    </div>
  );
}

export default Listings;
