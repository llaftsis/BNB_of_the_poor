import React, { useState, useEffect } from 'react'; // <-- Import useEffect
import AuthContext from './AuthContext';

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Load user data from local storage when the component mounts
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    // Save user data to local storage on login
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    // Remove user data from local storage on logout
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
