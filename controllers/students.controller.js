const validateRequest = require('../utility/validate');
const { User } = require('../models/user.model');
const { internalServerError } = require('../utility/errors');


const addStudent = (req, res) => {
  const validationRules = {
    requiredFields: ['firstName', 'lastName'],
    stringFields: ['firstName', 'lastName'],
  };
  const error = validateRequest(req.body, validationRules);
  if (error) {
    return res.status(422).json(error);
  }

  const { username } = req.user;
  const { firstName, lastName } = req.body;
  const newStudent = { firstName, lastName };

  User.findOneAndUpdate({ username }, { $push: { students: newStudent } }, { new: true })
    .then(user => res.status(200).json(user.students[user.students.length - 1]))
    .catch(() => res.json(internalServerError));

  return undefined;
};

const deleteStudent = (req, res) => {
  const validationRules = {
    requiredFields: ['_id'],
  };
  const error = validateRequest(req.body, validationRules);
  if (error) {
    return res.status(422).json(error);
  }

  const { username } = req.user;
  const { _id } = req.body;

  User.findOneAndUpdate({ username }, { $pull: { students: { _id } } })
    .then(() => res.status(204).send())
    .catch(() => res.status(500).send(internalServerError));

  return undefined;
};

module.exports = { addStudent, deleteStudent };
