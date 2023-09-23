import React from 'react';
import SearchBox from './SearchBox';
import Listings from './Listings';
import RecentReviewsPage from './RecentReviewsPage';
import './SearchForm.css';

function SearchForm() {
  return (
    <main className="search-main">
      <section className="search-section">
        <h2>Βρες ένα κατάλυμα</h2>
        <SearchBox />
      </section>
      <section className="listings-section">
        <h2>Προτεινόμενοι Χώροι</h2>
        <Listings />
      </section>
      <section className="reviews-section">
        <h2>Πρόσφατες Κριτικές</h2>
        <RecentReviewsPage />
      </section>
    </main>
  );
}

export default SearchForm;
