const User = require('../models/user');

exports.getUserList = async function(req, res, next) {
    try {
        const userList = await User.find()
                        .select({password: 0, __v: 0})
                        .sort({lastName: 'ascending'})
                        .exec();
        
        res.status(200).json(userList);
    }
    catch(err) {
        return next(err);
    }
}

exports.getSingleUser = async function(req, res, next) {
    const userId = req.params.id;

    try {
        const user = await User.findById(userId)
                    .select({password: 0, __v: 0})
                    .populate({path: 'projects', select: '-__v'})
                    .exec();
        
        res.status(200).json(user);
    }
    catch(err) {
        return next(err);
    }
}

exports.createSingleUser = async function(req, res, next) {
    checkIfRequiredUserDataIsPresent(req, true);
    escapeAndTrimUserData(req);
    const errors = req.validationErrors();
    if (errors) {
        res.json({message: 'Error occured', error: errors});
        return;
    }

    const existingUser = await User.findOne({userName: req.body.userName});
    if (existingUser !== null) {
        res.json({message: 'Username already exists'});
        return;
    }

    const user = new User({
        _id: req.body.id,
        userName: req.body.userName,
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        organization: req.body.organization || '',
        github: req.body.github || '',
        projects: [] 
    });
    user.password = user.generateHash(req.body.password);

    try {
        await user.save();

        res.status(201).json({message: 'User created successfully', user_data: user});
    }
    catch (err) {
        return next(err);
    }
}

exports.updateSingleUser = async function(req, res, next) {
    const userId = req.params.id;

    checkIfRequiredUserDataIsPresent(req, false);
    escapeAndTrimUserData(req);
    const errors = req.validationErrors();
    if (errors) {
        res.json({message: 'Error occured', error: errors});
        return;
    }

    //only update user's password if that option is set to true
    if(req.query.password) {
        updateUserPassword(req, res, next);
        return;
    }

    try {
        const foundUser = await User.findById(userId)
                        .select({password: 0, __v: 0})
                        .exec();
        foundUser._id = userId;
        foundUser.email = req.body.email;
        foundUser.firstName = req.body.firstName;
        foundUser.lastName = req.body.lastName;
        foundUser.organization = req.body.organization;
        foundUser.github = req.body.github;
        foundUser.projects = [...req.body.projects.split(',')];

        const updatedUser = await foundUser.save();
        res.status(200).json({message: 'User updated successfully', user_data: updatedUser});
    }
    catch(err) {
        return next(err);
    }
}

async function updateUserPassword(req, res, next) {
    const userId = req.params.id;

    try {
        let foundUser = await User.findById(userId)
                        .select({password: 1})
                        .exec();
        
        if (foundUser.validPassword(req.body.currentPassword) && req.body.newPassword === req.body.repeatNewPassword) {
            foundUser.password = foundUser.generateHash(req.body.newPassword);
            await foundUser.save();
            res.status(200).json({message: 'User updated successfully'});
        }
        else {
            res.status(409).json({message: 'Password error'});
        }
    }
    catch(err) {
        return next(err);
    }
}

exports.deleteSingleUser = async function(req, res, next) {
    const userId = req.params.id;

    try {
        await User.findByIdAndRemove(userId);
        res.status(204).json({message: 'User deleted successfully'});
    }
    catch(err) {
        return next(err);
    }
}

exports.getUserProjects = async function(req, res, next) {
    const userId = req.params.id;

    try {
        const user = await User.findById(userId)
                    .select({password: 0, __v: 0})
                    .populate({path: 'projects', select: '-__v'})
                    .exec();
        
        res.status(200).json({projects: user.projects});
    }
    catch(err) {
        return next(err);
    }
}

exports.updateUserProjects = async function(req, res, next) {
    const userId = req.params.id;

    try {
        const user = await User.findById(userId)
                    .select({projects: 1})
                    .exec();
        
        user.projects = [...req.body.projects.split(',')];
        const updatedUser = await user.save();
        res.status(200).json({message: 'User updated successfully', user_data: updatedUser.projects});
    }
    catch(err) {
        return next(err);
    }
}

function checkIfRequiredUserDataIsPresent(req, isCreate) {
    req.checkBody('id', 'Missing Id').notEmpty();
    if (isCreate) {
        req.checkBody('userName', 'Missing username').notEmpty();
        req.checkBody('password', 'Missing password').notEmpty();
    }
    req.checkBody('email', 'Missing email').notEmpty();
    req.checkBody('firstName', 'Missing first name').notEmpty();
    req.checkBody('lastName', 'Missing last name').notEmpty();
}

function escapeAndTrimUserData(req) {
    req.sanitize('id').escape();
    req.sanitize('userName').escape();
    req.sanitize('password').escape();
    req.sanitize('email').escape();
    req.sanitize('firstName').escape();
    req.sanitize('lastName').escape();
    req.sanitize('organization').escape();
    req.sanitize('github').escape();
    req.sanitize('projects').escape();

    req.sanitize('id').trim();
    req.sanitize('userName').trim();
    req.sanitize('password').trim();
    req.sanitize('email').trim();
    req.sanitize('firstName').trim();
    req.sanitize('lastName').trim();
    req.sanitize('organization').trim();
    req.sanitize('github').trim();
    req.sanitize('projects').trim();
}