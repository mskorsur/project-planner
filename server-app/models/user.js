const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const userSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, required: true },
    userName: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, maxlength: 40 },
    firstName: { type: String, required: true, maxlength: 20 },
    lastName: { type: String,  required: true, maxlength: 40},
    organization: { type: String, maxlength: 40 },
    github: { type: String },
    projects: [{ type: String, ref: 'Project' }]
});


userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(9));
};

userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

userSchema
.virtual('url')
.get(function() {
    return '/api/users/' + this._id;
});

userSchema
.virtual('fullName')
.get(function () {
    return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model('User', userSchema);