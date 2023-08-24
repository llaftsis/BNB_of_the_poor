CREATE DATABASE ApartmentSearch;

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
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL, -- It's better to store a hashed version of the password, not plain text.
    email VARCHAR(255) UNIQUE NOT NULL
);

-- You can also create relations between tables if needed. For instance, if each apartment listing is linked to a user:
CREATE TABLE UserListings (
    user_id INT,
    apartment_id INT,
    FOREIGN KEY(user_id) REFERENCES Users(id),
    FOREIGN KEY(apartment_id) REFERENCES Apartments(id)
);
