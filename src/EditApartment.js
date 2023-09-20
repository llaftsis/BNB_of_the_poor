
import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import AuthContext from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents, Icon, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const icon = new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

function EditApartment() {
    const { apartmentId } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [images, setImages] = useState([]);
const [stagedDeletions, setStagedDeletions] = useState([]);
const [stagedAdditions, setStagedAdditions] = useState([]);

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
        square_meters: '',
        exact_location: '',
        address: '',
        nickname: ''
    });

    const [mapCenter, setMapCenter] = useState([37.974514992024616,23.72909545898438]);  // default center
    function UpdateMapCenter() {
        const map = useMap();
        useEffect(() => {
            if (formData.exact_location) {
                const [lat, lng] = formData.exact_location.split(',').map(coord => parseFloat(coord));
                map.flyTo([lat, lng], 13);
            }
        }, [formData.exact_location, map]);
        return null;
    }
    useEffect(() => {
        if (formData.exact_location) {
            const [lat, lng] = formData.exact_location.split(',').map(coord => parseFloat(coord));
            setMapCenter([lat, lng]);
        }
    }, [formData.exact_location]);
    function DraggableMarker(props) {
        const [position, setPosition] = useState(props.initialPosition);
        const markerRef = React.useRef(null);
        const eventHandlers = {
            dragend() {
                const marker = markerRef.current;
                if (marker != null) {
                    const newPosition = marker.getLatLng();
                    setPosition(newPosition);
                    setFormData(prevData => ({
                        ...prevData,
                        exact_location: `${newPosition.lat},${newPosition.lng}`
                    }));
                }
            }
        };
        useEffect(() => {
            if (formData.exact_location) {
                const [lat, lng] = formData.exact_location.split(',');
                setPosition([parseFloat(lat), parseFloat(lng)]);
            }
        }, [formData.exact_location]);

        return <Marker draggable={true} position={position} ref={markerRef} eventHandlers={eventHandlers} icon={icon} />;
    }

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
                if (data.exact_location) {
                    const [lat, lng] = data.exact_location.split(',').map(coord => parseFloat(coord));
                    setMapCenter([lat, lng]); // set the map center to the exact_location of the apartment
                }

            } catch (error) {
                console.error("Error fetching apartment data:", error);
            }
        };
        fetchData();
    }, [apartmentId]);
    useEffect(() => {
        const fetchApartmentImages = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/apartment-images/${apartmentId}`);
                const data = await response.json();
                if (data.success) {
                    setImages(data.images);
                }
            } catch (error) {
                console.error('Error fetching apartment images:', error);
            }
        };
        fetchApartmentImages();
    }, [apartmentId]);
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    const handleStageDeleteImage = (imageUrl) => {
        setStagedDeletions(prevDeletions => [...prevDeletions, imageUrl]);
        setImages(prevImages => prevImages.filter(img => img !== imageUrl));
    };

    const handleStageUploadNewImages = (event) => {
        const files = Array.from(event.target.files);
        setStagedAdditions(prevAdditions => [...prevAdditions, ...files]);
    };

    const handleApplyStagedChanges = async () => {
        for (let imageUrl of stagedDeletions) {
            try {
                const response = await fetch(`http://localhost:5000/api/delete-image`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        apartmentId,
                        imageUrl
                    }),
                });

                if (!response.ok) {
                    throw new Error('Failed to delete image');
                }
            } catch (error) {
                console.error("Error deleting image:", error);
            }
        }

        // Handle image uploads
        if (stagedAdditions.length > 0) {
            const formData = new FormData();

            for (let file of stagedAdditions) {
                formData.append('images', file);
            }
            formData.append('apartmentId', apartmentId);

            try {
                const response = await fetch(`http://localhost:5000/api/upload-images`, {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    throw new Error('Failed to upload images');
                }

                const data = await response.json();

                // Check if uploadedImages exists and is an array before trying to spread it
                if (data.uploadedImages && Array.isArray(data.uploadedImages)) {
                    setImages(prevImages => [...prevImages, ...data.uploadedImages]);
                } else {
                    console.error("Unexpected structure for uploadedImages:", data.uploadedImages);
                }
            } catch (error) {
                console.error("Error uploading images:", error);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        await handleApplyStagedChanges();

        // Update apartment details
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

            if (!response.ok) {
                throw new Error('Failed to update apartment');
            }
            navigate(`/apartment/${apartmentId}`);
        } catch (error) {
            console.error("Error updating apartment:", error);
        }
    };
    const handleDeleteApartment = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/apartment/${apartmentId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                navigate('/apartment-management');
            } else {
                console.error("Error deleting apartment.");
            }
        } catch (error) {
            console.error("Error deleting apartment:", error);
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
            <label>
                Exact location coordinates:
                <input type="text" name="exact_location" value={formData.exact_location} onChange={handleChange} />
                <MapContainer center={mapCenter} zoom={13} style={{ height: '300px', width: '100%' }}>
                 <UpdateMapCenter />
                  <TileLayer
                   url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                   attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                   />
                    <DraggableMarker initialPosition={mapCenter} onMarkerPositionChange={(latLng) => {
                     setFormData(prevData => ({
                      ...prevData,
                     exact_location: `${latLng.lat},${latLng.lng}`
                      }));
                      }} />
               </MapContainer>
            </label>
            <label>
                Address:
                <input type="text" name="address" value={formData.address} onChange={handleChange} />
            </label>
            <label>
                Apartment Nickname:
                <input type="text" name="nickname" value={formData.nickname} onChange={handleChange} />
            </label>
            <h2>Apartment Images</h2>
            {images.map((imageUrl, index) => (
                <div key={index}>
                    <img src={`http://localhost:5000/${imageUrl}`} alt="Apartment" width="200" />
                    <button type="button" onClick={() => handleStageDeleteImage(imageUrl)}>Delete</button>
                </div>
            ))}
            <input type="file" multiple onChange={handleStageUploadNewImages} />

            <button type="submit">Save Changes</button>
            <button type="button" onClick={handleDeleteApartment} style={{backgroundColor: 'red', color: 'white'}}>
            Delete Apartment
        </button>
        </form>
    );
}

export default EditApartment;