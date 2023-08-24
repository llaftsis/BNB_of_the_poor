import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="header">
      <h1>Αναζήτηση Διαμερισμάτων</h1>
      <nav>
        <ul className="nav-list">
          <li>Αρχική</li>
          <li>Σχετικά με Εμάς</li>
          <li>Επικοινωνία</li>
          <li><Link to="/login">Συνδεση/Εγγραφη</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
