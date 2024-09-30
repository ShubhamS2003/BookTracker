require('dotenv').config({ path: '../.env'});
const axios = require('axios');

const { API_KEY } = process.env;

const getBookById = async(id) => {
    const url = `https://www.googleapis.com/books/v1/volumes/${id}?key=${API_KEY}`

    try {
        const response = await axios.get(url);
        // console.log(response.data.id);
        const item = response.data;
        const volume = item.volumeInfo;

        const books = {
            id: item.id,
            genre: volume.categories,
            title: volume.title,
            author: volume.authors,
            description: volume.description,
            publish_date: volume.publishedDate,
            thumbnail: volume.imageLinks.thumbnail
        }
    
        return books;
    } catch (error) {
        // res.status(500).json({ error: error.message });
        console.error('error');
    }
};

module.exports = {
    getBookById
};