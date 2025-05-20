const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true
});

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: String,
        required: true,
        trim: true
    },
    genre: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    reviews: [reviewSchema],
    averageRating: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

bookSchema.pre('save', function(next) {
    if (this.reviews.length > 0) {
        this.averageRating = this.reviews.reduce((acc, review) => acc + review.rating, 0) / this.reviews.length;
    }
    next();
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book; 