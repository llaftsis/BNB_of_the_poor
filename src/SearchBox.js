// SearchBox.js
import React from 'react';
import './SearchBox.css';
import { useNavigate } from 'react-router-dom'; // Make sure you've installed react-router-dom



function SearchBox() {
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
  
    const checkInDate = e.target["check-in-date"].value;
    const checkOutDate = e.target["check-out-date"].value;
    const guests = e.target.guests.value;
    const city = e.target.city.value;
    const category = e.target.category.value;
  
    navigate(`/search?checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&guests=${guests}&city=${city}&category=${category}`);
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
          <option value="Athens">Αθήνα</option>
          <option value="Thessaloniki">Θεσσαλονίκη</option>
          <option value="Crete">Ηράκλειο</option>
        </select>

        <fieldset>
          <legend>Κατηγορία</legend>
          <input type="radio" id="rooms" name="category" value="Room" />
          <label htmlFor="rooms">Δωμάτια</label>
          <input type="radio" id="apartments" name="category" value="Whole Apartment" />
          <label htmlFor="apartments">Κατοικίες</label>
        </fieldset>

        <button className="search-button" type="submit">Αναζήτηση</button>
      </form>
    </div>
  );
}

export default SearchBox;
