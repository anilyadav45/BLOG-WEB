const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

// GET register
router.get('/register', (req, res) => {
    res.render('register');
});

// POST register
router.post('/register', async (req, res) => {
    const { name, email, username, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.send("Passwords do not match");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.send("Email already exists");
    }

    const hash = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, username, password: hash });
    await newUser.save();

    res.redirect('/login');
});

// GET login
router.get('/login', (req, res) => {
    res.render('signin');
});

// POST login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.send("User not found");

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.send("Invalid credentials");

    req.session.userId = user._id;
    res.send(`Welcome ${user.name}`);
});

module.exports = router;
