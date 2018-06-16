const Task = require('../models/task');

exports.getTaskList = async function(req, res, next) {
    try {
        const taskList = await Task.find()
                        .select({__v: 0})
                        .sort({name: 'ascending'})
                        .exec();
    
        res.status(200).json(taskList);
    }
    catch(err) {
        return next(err);
    }
}

exports.getSingleTask = async function(req, res, next) {
    const taskId = req.params.id;

    try {
        const task = await Task.findById(taskId)
                    .select({__v: 0})
                    .exec();
        
        res.status(200).json(task);
    }
    catch(err) {
        return next(err);
    }
}

exports.createSingleTask = async function(req, res, next) {
    checkIfRequiredTaskDataIsPresent(req);
    escapeAndTrimTaskData(req);
    const errors = req.validationErrors();
    if (errors) {
        res.json({message: 'Error occured', error: errors});
        return;
    }

    const task = new Task({
        _id: req.body.id,
        name: req.body.name,
        description: req.body.description,
        label: req.body.label,
        dueDate: req.body.dueDate || '',
        dependencies: [],
        card: req.body.card
    });

    try {
        await task.save();
        //find corresponding card and add this task to it
        res.status(201).json({message: 'Task created successfully', task_data: task});
    }
    catch(err) {
        return next(err);
    }
}

exports.updateSingleTask = async function(req, res, next) {
    const taskId = req.params.id;

    checkIfRequiredTaskDataIsPresent(req);
    escapeAndTrimTaskData(req);
    const errors = req.validationErrors();
    if (errors) {
        res.json({message: 'Error occured', error: errors});
        return;
    }

    try {
        let foundTask = await Task.findById(taskId)
                        .select({__v: 0})
                        .exec();
        
        const originalCard = foundTask.card;
        foundTask._id = taskId;
        foundTask.name = req.body.name;
        foundTask.description = req.body.description;
        foundTask.label = req.body.label;
        foundTask.dueDate = req.body.dueDate;
        foundTask.dependencies = [...req.body.dependencies.split(',')];
        foundTask.card = req.body.card;

        const updatedTask = await foundTask.save();
        //if originalCard !== updatedTask.card => remove task from original card and add task to new card
        res.status(200).json({message: 'Task updated successfully', task_data: updatedTask});
    }
    catch(err) {
        return next(err);
    }
}

exports.deleteSingleTask = async function(req, res, next) {
    const taskId = req.params.id;

    try {
        await Task.findByIdAndRemove(taskId);
        res.status(204).json({message: 'Task deleted successfully'});
    }
    catch(err) {
        return next(err);
    }
}

function checkIfRequiredTaskDataIsPresent(req) {
    req.checkBody('id', 'Missing Id').notEmpty();
    req.checkBody('name', 'Missing name').notEmpty();
    req.checkBody('description', 'Missing description').notEmpty();
    req.checkBody('label', 'Missing label').notEmpty();
    req.checkBody('card', 'Missing card Id').notEmpty();
}

function escapeAndTrimTaskData(req) {
    req.sanitize('id').escape();
    req.sanitize('name').escape();
    req.sanitize('description').escape();
    req.sanitize('label').escape();
    req.sanitize('dueDate').escape();
    req.sanitize('dependencies').escape();
    req.sanitize('card').escape();

    req.sanitize('id').trim();
    req.sanitize('name').trim();
    req.sanitize('description').trim();
    req.sanitize('label').trim();
    req.sanitize('dueDate').trim();
    req.sanitize('dependencies').trim();
    req.sanitize('card').trim();
}