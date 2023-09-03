USE ApartmentSearch;

CREATE TABLE Apartments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    number_of_guests INT(2) NOT NULL,
    location ENUM('Αθήνα', 'Θεσσαλονίκη', 'Κρήτη') NOT NULL,
    category ENUM('Δωμάτια', 'Κατοικίες', 'Ξενοδοχεία') NOT NULL
);

CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    isApproved BOOLEAN DEFAULT TRUE,
    role ENUM('Οικοδεσπότης', 'Ενοικιαστής', 'Διαχειριστής') NOT NULL
);

CREATE TABLE UserListings (
    user_id INT,
    apartment_id INT,
    FOREIGN KEY(user_id) REFERENCES Users(id),
    FOREIGN KEY(apartment_id) REFERENCES Apartments(id)
);

-- Admin user
INSERT INTO Users (username, password, email, firstName, lastName, phone, role) VALUES ('admin', '$2b$12$6FgqfMQfxGjk/mY0Ukq/2uNupNjI4OhRRXu5/DdyMGfYN3Ctlz8/K', 'admin@bnbftwnwn.com', 'Admin', 'Admin', '0000000000', 'Διαχειριστής');