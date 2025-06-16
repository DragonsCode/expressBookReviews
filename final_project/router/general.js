const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  if (users.find(user => user.username === username)) {
    return res.status(409).json({ message: "Username already exists" });
  }
  users.push({ username, password }); // Store plain password (not secure, for demo only)
  res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  res.status(200).send(JSON.stringify(books, null, 2));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.status(200).send(JSON.stringify(books[isbn], null, 2));
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const matchingBooks = Object.values(books).filter(
    book => book.author.toLowerCase() === author.toLowerCase()
  );
  if (matchingBooks.length > 0) {
    res.status(200).send(JSON.stringify(matchingBooks, null, 2));
  } else {
    res.status(404).json({ message: "No books found by this author" });
  }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const matchingBooks = Object.values(books).filter(
    book => book.title.toLowerCase() === title.toLowerCase()
  );
  if (matchingBooks.length > 0) {
    res.status(200).send(JSON.stringify(matchingBooks, null, 2));
  } else {
    res.status(404).json({ message: "No books found with this title" });
  }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.status(200).send(JSON.stringify(books[isbn].reviews, null, 2));
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
