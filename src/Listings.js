import './Listings.css';
import React, { useState, useEffect, useContext } from 'react';
import AuthContext from './AuthContext';

function Listings() {
  const { user } = useContext(AuthContext);
  const userRole = user && user.role;
  const isApproved = user && user.isApproved;
  
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //if (user && userRole === 'Ενοικιαστής' && isApproved) {
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
    //} else {
        setLoading(false);
    //}
  }, [user, userRole, isApproved]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
        <div className="carousel-container">
            <div className="carousel-content">
                {reservations.map(listing => (
                    <div key={listing.id} className="listing">
                        <img src={`http://localhost:5000/${listing.imageURL}`} className="listing-image"/>
                        <h2>{listing.nickname}</h2>
                        <p>{listing.start_date}</p>
                        <p>{listing.end_date}</p>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
}

export default Listings;
