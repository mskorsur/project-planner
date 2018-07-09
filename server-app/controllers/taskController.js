const Task = require('../models/task');
const Card = require('../models/card');
const mapTask = require('../utils/mapTask');
const mongoose = require('mongoose');

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
        
        res.status(200).json(mapTask(task));
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
        console.log(errors);
        res.status(409).json({message: 'Error occurred', error: errors});
        return;
    }

    const task = new Task({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        description: req.body.description,
        label: req.body.label,
        dueDate: req.body.dueDate || '',
        dependencies: [],
        card: req.body.card
    });

    try {
        const cardUpdateMsg = await addTaskToContainingCard(task.card, task._id);
        if (cardUpdateMsg === 'Card update successful during task create') {
            await task.save();
            res.status(201).json({message: 'Task created successfully', task_data: mapTask(task)});
        }
        else {
            res.status(409).json({message: 'Task not created, card update failed'});
        }
    }
    catch(err) {
        return next(err);
    }
}

async function addTaskToContainingCard(cardId, taskId) {
    try {
        const card = await Card.findById(cardId)
                    .select({tasks: 1})
                    .exec();
        
        card.tasks = [...card.tasks, taskId];
        await card.save();
        return 'Card update successful during task create';
    }
    catch(err) {
        return 'Card update fail during task create';
    }
}

exports.updateSingleTask = async function(req, res, next) {
    const taskId = req.params.id;

    checkIfRequiredTaskDataIsPresent(req);
    escapeAndTrimTaskData(req);
    const errors = req.validationErrors();
    if (errors) {
        res.status(409).json({message: 'Error occurred', error: errors});
        return;
    }

    try {
        const foundTask = await Task.findById(taskId)
                        .select({__v: 0})
                        .exec();
        
        const originalCard = foundTask.card.toString();
        const updatedCard = req.body.card;
        foundTask._id = taskId;
        foundTask.name = req.body.name;
        foundTask.description = req.body.description;
        foundTask.label = req.body.label;
        foundTask.dueDate = req.body.dueDate;
        foundTask.dependencies = updateTaskDependencies(req.body.dependencies);
        foundTask.card = updatedCard;

        if (originalCard === updatedCard) {
            const updatedTask = await foundTask.save();
            res.status(200).json({message: 'Task updated successfully', task_data: mapTask(updatedTask)});
            return;
        }
        //else, task's card has changed
        const removeMsg = await removeTaskFromContainingCard(originalCard, taskId);
        const addMsg = await addTaskToContainingCard(updatedCard, taskId);
        if (removeMsg === 'Card update successful during task delete' && addMsg === 'Card update successful during task create') {
            const updatedTask = await foundTask.save();
            res.status(200).json({message: 'Task updated successfully', task_data: mapTask(updatedTask)});
        }
        else {
            res.status(409).json({message: 'Task not updated, cards updates failed'});
        }

    }
    catch(err) {
        return next(err);
    }
}

function updateTaskDependencies(dependencies) {
    if (dependencies === '') {
        return [];
    }

    return [...dependencies.split(',')];
}

exports.deleteSingleTask = async function(req, res, next) {
    const taskId = req.params.id;

    try {
        const task = await Task.findById(taskId)
                        .select({card: 1})
                        .exec();

        if (task === null) {
            res.status(409).json({message: 'Task not deleted'});
            return;
        }
        
        const cardUpdateMsg = await removeTaskFromContainingCard(task.card, taskId);
        if (cardUpdateMsg === 'Card update successful during task delete') {
            await Task.findByIdAndRemove(taskId);
            res.status(204).json({message: 'Task deleted successfully'});
        }
        else {
            res.status(409).json({message: 'Task not deleted, card update failed'});
        }
    }
    catch(err) {
        return next(err);
    }
}

async function removeTaskFromContainingCard(cardId, taskId) {
    try {
        const card = await Card.findById(cardId)
                    .select({tasks: 1})
                    .exec();
        
        const tasksWithoutDeletedTask = card.tasks.filter(task => task.toString() !== taskId);
        card.tasks = [...tasksWithoutDeletedTask];
        await card.save();
        return 'Card update successful during task delete';
    }
    catch(err) {
        return 'Card update fail during task delete'
    }
}

function checkIfRequiredTaskDataIsPresent(req) {
    //req.checkBody('id', 'Missing Id').notEmpty();
    req.checkBody('name', 'Missing name').notEmpty();
    req.checkBody('description', 'Missing description').exists();
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