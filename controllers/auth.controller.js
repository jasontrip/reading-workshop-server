const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const { JWT_SECRET, JWT_EXPIRY } = require('../config');

const createAuthToken = user => jwt.sign({ user }, JWT_SECRET, {
  subject: user.username,
  expiresIn: JWT_EXPIRY,
  algorithm: 'HS256',
});

const login = (req, res) => {
  User.findOne({ username: req.user.username })
    .then((user) => {
      const authToken = createAuthToken(user.serialize());
      res.json({
        authToken,
        user: user.serialize(),
      });
    })
    .catch(() => res.status(500).json({ code: 500, message: 'Internal server error' }));
};

const refresh = (req, res) => {
  const authToken = createAuthToken(req.user);
  res.json({ authToken });
};

module.exports = { login, refresh };
