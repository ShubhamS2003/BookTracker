const db = require('./db');

// const db = require('./path/to/dbConfig'); // Adjust the path to your dbConfig.js file

(async () => {
  try {
    // Example: Select all users from the 'users' table
    const result = await db.query('SELECT * FROM users;');
    console.log(result); // Log the rows returned by the query

  } catch (error) {
    console.error('Error executing query:', error.message);
  } finally {
    process.exit(); // Exit the process once the query is done
  }
})();
