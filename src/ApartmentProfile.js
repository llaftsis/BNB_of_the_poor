import React, { useState, useEffect, useContext } from 'react';
import { useLocation,useParams, Link } from 'react-router-dom';
import AuthContext from './AuthContext';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {
    Container, Typography, Grid, Paper, Box, Button,
    CardMedia, Divider, TextareaAutosize, FormControl, 
    InputLabel, Select, MenuItem
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
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const checkInDate = searchParams.get('checkInDate');
    const checkOutDate = searchParams.get('checkOutDate');
    const [reviews, setReviews] = useState([]);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [userReview, setUserReview] = useState('');
    const [userRating, setUserRating] = useState(5);

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
                userId: user.username,
                start_date: checkInDate.split('T')[0],
                end_date: checkOutDate.split('T')[0],
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
    const handleReviewSubmit = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    apartment_id: apartmentId,
                    username: user.username,
                    rating: userRating,
                    comment: userReview
                })
            });
    
            const data = await response.json();
    
            if (response.ok) {
                setReviews(prevReviews => [...prevReviews, {
                    review_id: data.insertId, 
                    apartment_id: apartmentId,
                    username: user.username,
                    rating: userRating,
                    comment: userReview,
                    review_date: new Date().toISOString().split('T')[0] // Current date
                }]);
                setUserReview('');
                setUserRating(5);
            } else {
                console.error(data.error);
            }
        } catch (error) {
            console.error('Error submitting the review:', error);
        }
    };
    
    
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/reviews/${apartmentId}`);
                const data = await response.json();
                console.log("Fetched reviews:", data);
                setReviews(data);
            } catch (error) {
                console.error("Error fetching apartment reviews:", error);
            }
        };
        fetchReviews();
    }, [apartmentId]); // Dependency array includes id to refetch when apartment id changes

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
                        ΚΡΑΤΗΣΗ
                    </Button>
                </Box>
            ) : (
                <Box mt={4}>
                    <Typography variant="h6" color="textSecondary">Loading apartment details...</Typography>
                </Box>
            )}
<Box mt={4}>
    {user?.role === 'Ενοικιαστής' ? (
        <>
            <Button 
                variant="contained" 
                color="primary" 
                onClick={() => setShowReviewForm(prevState => !prevState)}
            >
                Add Review
            </Button>

            {showReviewForm && (
                <Box mt={4}>
                    <TextareaAutosize 
                        minRows ={4}
                        placeholder="Write your review here"
                        value={userReview}
                        onChange={e => setUserReview(e.target.value)}
                        style={{ width: '100%', marginBottom: '10px' }}
                    />
                    <FormControl variant="outlined" style={{ marginBottom: '10px', width: '150px' }}>
                        <InputLabel id="rating-label">Rating</InputLabel>
                        <Select
                            labelId="rating-label"
                            value={userRating}
                            onChange={e => setUserRating(Number(e.target.value))}
                            label="Rating"
                        >
                            <MenuItem value={5}>5 Stars</MenuItem>
                            <MenuItem value={4}>4 Stars</MenuItem>
                            <MenuItem value={3}>3 Stars</MenuItem>
                            <MenuItem value={2}>2 Stars</MenuItem>
                            <MenuItem value={1}>1 Star</MenuItem>
                        </Select>
                    </FormControl>
                    <Button variant="contained" color="secondary" onClick={handleReviewSubmit}>
                        Submit Review
                    </Button>
                </Box>
            )}
        </>
    ) : (
        <Typography variant="body1" color="error">Not allowed</Typography>
    )}
</Box>

            {/* Displaying Reviews */}
            <Box mt={4}>
                <Typography variant="h6">Reviews</Typography>
                {reviews.length === 0 ? (
                    <Typography variant="body1">No reviews for this apartment yet.</Typography>
                ) : (
                    reviews.map(review => (
                        <Box key={review.review_id} mt={2} mb={2} p={2} border={1} borderColor="grey.300" borderRadius={5}>
                            <Typography variant="h6">{review.username} rated this {review.rating} stars</Typography>
                            <Typography variant="body1">{review.comment}</Typography>
                            <Typography variant="caption">Reviewed on: {new Date(review.review_date).toLocaleDateString()}</Typography>
                        </Box>
                    ))
                )}
            </Box>
        </Container>
    );
}
    
export default ApartmentProfile;
