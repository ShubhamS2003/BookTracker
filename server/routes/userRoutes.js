const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/users', userController.newUser);

module.exports = router;