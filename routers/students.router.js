const router = require('express').Router();
const controller = require('../controllers/students.controller');

router.post('/', controller.addStudent);
router.delete('/', controller.deleteStudent);

module.exports = router;
