import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';

function AboutUs() {
  return (
    <Container maxWidth="md" style={{ marginTop: '2rem' }}>
      <Box component={Paper} padding={3} elevation={3}>
        <Typography variant="h4" gutterBottom color="primary" align="center">
          Σχετικά με εμάς
        </Typography>

        <Typography variant="body1" paragraph>
          Καλωσορίσατε στην σελίδα μας για αναζήτηση διαμερισμάτων. Εδώ θα βρείτε 
          τα καλύτερα διαμερίσματα στην πόλη και θα έχετε την ευκαιρία να επιλέξετε 
          αυτό που σας ταιριάζει.
        </Typography>

        <Typography variant="body1" paragraph>
          Είμαστε μια ομάδα επαγγελματιών με πολυετή εμπειρία στον τομέα και 
          είμαστε εδώ για να σας βοηθήσουμε.
        </Typography>
      </Box>
    </Container>
  );
}

export default AboutUs;
