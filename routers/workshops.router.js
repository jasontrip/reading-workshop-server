const router = require('express').Router();
const controller = require('../controllers/workshops.controller');

router.post('/', controller.addWorkshop);
router.post('/:workshopSession/students', controller.addStudentToWorkshop);
router.delete('/:workshopSession/students', controller.deleteStudentFromWorkshop);

module.exports = router;
