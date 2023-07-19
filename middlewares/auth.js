// middlewares/auth.js
const jwt = require('jsonwebtoken');

// Secret key for signing JWT tokens (should be securely stored)
const secretKey = 'your-secret-key';

// Middleware to verify the access token
function authenticateAccessToken(req, res, next) {
  const accessToken = req.headers.authorization?.split(' ')[1];

  if (!accessToken) {
    return res.sendStatus(401);
  }

  jwt.verify(accessToken, secretKey, (err, user) => {
    if (err) {
      // If access token is invalid or expired, try refreshing it
      return res.redirect('/refresh');
    }

    req.user = user;
    next();
  });
}

// Function to generate an access token
function generateAccessToken(user) {
  return jwt.sign({ userId: user.id, username: user.username }, secretKey, { expiresIn: '5m' });
}

// Function to generate a refresh token
function generateRefreshToken(user) {
  return jwt.sign({ userId: user.id, username: user.username }, secretKey, { expiresIn: '7d' });
}

// Middleware to handle access token refresh
function refreshTokenMiddleware(req, res, next) {
  const refreshToken = req.headers['x-refresh-token'];

  if (!refreshToken) {
    return res.sendStatus(401);
  }

  jwt.verify(refreshToken, secretKey, (err, user) => {
    if (err) {
      return res.sendStatus(401);
    }

    // Generate a new access token and store it in the request object
    const newAccessToken = generateAccessToken(user);
    req.newAccessToken = newAccessToken;
    next();
  });
}

module.exports = {
  authenticateAccessToken,
  generateAccessToken,
  generateRefreshToken,
  refreshTokenMiddleware,
};
