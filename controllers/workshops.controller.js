const validateRequest = require('../utility/validate');
const User = require('../models/user.model');

const addWorkshop = (req, res) => {
  const username = 'jason';

  const validationRules = {
    requiredFields: ['date', 'book', 'pages', 'notes'],
    stringFields: ['book', 'pages', 'notes'],
  };
  const message = validateRequest(req.body, validationRules);
  if (message) {
    return res.status(422).json({
      message,
      code: 422,
      reason: 'ValidationError',
    });
  }

  const {
    sessionId,
    date,
    book,
    pages,
    notes,
  } = req.body;

  // User.find({ username })
  //   .then((user) => {
  //     if (!sessionId) {
  //       user.workshops.push({
  //         date,
  //         book,
  //         pages,
  //         notes,
  //       });
  //     }
  //   });

  return res.send(date + book + pages + notes);
};

const addStudentToWorkshop = (req, res) => {
  const username = 'jason';

  const validationRules = {
    requiredFields: ['firstName', 'lastName'],
    stringFields: ['firstName', 'lastName'],
  };
  const message = validateRequest(req.body, validationRules);
  if (message) {
    return res.status(422).json({
      message,
      code: 422,
      reason: 'ValidationError',
    });
  }

  const { firstName, lastName } = req.body;

  return User.findOne(
    { username },
    { roster: 1 },
  )
    .then((user) => {
      user.roster.push({ firstName, lastName });
      return user.save();
    })
    .then(() => res.status(200).send())
    .catch(err => res.status(400).send(err));
};

const deleteStudentFromWorkshop = (req, res) => {
  const username = 'jason';

  const validationRules = {
    requiredFields: ['_id'],
  };
  const message = validateRequest(req.body, validationRules);
  if (message) {
    return res.status(422).json({
      message,
      code: 422,
      reason: 'ValidationError',
    });
  }

  const { _id } = req.body;

  return User.findOneAndUpdate(
    { username },
    { $pull: { roster: { _id } } },
    { new: true },
  )
    .then(() => res.status(200).send())
    .catch(err => res.status(400).send(err));
};

module.exports = {
  addWorkshop,
  addStudentToWorkshop,
  deleteStudentFromWorkshop,
};
