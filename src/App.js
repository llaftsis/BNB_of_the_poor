// App.js
import React from 'react';
import './style.css';
import Header from './Header';
import SearchForm from './SearchForm';
import Footer from './Footer';


function App() {
  return (
    <div className="App">
      <Header />
      <SearchForm />
      <Footer />
    </div>
  );
}

export default App;