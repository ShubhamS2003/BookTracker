require("dotenv").config();
const express = require("express");
const axios = require("axios");

const { neon } = require("@neondatabase/serverless");
const app = express();

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, API_KEY } = process.env;
const sql = neon(
  `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=require`
);

app.use(express.json());

// Search books by genre

app.get("/searchBooks_genre", async (req, res) => {
  const { genre } = req.query;
  const url = `https://www.googleapis.com/books/v1/volumes?q=subject:${encodeURIComponent(
    genre
  )}&key=${API_KEY}`;
  try {
    const response = await axios.get(url);
    const items = response.data.items;

    const books = items.map((item) => {
      const volume = item.volumeInfo;
      return {
        id: item.id,
        title: volume.title,
        thumbnail: volume.imageLinks.thumbnail,
        publish_date: volume.publishedDate,
        description: volume.description,
        author: volume.authors,
      };
    });
    res.json({ books });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch books" });
  }
});

// Search books by title

app.get("/searchBooks_title", async (req, res) => {
  const { title } = req.query;
  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
    title
  )}&key=${API_KEY}`;
  try {
    const response = await axios.get(url);
    const items = response.data.items;
    console.log(items.id);

    const books = items.map((item) => {
      const volume = item.volumeInfo;
      console.log(volume);
      return {
        id: item.id,
        title: volume.title,
        thumbnail: volume.imageLinks.thumbnail,
        publish_date: volume.publishedDate,
        description: volume.description,
        author: volume.authors,
      };
    });
    res.json({ books });
  } catch {
    res.status(500).json({ error: "Failed to fetch books" });
  }
});

// Save the books you would like to read

app.post("/saveBooks", async (req, res) => {
  const {
    book_id,
    title,
    author,
    description,
    publish_date,
    thumbnail,
    user_id,
  } = req.body;

  try {
    const result =
      await sql`INSERT INTO savedbooks (book_id, title, author, description, publish_date, thumbnail, user_id) VALUES (${book_id}, ${title}, ${author}, ${description}, ${publish_date}, ${thumbnail}, ${user_id}) RETURNING *`;
    res
      .status(201)
      .json({ message: "Book saved successfully", details: result[0] });
  } catch (err) {
    console.error("Error saving the book: ", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/saveBooks", async (req, res) => {
  const { user_id } = req.body;

  try {
    const books =
      await sql` SELECT * FROM savedbooks WHERE user_id = ${user_id}`;
    if (books.length === 0) {
      return res.status(404).json({ message: "No books found" });
    }
    res.json({ message: books });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Mark the book as your favorite

app.put("/books/:id/favorite", async (req, res) => {
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
      return res
        .status(404)
        .json({ message: "Book not found or does not belong to the user" });
    }

    res.json({ message: "Book marked as favorite", details: result[0] });
  } catch (err) {
    console.error("Error updating favorite status: ", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Fetch the users favorite books

app.get("/books/:id/favorite", async (req, res) => {
  const { id } = req.params;

  try {
    const books =
      await sql` SELECT * FROM savedbooks WHERE user_id = ${id} AND is_favorite = TRUE`;
    if (books.length === 0) {
      return res.status(404).json({ message: "No books found" });
    }
    res.json({ message: books });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Mark the books the user is currently reading

app.put("/books/:id/reading", async (req, res) => {
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
      return res.status(404).json({ message: "Book not found" });
    }

    res.json({
      message: "Book marked as currently reading",
      details: result[0],
    });
  } catch (err) {
    console.error("Error updating reading status: ", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Fetch the books the user is currently reading

app.get("/books/:id/reading", async (req, res) => {
  const { id } = req.params;

  try {
    const books =
      await sql` SELECT * FROM savedbooks WHERE user_id = ${id} AND reading = TRUE`;
    if (books.length === 0) {
      return res.status(404).json({ message: "No books found" });
    }
    res.json({ message: books });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Signup

app.post("/signup", async (req, res) => {
  const { user_id, user_name, email } = req.body;

  try {
    const user_exists = await sql`SELECT * FROM users WHERE email = ${email};`;

    if (user_exists.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }

    const result =
      await sql`INSERT INTO users (user_id, user_name, email) VALUES (${user_id}, ${user_name}, ${email}) RETURNING *`;

    res
      .status(201)
      .json({ message: "User signed in successfully", details: result[0] });
  } catch (err) {
    console.error("Error signing up user: ", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(3000, () => {
  console.log("Server is running at port 3000");
});
