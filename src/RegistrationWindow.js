import React, { useState, useContext } from 'react';
import RegistrationContext from './RegistrationContext';

function RegistrationWindow() {
  const { setShowingRegistration } = useContext(RegistrationContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Call the backend API to register the user
    const response = await fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password, email }),
    });

    const data = await response.json();
    console.log(data);  // Log the response from the server
    
    if (data.success) {
      alert("Επιτυχές");
      setShowingRegistration(false); // Close the registration window
    } else {
      // Handle registration error, e.g., show an error message to the user
      alert("Error during registration. Please try again.");
    }
    
  };


  return (
    <div className="registration-window">
      <button onClick={() => setShowingRegistration(false)}>Close</button>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
        <label>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <label>
          Email:
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default RegistrationWindow;