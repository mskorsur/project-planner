const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cardSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: true, maxlength: 40 },
    project: { type: Schema.Types.ObjectId, required: true },
    tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }]
});

cardSchema
.virtual('url')
.get(function() {
    return '/api/cards' + this._id;
});

module.exports = mongoose.model('Card', cardSchema);