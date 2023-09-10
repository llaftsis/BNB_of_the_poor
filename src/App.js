// App.js
import React, { useState, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
//import { AuthProvider } from './AuthProvider';
import './style.css';
import Header from './Header';
import SearchForm from './SearchForm';
import Footer from './Footer';
import Login from './Login';
import RegistrationContext from './RegistrationContext';
import AuthProvider from './AuthProvider';
import AuthContext from './AuthContext';
import AboutUs from './AboutUs';
import ContactPage from './ContactPage';
import AdminDashboard from './AdminDashboard';
import UserDetails from './UserDetails';
import UserProfile from './UserProfile';
import ApartmentManagement from './ApartmentManagement';

function App() {
  const [showingRegistration, setShowingRegistration] = useState(false);
  const { user } = useContext(AuthContext);

  return (
    <AuthProvider>
      <RegistrationContext.Provider value={{ showingRegistration, setShowingRegistration }}>
        
          <div className="App">
            <Header />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<SearchForm />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/user-details/:id" element={<UserDetails />} />
              <Route path="/users/:id" element={<UserProfile />} />
              <Route path="/apartment-management" element={<ApartmentManagement user={user} />} />
            </Routes>
            <Footer />
          </div>
        
      </RegistrationContext.Provider>
    </AuthProvider>
  );
}

export default App;
