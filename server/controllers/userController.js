const userModel = require('../models/userModel');

const newUser = async(req, res) => {
    const { user_id, user_name, email, genre_preference } = req.body;
    try{
        const user = await userModel.newUser(user_id, user_name, email, genre_preference);
        res.status(201).json(user);
    } catch(error) {
        console.error('Error creating new user:', error.message);
        res.status(500).json({ message: "Error signing up", error: error.message });
    }
}

module.exports = {
    newUser
};