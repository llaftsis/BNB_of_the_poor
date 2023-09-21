import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import AuthContext from './AuthContext';
import { Link } from 'react-router-dom';
//import './style.css';
import { MapContainer, TileLayer, Marker, Icon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Container, Typography, Grid, Paper, Box, Button, CardMedia, Card, Divider, CardContent} from '@material-ui/core';
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
    
    const handleImageClick = (imageUrl) => {
        setMainImage(imageUrl);
    };

    return (
        <Container>
            {apartment ? (
                <Box mt={4} >
                    <Typography variant="h4" color="primary">{apartment.nickname}</Typography>
                    <Typography variant="subtitle1" color="textSecondary">{apartment.type_of_apartment} in {apartment.location}</Typography>
                    {mainImage && <CardMedia component="img" image={`http://localhost:5000/${mainImage}`}
                    style={{ height: '400px', width: '100%', objectFit: 'contain', margin: '20px 0' }} />
                    }
                    <Box mt={3}>
                    <Grid container spacing={2}>
                        {images.map((imageUrl, index) => (
                            <Grid item xs={4} key={index}>
                                <Paper elevation={3} onClick={() => handleImageClick(imageUrl)} style={{ cursor: 'pointer' }}>
                                    <CardMedia component="img" image={`http://localhost:5000/${imageUrl}`} alt="Apartment" style={{ height: '150px' }} />
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                    </Box>
                    <Box mt={3}>

                        <Typography variant="h6" gutterBottom>Details:</Typography>
                        <Divider variant="middle" />

                    <Box display="flex" alignItems="center" mt={1} mb={1}>
                        <DateRangeIcon color="action" style={{ marginRight: 8 }} />
                        <Typography variant="subtitle1" color="textSecondary">Available from:</Typography>
                        <Typography variant="body2" style={{ marginLeft: 8 }}>{new Date(apartment.open_date).toISOString().split('T')[0]}</Typography>
                    </Box>
                        <Divider variant="middle" />

                    <Box display="flex" alignItems="center" mt={1} mb={1}>
                        <DateRangeIcon color="action" style={{ marginRight: 8 }} />
                        <Typography variant="subtitle1" color="textSecondary">Close Date:</Typography>
                        <Typography variant="body2" style={{ marginLeft: 8 }}>{new Date(apartment.close_date).toISOString().split('T')[0]}</Typography>
                    </Box>
                        <Divider variant="middle" />

                    <Box display="flex" alignItems="center" mt={1} mb={1}>
                        <PeopleIcon color="action" style={{ marginRight: 8 }} />
                        <Typography variant="subtitle1" color="textSecondary">Number of Guests:</Typography>
                        <Typography variant="body2" style={{ marginLeft: 8 }}>{apartment.number_of_guests}</Typography>
                    </Box>
                        <Divider variant="middle" />

                    <Box display="flex" alignItems="center" mt={1} mb={1}>
                        <AttachMoneyIcon color="action" style={{ marginRight: 8 }} />
                        <Typography variant="subtitle1" color="textSecondary">Starting price:</Typography>
                        <Typography variant="body2" style={{ marginLeft: 8 }}>{apartment.min_price}</Typography>
                    </Box>
                        <Divider variant="middle" />

                    <Box display="flex" alignItems="center" mt={1} mb={1}>
                        <AttachMoneyIcon color="action" style={{ marginRight: 8 }} />
                        <Typography variant="subtitle1" color="textSecondary">Additional Cost Per Person:</Typography>
                        <Typography variant="body2" style={{ marginLeft: 8 }}>{apartment.additional_cost_per_person}</Typography>
                    </Box>
                        <Divider variant="middle" />

                    <Box display="flex" alignItems="center" mt={1} mb={1}>
                        <RuleIcon color="action" style={{ marginRight: 8 }} />
                        <Typography variant="subtitle1" color="textSecondary">Rules:</Typography>
                        <Typography variant="body1" style={{ marginLeft: 8 }}>{apartment.rules}</Typography>
                    </Box>
                        <Divider variant="middle" />

                    <Box display="flex" alignItems="center" mt={1} mb={1}>
                        <DescriptionIcon color="action" style={{ marginRight: 8 }} />
                        <Typography variant="subtitle1" color="textSecondary">Description:</Typography>
                        <Typography variant="body1" style={{ marginLeft: 8 }}>{apartment.description}</Typography>
                    </Box>
                        <Divider variant="middle" />

                    <Box display="flex" alignItems="center" mt={1} mb={1}>
                        <HotelIcon color="action" style={{ marginRight: 8 }} />
                        <Typography variant="subtitle1" color="textSecondary">Number of Beds:</Typography>
                        <Typography variant="body2" style={{ marginLeft: 8 }}>{apartment.number_of_beds}</Typography>
                    </Box>
                        <Divider variant="middle" />

                    <Box display="flex" alignItems="center" mt={1} mb={1}>
                        <BathtubIcon color="action" style={{ marginRight: 8 }} />
                        <Typography variant="subtitle1" color="textSecondary">Number of Bathrooms:</Typography>
                        <Typography variant="body2" style={{ marginLeft: 8 }}>{apartment.number_of_bathrooms}</Typography>
                    </Box>
                        <Divider variant="middle" />

                    <Box display="flex" alignItems="center" mt={1} mb={1}>
                        <MeetingRoomIcon color="action" style={{ marginRight: 8 }} />
                        <Typography variant="subtitle1" color="textSecondary">Number of Rooms:</Typography>
                        <Typography variant="body2" style={{ marginLeft: 8 }}>{apartment.number_of_rooms}</Typography>
                    </Box>
                        <Divider variant="middle" />

                    <Box display="flex" alignItems="center" mt={1} mb={1}>
                        <LiveTvIcon color="action" style={{ marginRight: 8 }} />
                        <Typography variant="subtitle1" color="textSecondary">Living Room:</Typography>
                        <Typography variant="body2" style={{ marginLeft: 8 }}>{apartment.living_room ? "Yes" : "No"}</Typography>
                    </Box>
                        <Divider variant="middle" />

                    <Box display="flex" alignItems="center" mt={1} mb={1}>
                        <HomeIcon color="action" style={{ marginRight: 8 }} />
                        <Typography variant="subtitle1" color="textSecondary">Square Meters:</Typography>
                        <Typography variant="body2" style={{ marginLeft: 8 }}>{apartment.square_meters}</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" mt={1} mb={1}>
                        <LocationOnIcon color="action" style={{ marginRight: 8 }} />
                        <Typography variant="subtitle1" color="textSecondary">Exact Location:</Typography>
                        <Typography variant="body2" style={{ marginLeft: 8 }}>{apartment.exact_location}</Typography>
                    </Box>
                        <Divider variant="middle" />
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
                        <Typography variant="subtitle1" color="textSecondary">Owner: </Typography>
                        <Typography variant="body2" style={{ marginLeft: 8 }}>{apartment.username}</Typography>
                    </Box>

                    {user?.id === apartment?.owner_id && <Box mt={3}>
                            <Button variant="contained" color="primary" component={Link} to={`/edit-apartment/${apartment.id}`}>Edit</Button>
                        </Box>
                    }
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
