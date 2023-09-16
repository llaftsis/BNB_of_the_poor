import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import AuthContext from './AuthContext';
import { Link } from 'react-router-dom';

function ApartmentProfile() {
    const { apartmentId } = useParams();  // Get apartment ID from the URL
    const [apartment, setApartment] = useState(null);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/apartment/${apartmentId}`);
                const data = await response.json();
                setApartment(data);
            } catch (error) {
                console.error("Error fetching apartment data:", error);
            }
        };
    
        fetchData();
    }, [apartmentId]);
    

    return (
        <div>
            {apartment ? (
                <>
                    <h2>{apartment.type_of_apartment} in {apartment.location}</h2>
                    <p>Open Date: {apartment.open_date}</p>
                    <p>Close Date: {apartment.close_date}</p>
                    <p>Number of Guests: {apartment.number_of_guests}</p>
                    <p>Min Price: {apartment.min_price}</p>
                    <p>Additional Cost Per Person: {apartment.additional_cost_per_person}</p>
                    <p>Rules: {apartment.rules}</p>
                    <p>Description: {apartment.description}</p>
                    <p>Number of Beds: {apartment.number_of_beds}</p>
                    <p>Number of Bathrooms: {apartment.number_of_bathrooms}</p>
                    <p>Number of Rooms: {apartment.number_of_rooms}</p>
                    <p>Living Room: {apartment.living_room ? "Yes" : "No"}</p>
                    <p>Square Meters: {apartment.square_meters}</p>
                    <h3>Owner's Username: {apartment.username}</h3>
                    {user?.id === apartment?.owner_id && <Link to={`/edit-apartment/${apartment.id}`}>Edit</Link>}
                </>
            ) : (
                <p>Loading apartment details...</p>
            )}
        </div>
    );
    
    
}

export default ApartmentProfile;
