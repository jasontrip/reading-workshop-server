const router = require('express').Router();
const passport = require('passport');
const controller = require('../controllers/workshops.controller');

const jwtAuth = passport.authenticate('jwt', { session: false });

router.post('/', jwtAuth, controller.addWorkshop);
router.post('/students', jwtAuth, controller.addStudentToWorkshop);
router.delete('/students', jwtAuth, controller.removeStudentFromWorkshop);

module.exports = router;
