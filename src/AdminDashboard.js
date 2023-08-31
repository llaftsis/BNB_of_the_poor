import React, { useState, useEffect } from 'react';

function AdminDashboard() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        // Fetch users from the server.
        fetch('/api/users')
            .then(response => response.json())
            .then(data => setUsers(data))
            .catch(error => console.error('Error fetching users:', error));
    }, []);

    return (
        <div>
            <h2>Διαχείριση Χρηστών</h2>
            <ul>
                {users.map(user => (
                    <li key={user.id}>{user.username}</li>
                ))}
            </ul>
        </div>
    );
}

export default AdminDashboard;
