Book Review API

A RESTful API built with Node.js, Express.js, and MongoDB for managing books and user reviews. Includes JWT-based authentication, book and review CRUD operations, search, filtering, and pagination.

 Features

- User authentication using JWT
- CRUD operations for books
- Review system with ratings
- Search by title or author
- Pagination and filtering support

🛠 Prerequisites

Make sure you have the following installed:

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

Getting Started

1. Clone the repo:
   git clone https://github.com/hoopinwhoopin/Book-Review-API
   cd book-review-api

2. Install dependencies:
   npm install

3. Create a `.env` file in the root directory and add the following:
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/book_review_db
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRES_IN=24h

4. Start the server:
   npm start

Authentication

Register - POST /api/users/signup
curl -X POST http://localhost:3000/api/users/signup \
  -H "Content-Type: application/json" \
  -d '{"username": "john_doe", "email": "john@example.com", "password": "password123"}'

Login - POST /api/users/login
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com", "password": "password123"}'

Books

Create a Book - POST /api/books (auth required)
curl -X POST http://localhost:3000/api/books \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "The Great Gatsby", "author": "F. Scott Fitzgerald", "genre": "Fiction", "description": "A story of the fabulously wealthy Jay Gatsby"}'

Get All Books - GET /api/books
curl "http://localhost:3000/api/books?page=1&limit=10&author=Fitzgerald&genre=Fiction"

Get Book by ID - GET /api/books/:id
curl http://localhost:3000/api/books/BOOK_ID

Search Books - GET /api/books/search
curl "http://localhost:3000/api/books/search?query=gatsby"

 Reviews

Add Review - POST /api/books/:id/reviews (auth required)
curl -X POST http://localhost:3000/api/books/BOOK_ID/reviews \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"rating": 5, "comment": "Great book!"}'

Update Review - PUT /api/books/reviews/:id (auth required)
curl -X PUT http://localhost:3000/api/books/reviews/REVIEW_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"rating": 4, "comment": "Updated review"}'

Delete Review - DELETE /api/books/reviews/:id (auth required)
curl -X DELETE http://localhost:3000/api/books/reviews/REVIEW_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

 Design Choices

- JWT Auth: Lightweight and stateless authentication.
- Password Security: Passwords are hashed with bcrypt before storing.
- Embedded Reviews: Reviews live inside the book document to simplify reads and improve performance.
- Pagination: Added to keep endpoints performant with growing data.
- Search: Built with case-insensitive regex for flexibility.
- Error Handling: Centralized error middleware for clean, consistent error responses.
