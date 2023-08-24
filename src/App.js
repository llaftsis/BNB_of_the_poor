import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './style.css';
import Header from './Header';
import SearchForm from './SearchForm';
import Footer from './Footer';
import Login from './Login';

function App() {
  return (
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
  );
}

export default App;
