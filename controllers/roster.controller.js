const validateRequest = require('../utility/validate');
const User = require('../models/user.model');
const Student = require('../models/student.model');


const addStudentToRoster = (req, res) => {
  const username = 'jason';

  const validationRules = {
    requiredFields: ['firstName', 'lastName'],
    stringFields: ['firstName', 'lastName'],
  };
  const error = validateRequest(req.body, validationRules);
  if (error) {
    return res.status(422).json(error);
  }

  Student.create(req.body)
    .then((student) => {
      User.findOneAndUpdate({ username }, { $push: { roster: student._id } })
        .then(() => res.json(student));
    })
    .catch(err => res.status(400).send(err));
};

const deleteStudentFromRoster = (req, res) => {
  const username = 'jason';

  const validationRules = {
    requiredFields: ['_id'],
  };
  const error = validateRequest(req.body, validationRules);
  if (error) {
    return res.status(422).json(error);
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

module.exports = { addStudentToRoster, deleteStudentFromRoster };
