const router = require('express').Router();
const controller = require('../controllers/roster.controller');

router.post('/', controller.addStudentToRoster);
router.delete('/', controller.deleteStudentFromRoster);

module.exports = router;
