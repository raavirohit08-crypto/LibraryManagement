# Library Management

React + Vite app with JSON Server backend.

## Features
- Signup, Login, Logout (session kept in localStorage)
- Book CRUD (add, view, edit, delete)
- Search (title/author) and Filter (category, availability)
- Favorite books (per user)

## Tech
React, React Router, Axios, JSON Server, Vite

## Setup

```bash
npm install
npm start
```

`npm start` runs both:
- JSON Server  -> http://localhost:3000
- Vite app     -> http://localhost:5173

Or run them separately in two terminals:

```bash
npm run server
npm run dev
```

## Demo login
Email: demo@library.com
Password: demo123

## API endpoints (JSON Server)
- GET/POST        /users
- GET/POST        /books
- GET/PUT/DELETE  /books/:id
- GET             /books?q=harry&category=Fantasy&available=true
- GET/POST        /favorites
- DELETE          /favorites/:id
- GET             /favorites?userId=1&_expand=book

## Folder structure
```
src
├── components   Navbar, BookCard, SearchFilter
├── context      AuthContext (signup/login/logout)
├── pages        Login, Signup, Books, BookForm, BookDetails, Favorites, NotFound
├── routes       AppRoutes, ProtectedRoute
├── services     api.js (Axios instance)
├── constants.js
├── App.jsx
├── main.jsx
└── index.css
```

## Note
Passwords are stored as plain text in db.json. This is fine for a learning
project, but a real app needs a proper backend with hashed passwords.
