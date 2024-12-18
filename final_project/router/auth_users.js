const express = require('express');
const jwt = require('jsonwebtoken');
let books = require('./booksdb.js');
const session = require('express-session');
const regd_users = express.Router();

let users = [];

// Function to check if the user exists
const isValid = (username) => {
let userswithsamename = users.filter((user) => {
    return user.username === username;
});
    return userswithsamename.length > 0;
};

// Function to check if the user is authenticated
const authenticatedUser = (username, password) => {
let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
});
    return validusers.length > 0;
};

// Middleware to authenticate users using JWT
regd_users.use('/auth', function auth(req, res, next) {
    if (req.session.authorization) { // Get the authorization object stored in the session
        const token = req.session.authorization['accessToken']; // Retrieve the token from authorization object
        jwt.verify(token, 'access', (err, user) => { // Use JWT to verify token
    if (!err) {
        req.user = user;
        next();
    } else {
        console.log("JWT verification error:", err);
    return res.status(403).json({ message: 'User not authenticated' });
    }
});
    } else {
        console.log("No authorization in session");
    return res.status(403).json({ message: 'User not logged in' });
    }
});

// Route to handle user registration
regd_users.post('/register', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
        if (!isValid(username)) {
            users.push({ 'username': username, 'password': password });
            console.log("User registered:", username);
            return res.status(200).json({ message: 'User successfully registered. Now you can login' });
        } else {
            return res.status(404).json({ message: 'User already exists!' });
        }
    }
    return res.status(404).json({ message: 'Unable to register user.' });
});

// Only registered users can login
regd_users.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
        if (!username || !password) {
            return res.status(404).json({ message: 'Error logging in' });
        }
    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
        data: password
        }, 'access', { expiresIn: 60 * 60 });
            req.session.authorization = {
            accessToken, username
        };
        console.log("User logged in:", username);
        return res.status(200).send('User successfully logged in');
    } else {
        return res.status(208).json({ message: 'Invalid Login. Check username and password' });
    }
});

// Add a book review
regd_users.put('/auth/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const review = req.body.review;
    const username = req.session.authorization.username;
    
    console.log(`ISBN: ${isbn}, Username: ${username}, Review: ${review}`);
    
    if (!books[isbn]) {
        return res.status(404).json({ message: 'Book not found' });
    }
    
    if (!review) {
        return res.status(400).json({ message: 'Review content is required' });
    }
    
    if (!books[isbn].reviews) {
        books[isbn].reviews = {};
    }
    
    books[isbn].reviews[username] = review;
    console.log("Review added by", username, "for book", isbn);
    return res.status(200).json({ message: 'Review added successfully' 
    });
});

// Delete a book review
regd_users.delete('/auth/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
    
    if (!books[isbn]) {
        return res.status(404).json({ message: 'Book not found' });
    }
    
    if (!books[isbn].reviews || !books[isbn].reviews[username]) {
    return res.status(404).json({ message: 'Review not found' });
    }
    
    delete books[isbn].reviews[username];
    console.log("Review deleted by", username, "for book", isbn);
    return res.status(200).json({ message: 'Review deleted successfully' });
    });

// Main endpoint to be accessed by authenticated users
regd_users.get('/auth/get_message', (req, res) => {
    return res.status(200).json({ message: 'Hello, You are an authenticated user. Congratulations!' });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
