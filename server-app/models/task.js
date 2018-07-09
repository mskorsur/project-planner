const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    description: { type: String, maxlength: 400 },
    label: { type: String, required: true, maxlength: 20 },
    dueDate: { type: Date },
    dependencies: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
    card: { type: Schema.Types.ObjectId, ref: 'Card', required: true }
});

taskSchema
.virtual('url')
.get(function () {
    return '/api/tasks' + this._id;
});

module.exports = mongoose.model('Task', taskSchema);