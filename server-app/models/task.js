const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true, maxlength: 400 },
    label: { type: String, required: true, maxlength: 20 },
    dueDate: { type: Date },
    dependencies: [{ type: String, ref: 'Task' }],
    card: { type: String, ref: 'Card', required: true }
});

taskSchema
.virtual('url')
.get(function () {
    return '/api/tasks' + this._id;
});

module.exports = mongoose.model('Task', taskSchema);