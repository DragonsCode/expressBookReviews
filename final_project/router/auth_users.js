// router/auth_users.js
const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  return typeof username === 'string' && username.trim().length > 0;
};

const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
};

// Only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!isValid(username) || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const accessToken = jwt.sign({ username }, "fingerprint_customer", { expiresIn: '1h' });
  req.session.authorization = { accessToken };
  res.status(200).json({ message: "Login successful", token: accessToken });
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review; // Use query parameter as per hint
  const username = req.user.username; // From auth middleware in index.js
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }
  if (!review) {
    return res.status(400).json({ message: "Review is required" });
  }
  books[isbn].reviews[username] = review; // Add or update review
  res.status(200).json({ message: "Review added/updated successfully" });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.username;
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }
  if (!books[isbn].reviews[username]) {
    return res.status(404).json({ message: "Review not found for this user" });
  }
  delete books[isbn].reviews[username]; // Delete user's review
  res.status(200).json({ message: "Review deleted successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;