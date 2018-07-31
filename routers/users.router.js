const router = require('express').Router();
const passport = require('passport');
const controller = require('../controllers/users.controller');

const jwtAuth = passport.authenticate('jwt', { session: false });

router.post('/', jwtAuth, controller.addUser);
router.get('/', jwtAuth, controller.getUser);

module.exports = router;
