const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/books',function (req, res) {
  res.send(books);
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
  //Extract the isbn parameter from the request URL
  const isbn = req.params.isbn;
  let book = null;
  
  //Filter the books array to find books which's isbn matches the extracted isbn parameter
  for (let key in books) {
  if (books[key].isbn === isbn) {
    book = books[key];
    break;
    }
  }
  //Error check if a book with the isbn exist
  if (book) {
    return res.status(200).json(book);
    } else {
    return res.status(404).json({ message: "Book not found" });
    }
  });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Extract the author parameter from the request URL
  const author = req.params.author;
  let book = null;
  
  //Filter the books array to find books which's author matches the extracted author parameter
  for (let key in books) {
  if (books[key].author === author) {
    book = books[key];
    break;
    }
  }
  //Error check if a book exist
  if (book) {
    return res.status(200).json(book);
    } else {
    return res.status(404).json({ message: "Book not found" });
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Extract the author parameter from the request URL
  const title = req.params.title;
  let book = null;
  
  //Filter the books array to find books which's author matches the extracted author parameter
  for (let key in books) {
  if (books[key].title === title) {
    book = books[key];
    break;
    }
  }
  //Error check if a book exist
  if (book) {
    return res.status(200).json(book);
    } else {
    return res.status(404).json({ message: "Book not found" });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
