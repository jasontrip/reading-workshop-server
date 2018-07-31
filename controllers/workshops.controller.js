const validateRequest = require('../utility/validate');
const { User, Workshop } = require('../models/user.model');

// User.findOneAndUpdate({ username: "jason" },
//     { workshops: { $pull: { "book": "Other Book" } } },
//     { new: true }
//   )
//   .then(user => console.log(user));

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
    date, book, pages, notes,
  } = req.body;
  let user;
  let workshop;

  return User.findOne({ username })
    .then((_user) => {
      user = _user;
      return Workshop.create({
        date, book, pages, notes,
      });
    })
    .then((_workshop) => {
      workshop = _workshop;
      user.workshops.push(workshop);
      return user.save();
    })
    .then(() => res.status(200).json(workshop))
    .catch(err => res.json(err));
};

const addStudentToWorkshop = (req, res) => {
  const username = 'jason';

  const validationRules = {
    requiredFields: ['workshopId', 'studentId'],
    stringFields: ['workshopId', 'studentId'],
  };
  const message = validateRequest(req.body, validationRules);
  if (message) {
    return res.status(422).json({
      message,
      code: 422,
      reason: 'ValidationError',
    });
  }

  const { workshopId, studentId } = req.body;

  const query = {
    username,
    'workshops._id': workshopId,
  };
  const update = {
    $addToSet: {
      'workshops.$.students': studentId,
    },
  };
  User.findOneAndUpdate(query, update, { new: true })
    .then(user => res.status(200).json(user))
    .catch(err => res.status(400).send(err));

  return undefined;
};

const removeStudentFromWorkshop = (req, res) => {
  const username = 'jason';

  const validationRules = {
    requiredFields: ['workshopId', 'studentId'],
  };
  const message = validateRequest(req.body, validationRules);
  if (message) {
    return res.status(422).json({
      message,
      code: 422,
      reason: 'ValidationError',
    });
  }

  const { workshopId, studentId } = req.body;
  const query = {
    username,
    'workshops._id': workshopId,
  };
  const update = {
    $pull: {
      'workshops.$.students': studentId,
    },
  };

  User.findOneAndUpdate(query, update, { new: true })
    .then(() => res.status(204).send())
    .catch(err => res.status(400).send(err));

  return undefined;
};

module.exports = {
  addWorkshop,
  addStudentToWorkshop,
  removeStudentFromWorkshop,
};
