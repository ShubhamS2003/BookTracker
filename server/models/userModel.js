const db = require('../db/db');

const newUser = async(user_id, user_name, email, genre_preference) => {
    const result = await db.query(
        'INSERT INTO users (user_id, user_name, email, genre_preference) VALUES ($1, $2, $3, $4) RETURNING *',
        [user_id, user_name, email, genre_preference]
    );   
    // console.log("result: ", result);
     return result;
}

module.exports = {
    newUser
};
