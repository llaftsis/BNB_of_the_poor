// SearchBox.js
import React from 'react';
import './SearchBox.css';
import { useNavigate } from 'react-router-dom'; // Make sure you've installed react-router-dom



function SearchBox() {
  const navigate = useNavigate();

const handleSearch = (e) => {
  e.preventDefault();  // Prevent the default form submission behavior
  navigate('/search');  // Navigate to the SearchResults page
};

  return (
    <div className="search-container">
        <form className="search-form" onSubmit={handleSearch}>
        <label htmlFor="check-in-date">Check-in:</label>
        <input type="date" id="check-in-date" name="check-in-date" required />

        <label htmlFor="check-out-date">Check-out:</label>
        <input type="date" id="check-out-date" name="check-out-date" required />

        <label htmlFor="guests">Αριθμός ατόμων:</label>
        <input type="number" id="guests" name="guests" min="1" max="6" required />

        <label htmlFor="city">Πόλη:</label>
        <select id="city" name="city">
          <option value="athens">Αθήνα</option>
          <option value="thessaloniki">Θεσσαλονίκη</option>
          <option value="heraklion">Ηράκλειο</option>
        </select>

        <fieldset>
          <legend>Κατηγορία</legend>
          <input type="radio" id="rooms" name="category" value="rooms" />
          <label htmlFor="rooms">Δωμάτια</label>
          <input type="radio" id="apartments" name="category" value="apartments" />
          <label htmlFor="apartments">Κατοικίες</label>
          <input type="radio" id="hotels" name="category" value="hotels" />
          <label htmlFor="hotels">Ξενοδοχεία</label>
        </fieldset>

        <button className="search-button" type="submit">Αναζήτηση</button>
      </form>
    </div>
  );
}

export default SearchBox;