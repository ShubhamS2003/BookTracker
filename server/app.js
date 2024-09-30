require('dotenv').config({ path: './.env'});
const express = require('express');
const axios = require('axios');
const userRoutes = require('./routes/userRoutes');
const bookRoutes = require('./routes/bookRoutes');
const reviewRoutes = require('./routes/reviewRoutes');


const app = express();

app.use(express.json());

app.use('/api/v1/users', userRoutes);

app.use('/api/v1/books', bookRoutes);

app.use('/api/v1/books', reviewRoutes);

app.put('/books/:id/favorite', async (req, res) => {
  const { id } = req.params;  
  const { user_id } = req.body;  

  try {
    const result = await sql`
      UPDATE savedbooks 
      SET is_favorite = NOT is_favorite 
      WHERE book_id = ${id} AND user_id = ${user_id}
      RETURNING *;
    `;

    if (result.length === 0) {
      return res.status(404).json({ message: 'Book not found or does not belong to the user' });
    }

    res.json({ message: 'Book marked as favorite', details: result[0] });
  } catch (err) {
    console.error("Error updating favorite status: ", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Fetch the users favorite books

app.get('/books/:id/favorite', async(req, res) => {
  const { id } = req.params;

  try {
    const books = await sql ` SELECT * FROM savedbooks WHERE user_id = ${id} AND is_favorite = TRUE`;
    if(books.length === 0) {
      return res.status(404).json({message: "No books found"});
    } 
    res.json({message: books});
  } catch(err){
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Mark the books the user is currently reading

app.put('/books/:id/reading', async (req, res) => {
  const { id } = req.params;  
  const { user_id } = req.body;  

  try {
    const result = await sql`
      UPDATE savedbooks 
      SET reading = NOT reading 
      WHERE book_id = ${id} AND user_id = ${user_id}
      RETURNING *;
    `;

    if (result.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json({ message: 'Book marked as currently reading', details: result[0] });
  } catch (err) {
    console.error("Error updating reading status: ", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Fetch the books the user is currently reading

app.get('/books/:id/reading', async(req, res) => {
  const { id } = req.params;

  try {
    const books = await sql ` SELECT * FROM savedbooks WHERE user_id = ${id} AND reading = TRUE`;
    if(books.length === 0) {
      return res.status(404).json({message: "No books found"});
    } 
    res.json({message: books});
  } catch(err){
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Comments

// Signup

app.post('/signup', async(req, res) => {
  const {user_id, user_name, email} = req.body;

  try{
    const user_exists = await sql`SELECT * FROM users WHERE email = ${email};`;

    if( user_exists.length > 0){
      return res.status(400).json({error: "User already exists"});
    }

    const result = await sql`INSERT INTO users (user_id, user_name, email) VALUES (${user_id}, ${user_name}, ${email}) RETURNING *`;

    res.status(201).json({message: "User signed in successfully", details: result[0]});
  } catch(err){
    console.error("Error signing up user: ", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(3000, () => {
  console.log("Server is running at port 3000");
});