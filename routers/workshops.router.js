const router = require('express').Router();
const controller = require('../controllers/workshops.controller');

router.post('/', controller.addWorkshop);
router.post('/students', controller.addStudentToWorkshop);
router.delete('/students', controller.removeStudentFromWorkshop);

module.exports = router;
