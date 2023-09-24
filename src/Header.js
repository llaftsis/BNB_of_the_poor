import { useContext } from 'react';
import AuthContext from './AuthContext';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './Header.css';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { IconButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';

function Header() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <AppBar position="static" color="primary" elevation={8}>
        <Toolbar>
            <Typography variant="h6" style={{ flexGrow: 1, fontWeight: 500 }}>
                Αναζήτηση Διαμερισμάτων
            </Typography>

            <IconButton color="inherit" component={Link} to="/">
                <HomeIcon />
            </IconButton>

            <Button className="header-button" color="inherit" component={Link} to="/about">
                ΣΧΕΤΙΚΑ ΜΕ ΕΜΑΣ
            </Button>

            <Button className="header-button" color="inherit" component={Link} to="/contact">
                ΕΠΙΚΟΙΝΩΝΙΑ
            </Button>

            {user ? (
                <>
                    <Button className="user-button" color="inherit" component={Link} to={`/users/${user.id}`}>
                        {user.username}
                    </Button>

                    <Button className="header-button" color="inherit" component={Link} to="/apartment-management">
                        Manage Apartments
                    </Button>

                    <Button variant="outlined" color="secondary" onClick={() => {
                        logout();
                        navigate('/');
                    }}>
                        Logout
                    </Button>
                </>
            ) : (
                <Button color="secondary" component={Link} to="/login">
                    ΣΥΝΔΕΣΗ/ΕΓΓΡΑΦΗ
                </Button>
            )}
        </Toolbar>
    </AppBar>
);
}

export default Header;