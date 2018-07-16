const router = require('express').Router();
const controller = require('../controllers/users.controller');

router.post('/', controller.addUser);
router.get('/', controller.getUser);

module.exports = router;
