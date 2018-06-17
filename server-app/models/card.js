const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cardSchema = new Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true, maxlength: 40 },
    project: { type: String, required: true },
    tasks: [{ type: String, ref: 'Task' }]
});

cardSchema
.virtual('url')
.get(function() {
    return '/api/cards' + this._id;
});

module.exports = mongoose.model('Card', cardSchema);