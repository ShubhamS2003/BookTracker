const express = require('express');
const router = express.Router();
const booksController = require('../controllers/booksController');

router.get('/books_genre', booksController.bookGenre);
router.get('/books_title', booksController.bookTitle);
router.post('/saveBooks', booksController.saveBooks);
router.get('/:user_id/savedBooks', booksController.savedBooks);
router.put('/:user_id/favorites', booksController.favoriteBooks);
router.put('/:user_id/currently_reading', booksController.readingBooks);
router.get('/:user_id/favorites', booksController.getFavoriteBooks);
router.get('/:user_id/currently_reading', booksController.getReadingBooks);

module.exports = router;