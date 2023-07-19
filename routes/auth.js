const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid'); // Import the uuid library
const User = require('../models/user');

const router = express.Router();

router.post('/signup', async (req, res) => {
    try {
      const { username, password } = req.body;
  
      // Check if the username already exists
     // console.log(password);
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(409).json({ message: 'Username already exists' });
      }
  
      // Create a new user with hashed password
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log(hashedPassword);
      const newUser = new User({ username, password: hashedPassword });
      console.log('New user before saving:', newUser);
      await newUser.save();
   
      res.status(201).json({ message: 'User registered successfully' });

    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  router.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
        // console.log(username, password);
      const user = await User.findOne({ username });
  
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      console.log('password before compare:', password);
     
      hashedPassword = user.password;
    
      const isPasswordValid = await bcrypt.compare(password, hashedPassword );
  
      console.log('isPasswordValid:', isPasswordValid);  
  
      if (isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials password' });
      }
  
      // If the password is valid, proceed with further actions, e.g., issuing a JWT token.
  
      res.json({ message: 'Login successful', user: user.username });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });
  

router.post('/refresh', async (req, res) => {
    try {
      const { refreshToken } = req.body;
  
      // Check if the refresh token is valid
      const user = await User.findOne({ refreshToken });
      if (!user) {
        return res.sendStatus(403);
      }
  
      // Generate a new access token
      const accessToken = jwt.sign({ userId: user._id, username: user.username }, 'your-secret-key', {
        expiresIn: '1h', // New access token expires in 1 hour
      });
  
      res.json({ accessToken });
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  

  module.exports = router;