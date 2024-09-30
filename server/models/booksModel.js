require('dotenv').config({ path: '../.env' });
const db = require('../db/db')
const axios = require('axios');
const { API_KEY } = process.env

const bookGenre = async(genre) => {
    const url = `https://www.googleapis.com/books/v1/volumes?q=subject:${encodeURIComponent(genre)}&key=${API_KEY}`;
    const result = await axios.get(url);
    return result;
}

const bookTitle = async(title) => {
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(title)}&key=${API_KEY}`;
    const result = await axios.get(url);
    return result;
}

const cacheBooks = async(book_id, genre, title, author, description, publish_date, thumbnail) => {
    const result = await db.query(`INSERT INTO books (id, genre, title, author, description, publish_date, thumbnail) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [book_id, genre, title, author, description, publish_date, thumbnail]
)
    return result;
}

const cachedBooks = async(book_id) => {
    const result = await db.query(`SELECT id FROM books WHERE id = $1`, [book_id]);
    return result;
}

const cachedBooks_genre = async(genre) => {
    const result = await db.query(`SELECT * FROM books WHERE genre = $1`, [genre]);
    return result;
}

const saveBooks = async(userId, bookId) => {
    const result = await db.query(`INSERT INTO user_books (bookId, userId) VALUES ($1, $2) RETURNING *`,
    [bookId, userId]
)
    return result;
}

const savedBooks = async(user_id) => {
    const result = await db.query(`SELECT * FROM user_books JOIN books ON books.id = user_books.bookId WHERE userId = $1`, [user_id]);
    return result;
}

const favoriteBooks = async(user_id, book_id) => {
    const result = await db.query(`UPDATE user_books SET favorite = NOT favorite WHERE userId = $1 AND bookId = $2`, [ user_id, book_id ]);
    return result;
}

const getFavoriteBooks = async(user_id) => {
    const result = await db.query(`SELECT * FROM user_books JOIN books ON books.id = user_books.bookId WHERE userId = $1 AND favorite = TRUE`, [user_id]);
    return result;
}

const readingBooks = async(user_id, book_id) => {
    const result = await db.query(`UPDATE user_books SET reading = NOT reading WHERE userId = $1 AND bookId = $2`, [ user_id, book_id ]);
    return result;
}

const getReadingBooks = async(user_id) => {
    const result = await db.query(`SELECT * FROM user_books JOIN books ON books.id = user_books.bookId WHERE userId = $1 AND reading = TRUE`, [user_id]);
    return result;
}

module.exports = {
    bookGenre,
    bookTitle,
    cacheBooks,
    cachedBooks,
    cachedBooks_genre,
    saveBooks,
    savedBooks,
    favoriteBooks,
    readingBooks,
    getFavoriteBooks,
    getReadingBooks
};
