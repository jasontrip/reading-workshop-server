const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const WorkshopSchema = mongoose.Schema({
  date: { type: Date, required: true },
  book: { type: String },
  pages: { type: String },
  notes: { type: String },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
});

const StudentSchema = mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
});

const UserSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, default: '' },
  lastName: { type: String, default: '' },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  workshops: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Workshop' }],
});

UserSchema.methods.serialize = function serialize() {
  return {
    username: this.username,
    firstName: this.firstName,
    lastName: this.lastName,
    students: this.students,
    workshops: this.workshops,
  };
};

UserSchema.methods.validatePassword = function validatePassword(password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.statics.hashPassword = password => bcrypt.hash(password, 10);

function prePopulate() {
  this.populate('students');
  this.populate('workshops');
  this.populate('workshops.students');
}
UserSchema.pre('findOne', prePopulate);
UserSchema.pre('find', prePopulate);

const User = mongoose.model('User', UserSchema);
const Workshop = mongoose.model('Workshop', WorkshopSchema);
const Student = mongoose.model('Student', StudentSchema);
module.exports = { User, Workshop, Student };

