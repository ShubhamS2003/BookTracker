const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

router.post('/:book_id/reviews', reviewController.newReview);

module.exports = router;