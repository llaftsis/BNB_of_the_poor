import React, { useState, useContext } from 'react';
import RegistrationContext from './RegistrationContext';
import RegistrationWindow from './RegistrationWindow';
import AuthContext from './AuthContext';
import { useNavigate } from 'react-router-dom'; // Make sure you've installed react-router-dom

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { showingRegistration, setShowingRegistration } = useContext(RegistrationContext);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Call the backend API to authenticate the user
    const response = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
  
    const data = await response.json();
    if (data.success) {
      login({ username }); // Update the user context
      navigate('/');
    } else {
      alert(data.message);
    }
  };
 
  

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button type="submit" className="login-button">Login</button>
      </form>
      <button onClick={() => setShowingRegistration(true)}>Εγγραφή</button>
      {showingRegistration && <RegistrationWindow />}
    </div>
  );
}

export default Login;
