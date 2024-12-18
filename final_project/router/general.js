const express = require('express');
const books = require('./booksdb');
const axios = require('axios');
let isValid = require('./auth_users.js').isValid;
let users = require('./auth_users.js').users;
const public_users = express.Router();

// Get the book list available in the shop using a promise
public_users.get('/books', function (req, res) {
    let getBooksPromise = new Promise((resolve, reject) => {
        // Simulate a delay, e.g., fetching data from a database
        setTimeout(() => {
            resolve(books);
        }, 6000); // 6 seconds delay
    });
    
    // Handle the promise
    getBooksPromise.then((bookList) => {
        res.send(bookList);
    }).catch((error) => {
        res.status(500).send("Error fetching books");
    });
});

// // Get the book list available in the shop
// public_users.get('/books', function (req, res) {
//     res.send(books);
// });

// Get book details based on ISBN with a 6-second delay using a promise
public_users.get('/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    console.log(`Searching for ISBN: ${isbn}`);
    
    let getBookPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
            if (books[isbn]) {
                resolve(books[isbn]);
            } else {
                reject({ message: "Book not found" });
            }
        }, 6000); // 6 seconds delay
    });
    
    getBookPromise.then((book) => {
        console.log(`Book found: ${JSON.stringify(book)}`);
        return res.status(200).json(book);
    }).catch((error) => {
        console.log(error.message);
        return res.status(404).json(error);
    });
});

// Get book details based on ISBN
// public_users.get('/isbn/:isbn', (req, res) => {
//     const isbn = req.params.isbn;
//     let book = null;

//     for (let key in books) {
//         if (books[key].isbn === isbn) {
//             book = books[key];
//             break;
//         }
//     }   

//     if (book) {
//         return res.status(200).json(book);
//     } else {
//         return res.status(404).json({ message: "Book not found" });
//     }
// });

// Get book details based on author using async/await with Axios
public_users.get('/author/:author', async (req, res) => {
const author = req.params.author;
let result = [];

try {
// Here, we are not actually fetching from an external API but using local booksdb.js

    for (let key in books) {
        if (books[key].author === author) {
            result.push(books[key]);
        }
    }

    if (result.length > 0) {
            return res.status(200).json(result);
        } else {
            return res.status(404).json({ message: "No books found by this author" });
        }
        } catch (error) {
            console.error('Error fetching data:', error);
            return res.status(500).json({ message: "Error fetching books" });
        }
    });

// Get all books based on title using async/await with Axios
public_users.get('/title/:title', async (req, res) => {
    const title = req.params.title;
    let result = [];
    
    try {
    // Simulate fetching data from an external API
    //Since we're not actually fetching data from a web-api, the axios part cannot be implemented
    
    for (let key in books) {
        if (books[key].title === title) {
            result.push(books[key]);
        }
    }
    
    if (result.length > 0) {
        return res.status(200).json(result);
        } else {
            return res.status(404).json({ message: "No books found with this title" });
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        return res.status(500).json({ message: "Error fetching books" });
    }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
const isbn = req.params.isbn;
let bookFound = null;

    for (let key in books) {
        if (books[key].isbn === isbn) {
            bookFound = books[key];
            break;
        }
    }

    if (!bookFound) {
        return res.status(404).json({ message: "Book not found" });
    }

    const reviews = bookFound.reviews;
    return res.status(200).json({ reviews: reviews });
});

module.exports.general = public_users;