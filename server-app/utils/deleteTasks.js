const Task = require('../models/task');

module.exports = (tasks) => {
    tasks.forEach(async taskId => {
        await Task.findByIdAndRemove(taskId);
    });
}