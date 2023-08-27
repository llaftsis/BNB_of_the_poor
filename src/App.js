// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './style.css';
import Header from './Header';
import SearchForm from './SearchForm';
import Footer from './Footer';
import Login from './Login';
import RegistrationContext from './RegistrationContext';
import AuthProvider from './AuthProvider';
import AboutUs from './AboutUs';
import ContactPage from './ContactPage';


function App() {
  const [showingRegistration, setShowingRegistration] = useState(false);

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
            </Routes>
            <Footer />
          </div>
        
      </RegistrationContext.Provider>
    </AuthProvider>
  );
}

export default App;
