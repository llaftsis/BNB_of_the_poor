import React, { useEffect, useState } from 'react';

function RecentReviewsPage() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    // Fetch recent reviews data from your backend API or database
    // Update the `reviews` state with the fetched data
  }, []);

  return (
    <div>
      <ul>
        {reviews.map((review) => (
          <li key={review.id}>
            <h3>{review.title}</h3>
            <p>{review.content}</p>
            <p>Rating: {review.rating}</p>
            <p>Author: {review.author}</p>
            <p>Date: {review.date}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RecentReviewsPage;
