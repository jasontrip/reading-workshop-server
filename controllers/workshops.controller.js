const validateRequest = require('../utility/validate');
const { User, Workshop } = require('../models/user.model');
const { internalServerError } = require('../utility/errors');

const addWorkshop = (req, res) => {
  const { username } = req.user;

  const validationRules = {
    requiredFields: ['date', 'book'],
    stringFields: ['book', 'pages', 'notes'],
  };
  const error = validateRequest(req.body, validationRules);
  if (error) {
    return res.status(422).json(error);
  }


  let user;
  let workshop;

  User.findOne({ username })
    .then((_user) => {
      user = _user;
      return Workshop.create(req.body);
    })
    .then((_workshop) => {
      workshop = _workshop;
      user.workshops.push(workshop._id);
      user.save();
    })
    .then(() => Workshop.populate(workshop, { path: 'students' }))
    .then(_workshop => res.status(200).json(_workshop))
    .catch((err) => {
      console.log(err);
      res.status(500).json(internalServerError);
    });

  return undefined;
};

const updateWorkshop = (req, res) => {
  const validationRules = {
    requiredFields: ['_id', 'date', 'book'],
    stringFields: ['_id', 'firstName', 'lastName', 'book', 'pages'],
  };
  const error = validateRequest(req.body, validationRules);
  if (error) {
    return res.status(422).json(error);
  }

  const { _id } = req.body;

  Workshop.findOneAndUpdate(
    { _id },
    { $set: req.body },
    { new: true },
  ).populate('students')
    .then(workshop => res.status(200).json(workshop))
    .catch(() => res.json(internalServerError));

  return undefined;
};

const deleteWorkshop = (req, res) => {
  const { username } = req.user;
  const validationRules = {
    requiredFields: ['_id'],
    stringFields: ['_id'],
  };
  const error = validateRequest(req.body, validationRules);
  if (error) {
    return res.status(422).json(error);
  }

  const { _id } = req.body;
  User.findOneAndUpdate({ username }, { $pull: { workshops: _id } })
    .then(() => Workshop.findOneAndDelete({ _id }))
    .then(() => res.status(204).send())
    .catch(() => res.status(500).send(internalServerError));

  return undefined;
};

module.exports = {
  addWorkshop,
  updateWorkshop,
  deleteWorkshop,
};
