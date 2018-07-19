const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const WorkshopSchema = mongoose.Schema({
  date: { type: Date, required: true },
  book: { type: String },
  pages: { type: String },
  notes: { type: String },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
});

const UserSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, default: '' },
  lastName: { type: String, default: '' },
  roster: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  workshops: [WorkshopSchema],
});

UserSchema.methods.serialize = function serialize() {
  return {
    username: this.username,
    firstName: this.firstName,
    lastName: this.lastName,
    roster: this.roster,
    workshops: this.workshops,
  };
};

UserSchema.methods.validatePassword = function validatePassword(password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.statics.hashPassword = password => bcrypt.hash(password, 10);

const User = mongoose.model('User', UserSchema);
const Workshop = mongoose.model('Workshop', WorkshopSchema);
module.exports = { User, Workshop };

