const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: true, maxlength: 40 },
    status: { type: String, enum: ['Active', 'Paused', 'Done'] },
    lastModified: { type: Date },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    cards: [{ type: String, ref: 'Card' }]
});

projectSchema
.virtual('url')
.get(function() {
    return '/api/projects' + this._id;
});

module.exports = mongoose.model('Project', projectSchema);