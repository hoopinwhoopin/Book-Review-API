const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    addBook,
    getBooks,
    getBookById,
    addReview,
    updateReview,
    deleteReview,
    searchBooks
} = require('../controllers/bookController');

router.get('/search', searchBooks);
router.get('/', getBooks);
router.get('/:id', getBookById);


router.post('/', auth, addBook);
router.post('/:id/reviews', auth, addReview);
router.put('/reviews/:id', auth, updateReview);
router.delete('/reviews/:id', auth, deleteReview);

module.exports = router; 