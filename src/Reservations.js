import React, { useState, useEffect } from 'react';

function Reservations({ user, userRole, isApproved }) {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user && userRole === 'Ενοικιαστής' && isApproved) {
            const fetchUserReservations = async () => {
                try {
                    const response = await fetch(`http://localhost:5000/api/reservations/${user.username}`);
                    if (!response.ok) {
                        throw new Error("Failed to fetch user's reservations");
                    }
                    const data = await response.json();
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
        <div>
            <h2>Your Reservations</h2>
            {reservations.length === 0 ? (
                <p>You have no reservations.</p>
            ) : (
                <ul>
                    {reservations.map(reservation => (
                        <li key={reservation.id}>
                            <h3>{reservation.listingName}</h3>
                            <p>Location: {reservation.location}</p>
                            <p>Check-in Date: {reservation.checkInDate}</p>
                            <p>Check-out Date: {reservation.checkOutDate}</p>
                            {/* Add other reservation details here */}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Reservations;
