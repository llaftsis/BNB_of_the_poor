import React from 'react';

function ContactPage() {
  return (
    <div>
      <h2>Επικοινωνία</h2>
      <p>Εδώ μπορείτε να βρείτε τα στοιχεία επικοινωνίας μας.</p>
      
      <div className="contact-details">
        <p><strong>Διεύθυνση:</strong> Οδός Παράδεισος 123, Πόλη</p>
        <p><strong>Τηλέφωνο:</strong> 123-456-7890</p>
        <p><strong>Email:</strong> info@example.com</p>
      </div>
      
      <p>Εάν έχετε οποιεσδήποτε ερωτήσεις ή σχόλια, μη διστάσετε να επικοινωνήσετε μαζί μας!</p>
      
      {/* Add contact form or any other relevant content here */}
    </div>
  );
}

export default ContactPage;

