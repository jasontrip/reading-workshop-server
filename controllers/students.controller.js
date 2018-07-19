const validateRequest = require('../utility/validate');
const Student = require('../models/student.model');


const addStudent = (req, res) => {
  const validationRules = {
    requiredFields: ['firstName', 'lastName'],
    stringFields: ['firstName', 'lastName'],
  };
  const error = validateRequest(req.body, validationRules);
  if (error) {
    return res.status(422).json(error);
  }

  return Student.create(req.body)
    .then(student => res.status(201).json(student))
    .catch(err => res.status(400).send(err));
};

const deleteStudent = (req, res) => {
  const validationRules = {
    requiredFields: ['_id'],
  };
  const error = validateRequest(req.body, validationRules);
  if (error) {
    return res.status(422).json(error);
  }

  return Student.deleteOne({ _id: req.body._id })
    .then(student => res.status(204).json(student))
    .catch(err => res.status(400).send(err));
};

module.exports = { addStudent, deleteStudent };
