// app.js (or server.js)
const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const { authenticateAccessToken, refreshTokenMiddleware ,generateAccessToken,generateRefreshToken } = require('./middlewares/auth');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Middleware to protect routes that require authentication
///app.use(authenticateAccessToken);

// Authentication routes
app.post('/login', (req, res) => {
  // Authenticate user (check credentials, etc.)
  // ...console
console.log(req.body);
  // Assuming the user is authenticated and a user object is available
  const user = { id: 1, username: 'user123' };

  // Generate and send access token and refresh token in response
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  res.json({ accessToken, refreshToken });
});

app.get('/refresh', refreshTokenMiddleware, (req, res) => {
  // The middleware has already refreshed the access token.
  // Return the new access token to the client.
  res.json({ accessToken: req.newAccessToken });
});

// Protected route
app.get('/protected', authenticateAccessToken, (req, res) => {
  // This route requires a valid access token
  // Access token verification is done by the 'authenticateAccessToken' middleware.
  // If the token is valid, req.user will contain the user data.
  const user = req.user;
  res.json({ message: 'Protected endpoint accessed successfully', user });
});



module.exports =app;