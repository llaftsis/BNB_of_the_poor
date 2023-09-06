import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@material-ui/core';

function UserProfile() {
    const { id } = useParams();
    const [user, setUser] = useState({});
    const [error, setError] = useState(null);
    const [isEditable, setIsEditable] = useState({
        username: false,
        email: false,
        firstName: false,
        lastName: false,
        phone: false
    });
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordChangeMsg, setPasswordChangeMsg] = useState(''); // To display success or error messages
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetch(`https://localhost:5000/api/users/${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch user');
                }
                return response.json();
            })
            .then(data => setUser(data))
            .catch(error => {
                console.error('Error fetching user details:', error);
                setError(error.message);
            });
    }, [id]);
    
    const toggleEdit = (field) => {
        setIsEditable(prevState => ({ ...prevState, [field]: !prevState[field] }));
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setUser(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(`https://localhost:5000/api/users/${user.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user)
            });

            if (!response.ok) {
                throw new Error('Failed to update user');
            }

            // Handle successful update (e.g., show a success message)
            console.log("User updated successfully!");
            window.location.reload();
        } catch (error) {
            console.error('Error updating user:', error);
            setError(error.message);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setPasswordChangeMsg("New passwords don't match.");
            return;
        }

        // Send the data to the backend
        const response = await fetch('https://localhost:5000/api/change-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: user.id, currentPassword, newPassword }),
        });

        const data = await response.json();
        setPasswordChangeMsg(data.message);

        setIsModalOpen(false); // Close the modal after password change
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input 
                        type="text" 
                        name="username" 
                        value={user.username || ''} 
                        onChange={handleChange} 
                        disabled={!isEditable.username}
                    />
                    <span onClick={() => toggleEdit('username')}>🖊️</span>
                </div>
                <div>
                    <label>Email:</label>
                    <input 
                        type="email" 
                        name="email" 
                        value={user.email || ''} 
                        onChange={handleChange} 
                        disabled={!isEditable.email}
                    />
                    <span onClick={() => toggleEdit('email')}>🖊️</span>
                </div>
                <div>
                    <label>First Name:</label>
                    <input 
                        type="text" 
                        name="firstName" 
                        value={user.firstName || ''} 
                        onChange={handleChange} 
                        disabled={!isEditable.firstName}
                    />
                    <span onClick={() => toggleEdit('firstName')}>🖊️</span>
                </div>
                <div>
                    <label>Last Name:</label>
                    <input 
                        type="text" 
                        name="lastName" 
                        value={user.lastName || ''} 
                        onChange={handleChange} 
                        disabled={!isEditable.lastName}
                    />
                    <span onClick={() => toggleEdit('lastName')}>🖊️</span>
                </div>
                <div>
                    <label>Phone:</label>
                    <input 
                        type="text" 
                        name="phone" 
                        value={user.phone || ''} 
                        onChange={handleChange} 
                        disabled={!isEditable.phone}
                    />
                    <span onClick={() => toggleEdit('phone')}>🖊️</span>
                </div>
                <button type="submit">Ενημέρωση</button>
            </form>

            {/* Change Password Button and Modal */}
            <Button variant="contained" color="primary" onClick={() => setIsModalOpen(true)}>
                Change Password
            </Button>

            <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Change Password</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Current Password"
                        type="password"
                        fullWidth
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="New Password"
                        type="password"
                        fullWidth
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Confirm New Password"
                        type="password"
                        fullWidth
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsModalOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handlePasswordChange} color="primary">
                        Change Password
                    </Button>
                </DialogActions>
            </Dialog>

            {passwordChangeMsg && <p>{passwordChangeMsg}</p>}
            {error && <p>Error: {error}</p>}
        </div>
    );
}

export default UserProfile;
