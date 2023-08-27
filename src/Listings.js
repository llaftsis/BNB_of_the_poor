import './Listings.css';
import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';

function Listings() {
  // Sample listings data (in a real-world application, this would probably come from an API)
  const sampleListings = [
    { 
      id: 1, 
      name: 'Cozy Apartment', 
      location: 'New York', 
      description: 'A comfortable apartment in the heart of the city.',
      guests: 2,
      bedrooms: 1,
      beds: 1,
      price: 150,
      rating: 4.5,
      image: 'https://images.trvl-media.com/lodging/32000000/31890000/31888700/31888652/893ee936.jpg?impolicy=resizecrop&rw=598&ra=fit'
    },
    { 
      id: 2, 
      name: 'Beach House', 
      location: 'California', 
      description: 'A beautiful beachfront property with an amazing view.',
      guests: 5,
      bedrooms: 3,
      beds: 3,
      price: 300,
      rating: 4.7,
      image: 'https://i0.wp.com/files.tripstodiscover.com/files/2020/07/Unique-Cave-Architecture-House.jpg?resize=784%2C588'
    }
  ];

  return (
    <div>
        <section>
        <h2>Προτεινόμενοι χώροι</h2>
      </section>

      
        <div className="carousel-container">
        <div className="carousel-content">
        {sampleListings.map(listing => (
        <div key={listing.id} className="listing">
          <img src={listing.image} alt={listing.name} />
          <h2>{listing.name}</h2>
          <p>{listing.location}</p>
          <p>{listing.description}</p>
          <p>{listing.guests} guests · {listing.bedrooms} bedrooms · {listing.beds} beds</p>
          <p>${listing.price}/night</p>
          <p>Rating: {listing.rating} ⭐</p>
        </div>
      ))}
    </div>
    </div>
    </div>
  );
}

export default Listings;