const validateRequest = require('../utility/validate');
const { User } = require('../models/user.model');

const getUser = (req, res) => {
  const username = 'jason';
  return User.findOne({ username })
    .then((user) => {
      res.json(user.serialize());
    });
};


const addUser = (req, res) => {
  const validationRules = {
    requiredFields: ['username', 'password'],
    stringFields: ['username', 'password', 'firstName', 'lastName'],
    trimmedFields: ['username', 'password'],
    sizedFields: {
      username: {
        min: 1,
      },
      password: {
        min: 10,
        max: 72, // 72 is max bcrypt length
      },
    },
  };

  const error = validateRequest(req.body, validationRules);
  if (error) {
    return res.status(422).json(error);
  }

  // create user if username is unique
  const { username, password } = req.body;
  let { firstName = '', lastName = '' } = req.body;
  firstName = firstName.trim();
  lastName = lastName.trim();

  return User.find({ username })
    .count()
    .then((count) => {
      if (count > 0) {
        const validationError = {
          code: 422,
          reason: 'ValidationError',
          message: 'Username already taken',
          location: 'username',
        };
        throw validationError;
      }
      return User.hashPassword(password);
    })
    .then(hash => User.create({
      username,
      firstName,
      lastName,
      password: hash,
    }))
    .then(user => res.status(201).json(user.serialize()))
    .catch((err) => {
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      console.log(err);
      return res.status(500).json({ code: 500, message: 'Internal server error' });
    });
};

module.exports = { getUser, addUser };
