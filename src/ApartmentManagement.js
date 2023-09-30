import React, { useState, useEffect, useContext } from 'react';
import AuthContext from './AuthContext';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';


import {
    Button, Tooltip, Fab, Dialog, TextField, Grid, makeStyles, Select, MenuItem, FormControl, InputLabel, Checkbox, FormControlLabel
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { Link } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import { Typography, Card, CardActionArea, CardContent } from '@material-ui/core';



const useStyles = makeStyles((theme) => ({
    container: {
        padding: theme.spacing(4),
        margin: '0 auto',
        maxWidth: '1200px', // Limiting max-width for larger screens
    },
    apartmentList: {
        display: 'grid',
        gridGap: theme.spacing(2),
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', // This creates a responsive grid layout
    },
    apartmentCard: {
        transition: 'transform 0.3s ease',
        '&:hover': {
            transform: 'scale(1.03)' // Slight zoom effect on hover
        }
    },
    apartmentContent: {
        textAlign: 'center'
    },
    dialogContainer: {
        padding: theme.spacing(2)
    },
    submitButton: {
        marginTop: theme.spacing(2),
    },
    mapContainer: {
        marginTop: theme.spacing(2),
    },
    formSection: {
        marginBottom: theme.spacing(4),
    },
    formSectionTitle: {
        marginBottom: theme.spacing(2),
    },
    formControl: {
        width: '100%',
        marginBottom: theme.spacing(2)
    },
    dialogContent: {
        padding: theme.spacing(2),
    },
    dialogTitle: {
        marginBottom: theme.spacing(2)
    },
    gridContainer: {
        marginBottom: theme.spacing(2)
    },
}));



const ApartmentManagement = () => {
        const [mapCenter, setMapCenter] = useState([37.974514992024616,23.72909545898438]);  // default center
        const [uploadedImages, setUploadedImages] = useState([]);

function UpdateMapCenter() {
    const map = useMap();
    useEffect(() => {
        if (newApartment.exact_location) {
            const [lat, lng] = newApartment.exact_location.split(',').map(coord => parseFloat(coord));
            map.flyTo([lat, lng], 13);
        }
    }, [newApartment.exact_location, map]);
    return null;
}

function DraggableMarker(props) {
    const [position, setPosition] = useState(props.initialPosition);
    const markerRef = React.useRef(null);
    const eventHandlers = {
        dragend() {
            const marker = markerRef.current;
            if (marker != null) {
                const newPosition = marker.getLatLng();
                setPosition(newPosition);
                setNewApartment(prevData => ({
                    ...prevData,
                    exact_location: `${newPosition.lat},${newPosition.lng}`
                }));
            }
        }
    };
    useEffect(() => {
        if (newApartment.exact_location) {
            const [lat, lng] = newApartment.exact_location.split(',');
            setPosition([parseFloat(lat), parseFloat(lng)]);
        }
    }, [newApartment.exact_location]);

    return <Marker draggable={true} position={position} ref={markerRef} eventHandlers={eventHandlers} icon={icon} />;
}

const icon = new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

    const [apartments, setApartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);  // State to control the dialog for adding apartment
    const { user } = useContext(AuthContext);
    const userRole = user && user.role;
    const isApproved = user && user.isApproved;
    const classes = useStyles();
    const [newApartment, setNewApartment] = useState({});

    const theme = createTheme({
        palette: {
          primary: {
            main: '#ffffff', // This is white
          },
          secondary: {
            main: '#0000FF', // This is blue
          },
        },
      });
    
      useEffect(() => {
        if (user && userRole === 'Οικοδεσπότης' && isApproved) {
            const fetchUserApartments = async () => {
                try {
                    const response = await fetch(`http://localhost:5000/api/apartments/${user.id}`);
                    const data = await response.json();
                    setApartments(data);
                } catch (error) {
                    console.error("Error fetching user's apartments:", error);
                }
                setLoading(false);
            };
            fetchUserApartments();
        } else {
            setLoading(false);
        }
    }, [user, userRole, isApproved]);

    const handleChange = event => {
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        setNewApartment({
          ...newApartment,
          [event.target.name]: value
        });
      };
      const handleImageSelection = (event) => {
        const files = event.target.files;
        setUploadedImages([...files]);
    };
    const handleImageUpload = async (apartmentId) => {
        const formData = new FormData();
        uploadedImages.forEach(image => {
            formData.append('images', image);
        });
        formData.append('apartmentId', apartmentId);
    
        try {
            const response = await fetch('http://localhost:5000/api/upload-images', {
                method: 'POST',
                body: formData
            });
    
            const responseData = await response.json();
    
            if (!responseData.success) {
                alert('Error uploading images.');
            }
        } catch (error) {
            console.error('Error uploading images:', error);
        }
    };

      const handleSubmit = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/apartments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...newApartment,
                    owner_id: user.id
                })
            });

            const responseData = await response.json();

            if (responseData.success) {
                setApartments(prevApartments => [...prevApartments, responseData.apartment]);
                // Call the handleImageUpload function with the new apartment's ID
                handleImageUpload(responseData.apartment.id);
                handleClose();
            } else {
                alert('Error adding apartment.');
            }
        } catch (error) {
            console.error('Error submitting apartment:', error);
        }
    };


    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!user || userRole !== 'Οικοδεσπότης') {
        return <p>Access denied.</p>;
    }

    if (!isApproved) {
        return <p>Αναμονή για έγκριση απο την διαχείριση</p>;
    }


    return (
        <ThemeProvider theme={theme}>
            <div className={classes.container}>
                <Typography variant="h4" component="h2" gutterBottom>
                Your Apartments
            </Typography>
            <div className={classes.apartmentList}>
                {apartments.map(apartment => (
                    <Card key={apartment.id} className={classes.apartmentCard}>
                        <CardActionArea component={Link} to={`/apartment/${apartment.id}`}>
                            <CardContent className={classes.apartmentContent}>
                                <Typography variant="h6">
                                    {apartment.nickname}
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                ))}
            </div>
                <Tooltip title="Add Apartment" aria-label="add">
                    <Fab color="secondary" className={classes.fab} onClick={handleOpen}>
                        <AddIcon />
                    </Fab>
                </Tooltip>
                <Dialog 
            open={open} 
            onClose={handleClose}
            PaperProps={{ 
                style: { backgroundColor: theme.palette.primary.main, color: theme.palette.secondary.main },
                className: classes.dialogContent
            }}>
            <div className={classes.dialogTitle}>
                <h3>Add Apartment</h3>
            </div>
            <Grid container spacing={2} className={classes.gridContainer}>
                <Grid item xs={6}>
                    <TextField label="Open Date" type="date" name="open_date" value={newApartment.open_date || ''} onChange={handleChange} fullWidth />
                </Grid>
                <Grid item xs={6}>
                    <TextField label="Close Date" type="date" name="close_date" value={newApartment.close_date || ''} onChange={handleChange} fullWidth />
                </Grid>
                <Grid item xs={6}>
                    <TextField label="Minimum Price" type="number" name="min_price" value={newApartment.min_price || ''} onChange={handleChange} fullWidth />
                </Grid>
                <Grid item xs={6}>
                    <TextField label="Additional Cost Per Person" type="number" name="additional_cost_per_person" value={newApartment.additional_cost_per_person || ''} onChange={handleChange} fullWidth />
                </Grid>
                <Grid item xs={6}>
                    <TextField label="Number of Guests" type="number" name="number_of_guests" value={newApartment.number_of_guests || ''} onChange={handleChange} fullWidth />
                </Grid>
                <Grid item xs={6}>
                    <FormControl className={classes.formControl}>
                        <InputLabel>Location</InputLabel>
                        <Select name="location" value={newApartment.location || ''} onChange={handleChange}>
                            <MenuItem value={'Athens'}>Athens</MenuItem>
                            <MenuItem value={'Thessaloniki'}>Thessaloniki</MenuItem>
                            <MenuItem value={'Crete'}>Crete</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={6}>
                    <FormControl className={classes.formControl}>
                        <InputLabel>Type of Apartment</InputLabel>
                        <Select name="type_of_apartment" value={newApartment.type_of_apartment || ''} onChange={handleChange}>
                            <MenuItem value={'Room'}>Room</MenuItem>
                            <MenuItem value={'Whole Apartment'}>Whole Apartment</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={6}>
                    <TextField label="Number of Beds" type="number" name="number_of_beds" value={newApartment.number_of_beds || ''} onChange={handleChange} fullWidth />
                </Grid>
                <Grid item xs={6}>
                    <TextField label="Number of Bathrooms" type="number" name="number_of_bathrooms" value={newApartment.number_of_bathrooms || ''} onChange={handleChange} fullWidth />
                </Grid>
                <Grid item xs={6}>
                    <TextField label="Number of Rooms" type="number" name="number_of_rooms" value={newApartment.number_of_rooms || ''} onChange={handleChange} fullWidth />
                </Grid>
                <Grid item xs={6}>
                    <FormControlLabel control={<Checkbox checked={newApartment.living_room || false} onChange={handleChange} name="living_room" />} label="Living Room" />
                </Grid>
                <Grid item xs={6}>
                    <TextField label="Square Meters" type="number" name="square_meters" value={newApartment.square_meters || ''} onChange={handleChange} fullWidth />
                </Grid>
                <Grid item xs={12}>
                    <TextField label="Description" multiline rows={4} name="description" value={newApartment.description || ''} onChange={handleChange} fullWidth />
                </Grid>
                <Grid item xs={12}>
                    <TextField label="Rules" multiline rows={4} name="rules" value={newApartment.rules || ''} onChange={handleChange} fullWidth />
                </Grid>
                <Grid item xs={12}>
                    <TextField label="Exact location coordinates" type="text" name="exact_location" value={newApartment.exact_location || ''} onChange={handleChange} fullWidth />
                </Grid>
                <Grid item xs={12}>
                    <MapContainer center={mapCenter} zoom={13} style={{ height: '300px', width: '100%' }}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
                        <DraggableMarker initialPosition={mapCenter} />
                    </MapContainer>
                </Grid>
                <Grid item xs={12}>
                    <TextField label="Address" multiline rows={4} name="address" value={newApartment.address || ''} onChange={handleChange} fullWidth />
                </Grid>
                <Grid item xs={6}>
                    <TextField label="Nickname" multiline rows={4} name="nickname" value={newApartment.nickname || ''} onChange={handleChange} fullWidth />
                </Grid>
                <Grid item xs={12}>
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="image-upload">Upload Images</InputLabel>
                        <input id="image-upload" type="file" name="images" multiple onChange={handleImageSelection} />
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" color="secondary" onClick={handleSubmit}>
                        Submit
                    </Button>
                </Grid>
            </Grid>
        </Dialog>
            </div>
        </ThemeProvider>
    );
                            }

export default ApartmentManagement;