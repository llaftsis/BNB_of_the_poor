import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from './AuthContext';

const ApartmentManagement = () => {
    const [apartments, setApartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);  // Fetch the user directly from the context
    const userRole = user && user.role;
    const isApproved = user && user.isApproved;

    useEffect(() => {
        if (userRole === 'Οικοδεσπότης' && isApproved) {
            axios.get(`/api/apartments/${user.id}`)
                .then(response => {
                    setApartments(response.data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error("Error fetching apartments:", error);
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [userRole, isApproved, user]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!user || userRole !== 'Οικοδεσπότης') {
        return <p>Access denied.</p>;
    }

    if (!isApproved) {
        return <p>Αναμονή για έγκριση απο την διαχείριση</p>;
    }

    return (
        <div>
            <h2>Your Apartments</h2>
            {apartments.map(apartment => (
                <div key={apartment.id}>
                    <p>{apartment.description}</p>
                </div>
            ))}
        </div>
    );
}

export default ApartmentManagement;
