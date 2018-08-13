const router = require('express').Router();
const passport = require('passport');
const controller = require('../controllers/students.controller');

const jwtAuth = passport.authenticate('jwt', { session: false });

router.post('/', jwtAuth, controller.addStudent);
router.delete('/', jwtAuth, controller.deleteStudent);

module.exports = router;
