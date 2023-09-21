import { useContext } from 'react';
import AuthContext from './AuthContext';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

function Header() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <AppBar position="static" color="primary" elevation={2} style={{ backgroundColor: '#3f51b5' }}>
            <Toolbar>
                <Typography variant="h6" style={{ flexGrow: 1, fontWeight: 500 }}>
                    Αναζήτηση Διαμερισμάτων
                </Typography>

                <Box mr={2}>
                    <Button color="inherit" component={Link} to="/">Αρχική</Button>
                </Box>
                <Box mr={2}>
                    <Button color="inherit" component={Link} to="/about">Σχετικά με Εμάς</Button>
                </Box>
                <Box mr={2}>
                    <Button color="inherit" component={Link} to="/contact">Επικοινωνία</Button>
                </Box>

                {user ? (
                    <>
                        <Box mr={2}>
                            <Button color="inherit" component={Link} to={`/users/${user.id}`}>{user.username}</Button>
                        </Box>
                        <Box mr={2}>
                            <Button color="inherit" component={Link} to="/apartment-management">Manage Apartments</Button>
                        </Box>
                        <Button variant="outlined" color="secondary" onClick={() => {
                            logout();
                            navigate('/');
                        }}>Logout</Button>
                    </>
                ) : (
                    <Button color="secondary" component={Link} to="/login">Σύνδεση/Εγγραφή</Button>
                )}
            </Toolbar>
        </AppBar>
  );
}

export default Header;