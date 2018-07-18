const router = require('express').Router();
const passport = require('passport');
const controller = require('../controllers/auth.controller');

const localAuth = passport.authenticate('local', { session: false });
const jwtAuth = passport.authenticate('jwt', { session: false });

router.post('/login', localAuth, controller.login);
router.post('/refresh', jwtAuth, controller.refresh);

module.exports = router;

