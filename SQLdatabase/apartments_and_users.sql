USE ApartmentSearch;

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

CREATE TABLE apartments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    open_date DATE NOT NULL,
    close_date DATE NOT NULL,
    number_of_guests INT(2) NOT NULL,
    location ENUM('Athens', 'Thessaloniki', 'Crete') NOT NULL,
	type_of_apartment ENUM('Room', 'Whole Apartment') NOT NULL,
    owner_id INT,
    FOREIGN KEY (owner_id) REFERENCES Users(id),
    min_price DECIMAL(10, 2) NOT NULL,
    additional_cost_per_person DECIMAL(10, 2) NOT NULL,
    rules TEXT,
    description TEXT,
    number_of_beds INT(2),
    number_of_bathrooms INT(2),
    number_of_rooms INT(2),
    living_room BOOLEAN,
    square_meters DECIMAL(10,2),
    exact_location VARCHAR(40),
    address VARCHAR(20),
    nickname VARCHAR(20)
);

CREATE TABLE UserListings (
    user_id INT,
    apartment_id INT,
    FOREIGN KEY(user_id) REFERENCES Users(id),
    FOREIGN KEY(apartment_id) REFERENCES Apartments(id)
);
CREATE TABLE apartment_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    apartment_id INT,
    image_url VARCHAR(255),
    FOREIGN KEY (apartment_id) REFERENCES apartments(id)
);

CREATE TABLE reservations (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    apartment_id INT,
    username VARCHAR(255),  -- changed data type to VARCHAR
    start_date DATE NOT NULL,   -- start date of the reservation
    end_date DATE NOT NULL, 
    FOREIGN KEY (apartment_id) REFERENCES apartments(id)
    -- If users(id) is an INT, you might need another foreign key or adjust the data type of the users table
    -- FOREIGN KEY (user_id) REFERENCES users(id) 
);

-- Admin user
INSERT INTO Users (username, password, email, firstName, lastName, phone, role) VALUES ('admin', '$2b$12$6FgqfMQfxGjk/mY0Ukq/2uNupNjI4OhRRXu5/DdyMGfYN3Ctlz8/K', 'admin@bnbftwnwn.com', 'Admin', 'Admin', '0000000000', 'Διαχειριστής');