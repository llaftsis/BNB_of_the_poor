import React, { useState } from 'react';

function SearchFilters({ onFilterChange }) {
  const [roomType, setRoomType] = useState('all');
  const [maxCost, setMaxCost] = useState('');
  const [amenities, setAmenities] = useState({
    wifi: false,
    cooling: false,
    heating: false,
    kitchen: false,
    tv: false,
    parking: false,
    elevator: false
  });

  const handleAmenityChange = (e) => {
    setAmenities({
      ...amenities,
      [e.target.name]: e.target.checked
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilterChange({ roomType, maxCost, amenities });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>

        {/* Filter for room type */}
        <select value={roomType} onChange={(e) => setRoomType(e.target.value)}>
          <option value="all">All Types</option>
          <option value="private">Private Room</option>
          <option value="shared">Shared Room</option>
          <option value="entire">Entire Residence</option>
        </select>

        {/* Filter for max cost */}
        <input 
          type="number" 
          placeholder="Max Cost" 
          value={maxCost} 
          onChange={(e) => setMaxCost(e.target.value)} 
        />

        {/* Filter for amenities */}
        <div>
          <label>
            <input 
              type="checkbox" 
              name="wifi" 
              checked={amenities.wifi} 
              onChange={handleAmenityChange} 
            />
            Wi-Fi
          </label>
          {/* ... Add similar checkboxes for other amenities ... */}
        </div>

        <button type="submit">Apply Filters</button>
      </form>
    </div>
  );
}

export default SearchFilters; 