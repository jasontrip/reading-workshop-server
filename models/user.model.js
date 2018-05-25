const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
	username: {type: String, required: true, unique: true},
	password: {type: String, required: true},
	firstName: {type: String, default: ''},
	lastName: {type: String, default: ''}
});

UserSchema.methods.serialize = () => {
	return {
		username: this.username,
		firstName: this.firstName,
		lastName: this.lastName
	}
}

module.exports = mongoose.model('User', UserSchema);