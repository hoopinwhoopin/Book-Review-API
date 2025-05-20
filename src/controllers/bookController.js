const Book = require('../models/Book');


const addBook = async (req, res) => {
    try {
        const { title, author, genre, description } = req.body;
        const book = new Book({ title, author, genre, description });
        await book.save();
        res.status(201).json(book);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


const getBooks = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = {};
        if (req.query.author) filter.author = new RegExp(req.query.author, 'i');
        if (req.query.genre) filter.genre = new RegExp(req.query.genre, 'i');

        const books = await Book.find(filter)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const total = await Book.countDocuments(filter);

        res.json({
            books,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalBooks: total
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


const getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.json(book);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


const addReview = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }

        const existingReview = book.reviews.find(
            review => review.user.toString() === req.user._id.toString()
        );
        if (existingReview) {
            return res.status(400).json({ error: 'You have already reviewed this book' });
        }

        const { rating, comment } = req.body;
        book.reviews.push({
            user: req.user._id,
            rating,
            comment
        });

        await book.save();
        res.status(201).json(book);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


const updateReview = async (req, res) => {
    try {
        const book = await Book.findOne({ 'reviews._id': req.params.id });
        if (!book) {
            return res.status(404).json({ error: 'Review not found' });
        }

        const review = book.reviews.id(req.params.id);
        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }

        if (review.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Not authorized to update this review' });
        }

        const { rating, comment } = req.body;
        review.rating = rating;
        review.comment = comment;

        await book.save();
        res.json(book);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
// Delete a review
const deleteReview = async (req, res) => {
    try {
        const book = await Book.findOne({ 'reviews._id': req.params.id });
        if (!book) {
            return res.status(404).json({ error: 'Review not found' });
        }

        const review = book.reviews.id(req.params.id);
        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }

        if (review.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Not authorized to delete this review' });
        }

        review.remove();
        await book.save();
        res.json(book);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


const searchBooks = async (req, res) => {
    try {
        const { query } = req.query;
        const searchRegex = new RegExp(query, 'i');

        const books = await Book.find({
            $or: [
                { title: searchRegex },
                { author: searchRegex }
            ]
        }).limit(10);

        res.json(books);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    addBook,
    getBooks,
    getBookById,
    addReview,
    updateReview,
    deleteReview,
    searchBooks
}; 