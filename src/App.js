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

function App() {
  const [showingRegistration, setShowingRegistration] = useState(false);

  return (
    <AuthProvider>
      <RegistrationContext.Provider value={{ showingRegistration, setShowingRegistration }}>
        <Router>
          <div className="App">
            <Header />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<SearchForm />} />
            </Routes>
            <Footer />
          </div>
        </Router>
      </RegistrationContext.Provider>
    </AuthProvider>
  );
}

export default App;
