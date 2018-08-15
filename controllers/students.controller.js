const validateRequest = require('../utility/validate');
const { User, Student } = require('../models/user.model');
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

  let student;

  Student.create(newStudent)
    .then((_student) => {
      student = _student;
      return User.findOneAndUpdate({ username }, { $push: { students: student._id } });
    })
    .then(() => res.status(201).json(student))
    .catch((err) => {
      console.log(err);
      res.json(internalServerError);
    });

  return undefined;
};

const updateStudent = (req, res) => {
  const validationRules = {
    requiredFields: ['_id', 'firstName', 'lastName'],
    stringFields: ['_id', 'firstName', 'lastName'],
  };
  const error = validateRequest(req.body, validationRules);
  if (error) {
    return res.status(422).json(error);
  }

  const { username } = req.user;
  const { _id, firstName, lastName } = req.body;
  const updatedStudent = { _id, firstName, lastName };

  Student.findOneAndUpdate(
    { _id },
    { $set: updatedStudent },
    { new: true },
  )
    .then(student => res.status(200).json(student))
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

module.exports = { addStudent, deleteStudent, updateStudent };
