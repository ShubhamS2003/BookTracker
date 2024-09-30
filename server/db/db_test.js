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


// app.get('/saveBooks', async(req, res) => {
//   const { user_id } = req.body;

//   try {
//     const books = await sql ` SELECT * FROM savedbooks WHERE user_id = ${user_id}`;
//     if(books.length === 0) {
//       return res.status(404).json({message: "No books found"});
//     } 
//     res.json({message: books});
//   } catch(err){
//     console.error(err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });