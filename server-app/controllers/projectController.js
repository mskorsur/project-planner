const Project = require('../models/project');
const User = require('../models/user');
const mapProject = require('../utils/mapProject');
const mongoose = require('mongoose');

exports.getProjectList = async function(req, res, next) {
    try {
        const projectList = await Project.find()
                            .select({__v: 0})
                            .sort({name: 'ascending'})
                            .exec();
        
        res.status(200).json(projectList);
    }
    catch(err) {
        return next(err);
    }
}

exports.getSingleProject = async function(req, res, next) {
    const projectId = req.params.id;

    try {
        const project = await Project.findById(projectId)
                        .select({__v: 0})
                        .populate({path: 'cards', select: '-__v'})
                        .exec();
        
        res.status(200).json(mapProject(project));
    }
    catch(err) {
        return next(err);
    }
}

exports.createSingleProject = async function(req, res, next) {
    checkIfRequiredProjectDataIsPresent(req);
    escapeAndTrimProjectData(req);
    const errors = req.validationErrors();
    if (errors) {
        res.status(409).json({message: 'Error occurred', error: errors});
        return;
    }

    const project = new Project({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        status: req.body.status || 'Active',
        lastModified: req.body.lastModified || Date.now(),
        user: req.body.user,
        cards: []
    });

    try {
        const userUpdateMsg = await addProjectToContainingUser(project.user, project._id);
        if (userUpdateMsg === 'User update successful during project create') {
            await project.save();
            res.status(201).json({message: 'Project created successfully', project_data: mapProject(project)});
        }
        else {
            res.status(409).json({message: 'Project not created, user update fail'});
        }
    }
    catch(err) {
        return next(err);
    }
}

async function addProjectToContainingUser(userId, projectId) {
    try {
        const user = await User.findById(userId)
                    .select({projects: 1})
                    .exec();
        
        user.projects = [...user.projects, projectId];
        await user.save();
        return 'User update successful during project create';
    }
    catch(err) {
        return 'User update fail during project create';
    }
}

exports.updateSingleProject = async function(req, res, next) {
    const projectId = req.params.id;

    checkIfRequiredProjectDataIsPresent(req);
    escapeAndTrimProjectData(req);
    const errors = req.validationErrors();
    if (errors) {
        res.status(409).json({message: 'Error occurred', error: errors});
        return;
    }

    try {
        const foundProject = await Project.findById(projectId)
                            .select({__v: 0})
                            .exec();
        
        foundProject._id = projectId;
        foundProject.name = req.body.name;
        foundProject.status = req.body.status;
        foundProject.lastModified = req.body.lastModified;
        foundProject.user = req.body.user;

        const updatedProject = await foundProject.save();
        res.status(200).json({message: 'Project updated successfully', project_data: mapProject(updatedProject)});
    }
    catch(err) {
        return next(err);
    }
}

exports.deleteSingleProject = async function(req, res, next) {
    const projectId = req.params.id;

    try {
        const project = await Project.findById(projectId)
                        .select({user: 1})
                        .exec();
        
        if (project === null) {
            res.status(409).json({message: 'Project not deleted'});
            return;
        }
        
        const userUpdateMsg = await removeProjectFromContainingUser(project.user, projectId);
        if (userUpdateMsg === 'User update successful during project delete') {
            await Project.findByIdAndRemove(projectId);
            res.status(204).json({message: 'Project deleted successfully'});
        }
        else {
            res.status(409).json({message: 'Project not deleted, user update failed'});
        }
    }
    catch(err) {
        return next(err);
    }
}

exports.getProjectCards = async function(req, res, next) {
    const projectId = req.params.id;

    try {
        const project = await Project.findById(projectId)
                        .select({__v: 0})
                        .populate({path: 'cards', select: '-__v'})
                        .exec();

        if (project !== null) {
            res.status(200).json({cards: project.cards});
        }
        else {
            res.status(409).json({message: 'Project not found'});
        }
    }
    catch(err) {
        return next(err);
    }
}

exports.updateProjectCards = async function(req, res, next) {
    const projectId = req.params.id;

    try {
        const project = await Project.findById(projectId)
                        .select({cards: 1})
                        .exec();
        
        if (project != null) {
            project.cards = [...req.body.cards.split(',')];
            const updatedProject = await project.save();
            res.status(200).json({message: 'Project updated successfully', project_data: updatedProject.cards});
        }
        else {
            res.status(409).json({message: 'Project not found'});
        }
    }
    catch(err) {
        return next(err);
    }
}

async function removeProjectFromContainingUser(userId, projectId) {
    try {
        const user = await User.findById(userId)
                    .select({projects: 1})
                    .exec();
        
        const projectsWithoutDeletedProject = user.projects.filter(project => project !== projectId);
        user.projects = [...projectsWithoutDeletedProject];
        await user.save();
        return 'User update successful during project delete';
    }
    catch(err) {
        return 'User update fail during project delete';
    }
}

function checkIfRequiredProjectDataIsPresent(req) {
    //req.checkBody('id', 'Missing Id').notEmpty();
    req.checkBody('name', 'Missing name').notEmpty();
    req.checkBody('user', 'Missing user Id').notEmpty();
}

function escapeAndTrimProjectData(req) {
    req.sanitize('id').escape();
    req.sanitize('name').escape();
    req.sanitize('status').escape();
    req.sanitize('lastModified').escape();
    req.sanitize('user').escape();
    req.sanitize('cards').escape();

    req.sanitize('id').trim();
    req.sanitize('name').trim();
    req.sanitize('status').trim();
    req.sanitize('lastModified').trim();
    req.sanitize('user').trim();
    req.sanitize('cards').trim();
}