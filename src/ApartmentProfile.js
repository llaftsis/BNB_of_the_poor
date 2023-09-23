import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import AuthContext from './AuthContext';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {
    Container, Typography, Grid, Paper, Box, Button,
    CardMedia, Divider
} from '@material-ui/core';
import {
    DateRange as DateRangeIcon,
    People as PeopleIcon,
    AttachMoney as AttachMoneyIcon,
    Rule as RuleIcon,
    Description as DescriptionIcon,
    Hotel as HotelIcon,
    Bathtub as BathtubIcon,
    MeetingRoom as MeetingRoomIcon,
    LiveTv as LiveTvIcon,
    Home as HomeIcon,
    LocationOn as LocationOnIcon,
} from '@mui/icons-material';

const icon = new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

function ApartmentProfile() {
    const { apartmentId } = useParams();  // Get apartment ID from the URL
    const [apartment, setApartment] = useState(null);
    const { user } = useContext(AuthContext);
    const [images, setImages] = useState([]);
    const [mainImage, setMainImage] = useState('');

    useEffect(() => {
        // Fetch apartment details
        const fetchApartmentDetails = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/apartment/${apartmentId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch apartment details');
                }
                const data = await response.json();
                setApartment(data);
            } catch (error) {
                console.error("Error fetching apartment data:", error);
            }
        };
    
        // Fetch apartment images
        const fetchApartmentImages = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/apartment-images/${apartmentId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch apartment images');
                }
                const data = await response.json();
                if (data.success) {
                    setImages(data.images);
                }
            } catch (error) {
                console.error('Error fetching apartment images:', error);
            }
        };

        // Execute the fetch functions
        fetchApartmentDetails();
        fetchApartmentImages();
    
    }, [apartmentId]);

    const handleReservation = async () => {
        if (!user || user.role !== 'Ενοικιαστής') {
            alert('Please log in as Ενοικιαστής to proceed with the reservation.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/reserve/${apartmentId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: user.id,
                start_date: apartment.open_date.split('T')[0],
                end_date: apartment.close_date.split('T')[0],
            })
        });
            const data = await response.json();
            if (data.success != false) {
                alert('Reservation confirmed!');
            } else {
                alert(data.error || 'Reservation already exists.');
            }
        } catch (error) {
            console.error('Error during reservation:', error);
        }
    };
    
    
    const handleImageClick = (imageUrl) => {
        setMainImage(imageUrl);
    };

    return (
        <Container>
            {apartment ? (
                <Box mt={4}>
                    {/* Apartment Details */}
                    <Typography variant="h4" color="primary">{apartment.nickname}</Typography>
                    <Typography variant="subtitle1" color="textSecondary">{apartment.type_of_apartment} in {apartment.location}</Typography>
                    {mainImage && 
                        <CardMedia 
                            component="img" 
                            image={`http://localhost:5000/${mainImage}`}
                            style={{ height: '400px', width: '100%', objectFit: 'contain', margin: '20px 0' }} 
                        />
                    }
                    <Box mt={3}>
                        <Grid container spacing={2}>
                            {images.map((imageUrl, index) => (
                                <Grid item xs={4} key={index}>
                                    <Paper elevation={3} onClick={() => handleImageClick(imageUrl)} style={{ cursor: 'pointer' }}>
                                        <CardMedia 
                                            component="img" 
                                            image={`http://localhost:5000/${imageUrl}`} 
                                            alt="Apartment" 
                                            style={{ height: '150px' }} 
                                        />
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                    <Box mt={3}>
    <Typography variant="h6" gutterBottom>Details:</Typography>
    <Divider variant="middle" />

    {[
        [DateRangeIcon, "Available from:", new Date(apartment.open_date).toISOString().split('T')[0]],
        [DateRangeIcon, "Close Date:", new Date(apartment.close_date).toISOString().split('T')[0]],
        [PeopleIcon, "Number of Guests:", apartment.number_of_guests],
        [AttachMoneyIcon, "Starting price:", apartment.min_price],
        [AttachMoneyIcon, "Additional Cost Per Person:", apartment.additional_cost_per_person],
        [RuleIcon, "Rules:", apartment.rules],
        [DescriptionIcon, "Description:", apartment.description],
        [HotelIcon, "Number of Beds:", apartment.number_of_beds],
        [BathtubIcon, "Number of Bathrooms:", apartment.number_of_bathrooms],
        [MeetingRoomIcon, "Number of Rooms:", apartment.number_of_rooms],
        [LiveTvIcon, "Living Room:", apartment.living_room ? "Yes" : "No"],
        [HomeIcon, "Square Meters:", apartment.square_meters],
        [LocationOnIcon, "Exact Location:", apartment.exact_location]
    ].map(([IconComponent, label, value], index) => (
        <Box key={index} display="flex" alignItems="center" mt={1} mb={1}>
            <IconComponent color="action" style={{ marginRight: 8 }} />
            <Typography variant="subtitle1" color="textSecondary">{label}</Typography>
            <Typography variant="body2" style={{ marginLeft: 8 }}>{value}</Typography>
            <Divider variant="middle" />
        </Box>
    ))}
</Box>

                    <Box mt={4} style={{ height: '300px' }}>
                        <MapContainer
                            center={apartment.exact_location.split(',').map(coord => parseFloat(coord))}
                            zoom={13}
                            style={{ height: '100%', width: '100%' }}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            <Marker
                                position={apartment.exact_location.split(',').map(coord => parseFloat(coord))}
                                icon={icon}
                            />
                        </MapContainer>
                    </Box>
                    <Box display="flex" alignItems="center" mt={1} mb={1}>
                        <LocationOnIcon color="action" style={{ marginRight: 8 }} />
                        <Typography variant="subtitle1" color="textSecondary">Address:</Typography>
                        <Typography variant="body2" style={{ marginLeft: 8 }}>{apartment.address}</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" mt={1} mb={1}>
                        <PeopleIcon color="action" style={{ marginRight: 8 }} />
                        <Typography variant="subtitle1" color="textSecondary">Owner:</Typography>
                        <Typography variant="body2" style={{ marginLeft: 8 }}>{apartment.username}</Typography>
                    </Box>

                    {user?.id === apartment?.owner_id && 
                        <Link to={`/edit-apartment/${apartment.id}`}>Edit</Link>
                    }
                    <Button 
                        onClick={handleReservation} 
                        style={{
                            backgroundColor: "#007BFF",
                            color: "white",
                            padding: "10px 20px",
                            borderRadius: "5px",
                            cursor: "pointer",
                            marginTop: "20px",
                            border: "none",
                            fontSize: "16px",
                            display: "block"
                        }}
                    >
                        Επιβεβαίωση Κράτησης
                    </Button>
                </Box>
            ) : (
                <Box mt={4}>
                    <Typography variant="h6" color="textSecondary">Loading apartment details...</Typography>
                </Box>
            )}
        </Container>
    );
}
    
export default ApartmentProfile;
