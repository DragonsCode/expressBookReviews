const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Helper function to simulate async book data access
const getBooksAsync = () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(books), 100); // Simulate delay
  });
};

const getBookByISBNAsync = (isbn) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (books[isbn]) {
        resolve(books[isbn]);
      } else {
        reject(new Error("Book not found"));
      }
    }, 100);
  });
};

const getBooksByAuthorAsync = (author) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const matchingBooks = Object.values(books).filter(
        book => book.author.toLowerCase() === author.toLowerCase()
      );
      resolve(matchingBooks);
    }, 100);
  });
};

const getBooksByTitleAsync = (title) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const matchingBooks = Object.values(books).filter(
        book => book.title.toLowerCase() === title.toLowerCase()
      );
      resolve(matchingBooks);
    }, 100);
  });
};

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  if (users.find(user => user.username === username)) {
    return res.status(409).json({ message: "Username already exists" });
  }
  users.push({ username, password });
  res.status(201).json({ message: "User registered successfully" });
});

public_users.get('/', async (req, res) => {
  try {
    const bookList = await getBooksAsync();
    res.status(200).send(JSON.stringify(bookList, null, 2));
  } catch (error) {
    res.status(500).json({ message: "Error fetching books" });
  }
});

public_users.get('/isbn/:isbn', async (req, res) => {
  try {
    const isbn = req.params.isbn;
    const book = await getBookByISBNAsync(isbn);
    res.status(200).send(JSON.stringify(book, null, 2));
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

public_users.get('/author/:author', async (req, res) => {
  try {
    const author = req.params.author;
    const matchingBooks = await getBooksByAuthorAsync(author);
    if (matchingBooks.length > 0) {
      res.status(200).send(JSON.stringify(matchingBooks, null, 2));
    } else {
      res.status(404).json({ message: "No books found by this author" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching books" });
  }
});

public_users.get('/title/:title', async (req, res) => {
  try {
    const title = req.params.title;
    const matchingBooks = await getBooksByTitleAsync(title);
    if (matchingBooks.length > 0) {
      res.status(200).send(JSON.stringify(matchingBooks, null, 2));
    } else {
      res.status(404).json({ message: "No books found with this title" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching books" });
  }
});

public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.status(200).send(JSON.stringify(books[isbn].reviews, null, 2));
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;