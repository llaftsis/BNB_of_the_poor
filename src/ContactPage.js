import React from 'react';
import { Container, Typography, Box, Paper, Divider } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';

function ContactPage() {
  return (
    <Container maxWidth="md" style={{ marginTop: '2rem' }}>
      <Box component={Paper} padding={3} elevation={3}>
        <Typography variant="h4" gutterBottom color="primary" align="center">
          Επικοινωνία
        </Typography>

        <Typography variant="body1" paragraph align="center">
          Εδώ μπορείτε να βρείτε τα στοιχεία επικοινωνίας μας.
        </Typography>

        <Divider style={{ margin: '1rem 0' }} />

        <Box display="flex" alignItems="center" marginBottom={1}>
          <LocationOnIcon color="action" style={{ marginRight: 8 }} />
          <Typography variant="subtitle1">Διεύθυνση:</Typography>
          <Typography variant="body2" style={{ marginLeft: 8 }}>Οδός Παράδεισος 123, Πόλη</Typography>
        </Box>

        <Box display="flex" alignItems="center" marginBottom={1}>
          <PhoneIcon color="action" style={{ marginRight: 8 }} />
          <Typography variant="subtitle1">Τηλέφωνο:</Typography>
          <Typography variant="body2" style={{ marginLeft: 8 }}>123-456-7890</Typography>
        </Box>

        <Box display="flex" alignItems="center" marginBottom={2}>
          <EmailIcon color="action" style={{ marginRight: 8 }} />
          <Typography variant="subtitle1">Email:</Typography>
          <Typography variant="body2" style={{ marginLeft: 8 }}>info@example.com</Typography>
        </Box>

        <Divider style={{ margin: '1rem 0' }} />

        <Typography variant="body1" paragraph align="center">
          Εάν έχετε οποιεσδήποτε ερωτήσεις ή σχόλια, μη διστάσετε να επικοινωνήσετε μαζί μας!
        </Typography>
      </Box>
    </Container>
  );
}

export default ContactPage;

