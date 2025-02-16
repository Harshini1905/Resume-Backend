const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const router = express.Router();

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Received login attempt with email:', email);  // Log the email received in the login attempt

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('No user found');
      return res.status(401).send('Invalid credentials');
    }

    // Log hashed password from DB and entered password
    console.log('Hashed password from DB:', user.password);
    console.log('Entered password:', password);

    // Trim both passwords to avoid space-related issues and compare
    const isPasswordMatch = await bcrypt.compare(password.trim(), user.password.trim());

    console.log('Password match result:', isPasswordMatch);  // Log the result of the comparison

    if (!isPasswordMatch) {
      console.log('Invalid password');
      return res.status(401).send('Invalid credentials');
    }

    console.log(`Login successful for email: ${email}`);
    res.status(200).send({ message: 'Login successful' });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send(`Error logging in: ${error.message}`);
  }
});

// Signup Route
router.post('/signup', async (req, res) => {
  const { username, email, password, mobile } = req.body;

  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).send('Email already exists');

    // Hash password and save new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword, mobile });
    await newUser.save();
    res.status(201).send('User registered successfully!');
  } catch (error) {
    res.status(400).send(`Error signing up: ${error.message}`);
  }
});

module.exports = router;
