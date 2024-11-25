-- Create Tables
CREATE TABLE IF NOT EXISTS Movies (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  year INT NOT NULL,
  genre VARCHAR(100) NOT NULL,
  director VARCHAR(255) NOT NULL
);
COMMIT;

CREATE TABLE IF NOT EXISTS Customers (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone_number TEXT NOT NULL
);
COMMIT;

CREATE TABLE IF NOT EXISTS Rentals (
  id SERIAL PRIMARY KEY,
  customer_id INT REFERENCES Customers(id) ON DELETE CASCADE,
  movie_id INT REFERENCES Movies(id) ON DELETE CASCADE,
  rental_date DATE NOT NULL,
  return_date DATE
);
COMMIT;

-- Insert Mock Data
INSERT INTO Movies (title, year, genre, director)
VALUES 
  ('Inception', 2010, 'Sci-Fi', 'Christopher Nolan'),
  ('Titanic', 1997, 'Drama', 'James Cameron'),
  ('The Matrix', 1999, 'Sci-Fi', 'The Wachowskis'),
  ('The Godfather', 1972, 'Crime', 'Francis Ford Coppola'),
  ('Pulp Fiction', 1994, 'Crime', 'Quentin Tarantino');
COMMIT;

INSERT INTO Customers (first_name, last_name, email, phone_number)
VALUES 
  ('John', 'Doe', 'john.doe@example.com', '123-456-7890'),
  ('Jane', 'Smith', 'jane.smith@example.com', '234-567-8901'),
  ('Alice', 'Johnson', 'alice.johnson@example.com', '345-678-9012'),
  ('Bob', 'Brown', 'bob.brown@example.com', '456-789-0123'),
  ('Eve', 'Davis', 'eve.davis@example.com', '567-890-1234');
COMMIT;

INSERT INTO Rentals (customer_id, movie_id, rental_date, return_date)
VALUES 
  (1, 1, '2024-11-01', '2024-11-10'),
  (2, 2, '2024-11-05', NULL),
  (3, 3, '2024-11-06', '2024-11-15'),
  (4, 4, '2024-11-08', NULL),
  (5, 5, '2024-11-10', '2024-11-20');
COMMIT;
