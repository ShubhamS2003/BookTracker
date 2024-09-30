const booksModel = require('../models/booksModel');


const bookGenre = async(req, res) => {
    const { genre } = req.query;
    try{
            response = await booksModel.bookGenre(genre);
            const items = response.data.items;
            // console.log(items);
            const books = items.map(item => {
            const volume = item.volumeInfo;
            // console.log(volume.categories);
            return {
                id: item.id,
                title: volume.title,
                thumbnail: volume.imageLinks.thumbnail,
                publish_date: volume.publishedDate,
                description: volume.description,
                author: volume.authors
            };
        });

        res.status(201).json({books});

    } catch(error) {
        res.status(500).json({ error: error.message });
    }
}

const bookTitle = async(req, res) => {
    const { title } = req.query;
    try{
        const response = await booksModel.bookTitle(title);
        const items = response.data.items;
        // console.log(items);
        const books = items.map(item => {
            const volume = item.volumeInfo;
            return {
                id: item.id,
                title: volume.title,
                thumbnail: volume.imageLinks.thumbnail,
                publish_date: volume.publishedDate,
                description: volume.description,
                author: volume.authors
            };
        });
        res.status(201).json({books});
    } catch(error) {
        // console.error("Error saving the book: ", error);
        res.status(500).json({error: error.message });
    }
}

const saveBooks = async(req, res) => {
    const {book_id, genre, title, author, description, publish_date, thumbnail, user_id} = req.body;
    try{
        const response = await booksModel.cachedBooks(book_id);
        if (response.length === 0){
            await booksModel.cacheBooks(book_id, genre, title, author, description, publish_date, thumbnail, user_id);
        }
        await booksModel.saveBooks(user_id, book_id);
        res.status(201).json({ message: "book saved"});
    } catch(error) {
        res.status(500).json({error: error.message});
    }
}

const savedBooks = async(req, res) => {
    const { user_id } = req.params;
    try{
        const response = await booksModel.savedBooks(user_id);
        console.log("response");
        res.status(201).json(response);
    } catch(error) {
        res.status(500).json({error: error.message});
    }
}

const favoriteBooks = async(req, res) => {
    const { user_id } = req.params;
    const { book_id } = req.body;
    try{
        await booksModel.favoriteBooks(user_id, book_id);
        res.status(200).json({message: "Book added to favorites"});
    } catch (error) { 
        res.status(500).json({error: error.message});
    }
}

const getFavoriteBooks = async(req, res) => {
    const { user_id } = req.params;
    try{
        const response = await booksModel.getFavoriteBooks(user_id);
        if(response.length === 0){
            return res.json({message: "No books added to favorites"});
        }
        res.status(200).json(response);
    } catch(error){
        res.status(500).json({error: error.message});
    }
}

const readingBooks = async(req, res) => {
    const { user_id } = req.params;
    const { book_id } = req.body;
    try{
        await booksModel.readingBooks(user_id, book_id);
        res.status(200).json({message: "Book added to currently reading"});
    } catch (error) { 
        res.status(500).json({error: error.message});
    }
}

const getReadingBooks = async(req, res) => {
    const { user_id } = req.params;
    try{
        const response = await booksModel.getReadingBooks(user_id);
        if(response.length === 0){
            return res.json({message: "Currently reading no books"});
        }
        res.status(200).json(response);
    } catch(error){
        res.status(500).json({error: error.message});
    }
}



module.exports = {
    bookGenre,
    bookTitle,
    saveBooks,
    savedBooks,
    favoriteBooks,
    getFavoriteBooks,
    readingBooks,
    getReadingBooks
};