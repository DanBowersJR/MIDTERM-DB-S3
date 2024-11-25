const { Pool } = require('pg');

// PostgreSQL connection
const pool = new Pool({
  user: 'postgres', // Your PostgreSQL username
  host: 'localhost', // Host for the database
  database: 'movie_rentals', // Name of the database you created in pgAdmin
  password: '1234', // Your PostgreSQL password
  port: 5432, // Default PostgreSQL port
});

/**
 * Creates the database tables if they do not already exist.
 */
async function createTables() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS Movies (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        year INT NOT NULL,
        genre VARCHAR(100) NOT NULL,
        director VARCHAR(255) NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS Customers (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone_number TEXT NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS Rentals (
        id SERIAL PRIMARY KEY,
        customer_id INT REFERENCES Customers(id) ON DELETE CASCADE,
        movie_id INT REFERENCES Movies(id) ON DELETE CASCADE,
        rental_date DATE NOT NULL,
        return_date DATE
      );
    `);
    console.log('Tables created successfully (if they did not already exist).');
  } catch (err) {
    console.error('Error creating tables:', err);
  }
}

/**
 * Inserts a new movie into the Movies table.
 * 
 * @param {string} title Title of the movie
 * @param {number} year Year the movie was released
 * @param {string} genre Genre of the movie
 * @param {string} director Director of the movie
 */
async function insertMovie(title, year, genre, director) {
  try {
    await pool.query(
      'INSERT INTO Movies (title, year, genre, director) VALUES ($1, $2, $3, $4);',
      [title, year, genre, director]
    );
    console.log(`Movie "${title}" inserted successfully.`);
  } catch (err) {
    console.error('Error inserting movie:', err);
  }
}

/**
 * Prints all movies in the database to the console.
 */
async function displayMovies() {
  try {
    const result = await pool.query('SELECT * FROM Movies;');
    console.log('Movies:');
    console.table(result.rows);
  } catch (err) {
    console.error('Error retrieving movies:', err);
  }
}

/**
 * Updates a customer's email address.
 * 
 * @param {number} customerId ID of the customer
 * @param {string} newEmail New email address of the customer
 */
async function updateCustomerEmail(customerId, newEmail) {
  try {
    await pool.query(
      'UPDATE Customers SET email = $1 WHERE id = $2;',
      [newEmail, customerId]
    );
    console.log(`Customer ${customerId}'s email updated to ${newEmail}`);
  } catch (err) {
    console.error('Error updating customer email:', err);
  }
}

/**
 * Removes a customer from the database along with their rental history.
 * 
 * @param {number} customerId ID of the customer to remove
 */
async function removeCustomer(customerId) {
  try {
    await pool.query('DELETE FROM Customers WHERE id = $1;', [customerId]);
    console.log(`Customer ${customerId} and their rental history removed.`);
  } catch (err) {
    console.error('Error removing customer:', err);
  }
}

/**
 * Prints a help message to the console.
 */
function printHelp() {
  console.log('Usage:');
  console.log('  node index.js insert <title> <year> <genre> <director> - Insert a movie');
  console.log('  node index.js show - Show all movies');
  console.log('  node index.js update <customer_id> <new_email> - Update a customer\'s email');
  console.log('  node index.js remove <customer_id> - Remove a customer from the database');
}

/**
 * Runs our CLI app to manage the movie rentals database.
 */
async function runCLI() {
  try {
    await createTables(); // Ensure tables exist before running commands

    const args = process.argv.slice(2);

    switch (args[0]) {
      case 'insert':
        if (args.length !== 5) {
          printHelp();
          return;
        }
        await insertMovie(args[1], parseInt(args[2]), args[3], args[4]);
        break;
      case 'show':
        await displayMovies();
        break;
      case 'update':
        if (args.length !== 3) {
          printHelp();
          return;
        }
        await updateCustomerEmail(parseInt(args[1]), args[2]);
        break;
      case 'remove':
        if (args.length !== 2) {
          printHelp();
          return;
        }
        await removeCustomer(parseInt(args[1]));
        break;
      default:
        printHelp();
        break;
    }
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    pool.end(); // Ensure the database connection is closed
  }
}

runCLI();
