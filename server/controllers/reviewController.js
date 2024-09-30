const booksModel = require('../models/booksModel');
const reviewModel = require('../models/reviewModel');
const googleBooksService = require('../services/googleBooksService');


const newReview = async (req, res) => {
    const { book_id } = req.params;
    const { user_id, review, rating } = req.body;
    try {
        let response = await booksModel.cachedBooks(book_id);
        // console.log(response);
        if (response.length === 0) {
            const googleBooks = await googleBooksService.getBookById(book_id);
            // const { book_id, title, genre, author, description, publish_date, thumbnail } = req.body;
            console.log(googleBooks.thumbnail.length);
            await booksModel.cacheBooks(
                googleBooks.id,
                googleBooks.genre,
                googleBooks.title,
                googleBooks.author,
                googleBooks.description,
                googleBooks.publish_date,
                googleBooks.thumbnail);
        }
        await reviewModel.newReview(user_id, book_id, review, rating);
        res.status(200).json({ message: "Review posted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    newReview
};