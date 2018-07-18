const jwt = require('jsonwebtoken');

const { JWT_SECRET, JWT_EXPIRY } = require('../config');

const createAuthToken = user => jwt.sign({ user }, JWT_SECRET, {
  subject: user.username,
  expiresIn: JWT_EXPIRY,
  algorithm: 'HS256',
});

const login = (req, res) => {
  const { user } = req;
  const authToken = createAuthToken(user);
  res.json({
    authToken,
    user,
  });
};

const refresh = (req, res) => {
  const authToken = createAuthToken(req.user);
  res.json({ authToken });
};

module.exports = { login, refresh };
