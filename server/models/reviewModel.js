const db = require('../db/db');

const newReview = async(user_id, book_id, review, rating) => {
    const result = await db.query(
        `INSERT INTO reviews (user_id, book_id, review, rating) VALUES ($1, $2, $3, $4) RETURNING *`,
        [user_id, book_id, review, rating]
    );

    return result;
}

module.exports = {
    newReview
};
