const validateRequest = require('../utility/validate');
const User = require('../models/user.model');


const addStudentToRoster = (req, res) => {
  const username = 'jason';

  const validationRules = {
    requiredFields: ['_id'],
  };
  const error = validateRequest(req.body, validationRules);
  if (error) {
    return res.status(422).json(error);
  }

  const { _id } = req.body;
  const studentExists = { message: 'student is already in roster' };

  return User.findOne({ username })
    .then(user => user.roster.find(student => student._id.equals(_id)))
    .then((studentId) => {
      if (studentId) {
        throw studentExists;
      }
      return studentId;
    })
    .then(() => User.findOneAndUpdate({ username }, { $push: { roster: _id } }))
    .then(() => res.status(200).json(_id))
    .catch((err) => {
      if (err === studentExists) {
        res.status(200).json(studentExists);
      }
      res.status(500).json({ code: 500, message: 'Internal server error' });
    });
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
    { $pull: { roster: _id } },
  )
    .then(() => res.status(204).send())
    .catch(() => res.status(500).json({ code: 500, message: 'Internal server error' }));
};

module.exports = { addStudentToRoster, deleteStudentFromRoster };
