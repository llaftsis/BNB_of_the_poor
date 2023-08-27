import React from 'react';
import SearchBox from './SearchBox';
import Listings from './Listings';
import RecentReviewsPage from './RecentReviewsPage';

function SearchForm() {
  return (
    <main>
      <SearchBox />
      <Listings />
      <RecentReviewsPage />
    </main>
  );
}

export default SearchForm;