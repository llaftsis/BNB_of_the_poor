import { useContext } from 'react';
import AuthContext from './AuthContext';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function Header() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <header className="header">
      <h1>Αναζήτηση Διαμερισμάτων</h1>
      <nav>
        <ul className="nav-list">
          <li><Link to="/">Αρχική</Link></li>
          <li><Link to="/about">Σχετικά με Εμάς</Link></li>
          <li><Link to="/contact">Επικοινωνία</Link></li>
          {user ? (
  <>
    <li><Link to={`/users/${user.id}`}>{user.username}</Link></li>
    <li onClick={() => {
       logout();
       navigate('/');
    }}>Logout</li>
  </>
) : (
  <li><Link to="/login">Σύνδεση/Εγγραφή</Link></li>
)}

        </ul>
      </nav>
    </header>
  );
}

export default Header;