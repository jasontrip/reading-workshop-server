const mongoose = require('mongoose');

const StudentSchema = mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
});

const Student = mongoose.model('Student', StudentSchema);
module.exports = Student;
