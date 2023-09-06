import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function UserDetails() {
    const { id } = useParams();
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Fetch user details from the server
        fetch(`https://localhost:5000/api/users/${id}`)
            .then(response => response.json())
            .then(data => setUser(data))
            .catch(error => console.error('Error fetching user details:', error));
    }, [id]);

    const handleApproval = async () => {
        try {
            const response = await fetch(`https://localhost:5000/api/users/${id}/approve-host`, {
                method: 'POST'
            });
            const data = await response.json();
    
            if (data.success) {
                alert('Ο χρήστης εγκρίθηκε ως οικοδεσπότης!');
                // Φόρτωση ξανά των στοιχείων του χρήστη
                fetch(`https://localhost:5000/api/users/${id}`)
                    .then(response => response.json())
                    .then(data => setUser(data))
                    .catch(error => console.error('Error fetching user details after approval:', error));

            } else {
                alert('Σφάλμα κατά την έγκριση: ' + data.error);
            }
        } catch (error) {
            console.error('Error during approval:', error);
            alert('Κάτι πήγε στραβά. Δοκιμάστε ξανά.');
        }
    };
    

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Στοιχεία Χρήστη</h2>
            <p>Όνομα: {user.firstName}</p>
            <p>Επίθετο: {user.lastName}</p>
            <p>Email: {user.email}</p>
            <p>Αριθμός: {user.phone}</p>
            <p>Ρόλος: {user.role}</p>
            {!user.isApproved && (
                <button onClick={handleApproval}>Εγκριση ως οικοδεσπότης</button>
            )}
        </div>
    );
}

export default UserDetails;
