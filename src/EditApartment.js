import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import AuthContext from './AuthContext';
import { useNavigate } from 'react-router-dom';


function EditApartment() {
    const { apartmentId } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    
    const [formData, setFormData] = useState({
        type_of_apartment: '',
        location: '',
        open_date: '',
        close_date: '',
        number_of_guests: '',
        min_price: '',
        additional_cost_per_person: '',
        rules: '',
        description: '',
        number_of_beds: '',
        number_of_bathrooms: '',
        number_of_rooms: '',
        living_room: '',
        square_meters: ''
    });
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/apartment/${apartmentId}`);
                const data = await response.json();
                
const convertDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0 indexed
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

data.open_date = convertDate(data.open_date);
data.close_date = convertDate(data.close_date);

setFormData(data);
            } catch (error) {
                console.error("Error fetching apartment data:", error);
            }
        };
        fetchData();
    }, [apartmentId]);
    
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/api/edit-apartment/${apartmentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user.id,
                    updatedData: formData
                }),
            });
            if (response.ok) {
                navigate(`/apartment/${apartmentId}`);
            } else {
                console.error("Error updating apartment.");
            }
        } catch (error) {
            console.error("Error updating apartment:", error);
        }
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <label>
                Type of Apartment:
                <select name="type_of_apartment" value={formData.type_of_apartment} onChange={handleChange}>
<option value="Room">Room</option>
<option value="Whole Apartment">Whole Apartment</option>
</select>
            </label>
            <label>
                Location:
                <select name="location" value={formData.location} onChange={handleChange}>
<option value="Athens">Athens</option>
<option value="Thessaloniki">Thessaloniki</option>
<option value="Crete">Crete</option>
</select>
            </label>
            
<label>
    Open Date:
    <input type="date" name="open_date" value={formData.open_date?.split("T")[0]} onChange={handleChange} />
</label>
<label>
    Close Date:
    <input type="date" name="close_date" value={formData.close_date?.split("T")[0]} onChange={handleChange} />
</label>

            <label>
                Number of guest:
                <input type="text" name="number_of_guests" value={formData.number_of_guests} onChange={handleChange} />
            </label>
            <label>
                Minimun Price:
                <input type="text" name="min_price" value={formData.min_price} onChange={handleChange} />
            </label>
            <label>
                Extra cost per person:
                <input type="text" name="additional_cost_per_person" value={formData.additional_cost_per_person} onChange={handleChange} />
            </label>
            <label>
                Apartment rules:
                <input type="text" name="rules" value={formData.rules} onChange={handleChange} />
            </label>
            <label>
                Apartment description:
                <input type="text" name="description" value={formData.description} onChange={handleChange} />
            </label>
            <label>
                Number of beds:
                <input type="text" name="number_of_beds" value={formData.number_of_beds} onChange={handleChange} />
            </label>
            <label>
                Number of bathrooms:
                <input type="text" name="number_of_bathrooms" value={formData.number_of_bathrooms} onChange={handleChange} />
            </label>
            <label>
                Number of rooms:
                <input type="text" name="number_of_rooms" value={formData.number_of_rooms} onChange={handleChange} />
            </label>
            <label>
                Living Room True or False:
                <input type="text" name="living_room" value={formData.living_room} onChange={handleChange} />
            </label>
            <label>
                Square Meters:
                <input type="text" name="square_meters" value={formData.square_meters} onChange={handleChange} />
            </label>
            <button type="submit">Save Changes</button>
        </form>
    );
}

export default EditApartment;