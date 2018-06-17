const Card = require('../models/card');

exports.getCardList = async function(req, res, next) {
    try {
        const cardList = await Card.find()
                        .select({__v: 0})
                        .sort({name: 'ascending'})
                        .exec();
        
        res.status(200).json(cardList);
    }
    catch(err) {
        return next(err);
    }
}

exports.getSingleCard = async function(req, res, next) {
    const cardId = req.params.id;

    try {
        const card = await Card.findById(cardId)
                    .select({__v: 0})
                    .populate({path: 'tasks', select: '-__v'})
                    .exec();
        
        res.status(200).json(card);
    }
    catch(err) {
        return next(err);
    }
}

exports.createSingleCard = async function(req, res, next) {
    checkIfRequiredCardDataIsPresent(req);
    escapeAndTrimCardData(req);
    const errors = req.validationErrors();
    if (errors) {
        res.json({message: 'Error occured', error: errors});
        return;
    }

    const card = new Card({
        _id: req.body.id,
        name: req.body.name,
        project: req.body.project,
        tasks: []
    });

    try {
        await card.save();
        //add this card to corresponding project
        res.status(201).json({message: 'Card created successfully', card_data: card});
    }
    catch(err) {
        return next(err);
    }
}

exports.updateSingleCard = async function(req, res, next) {
    const cardId = req.params.id;

    checkIfRequiredCardDataIsPresent(req);
    escapeAndTrimCardData(req);
    const errors = req.validationErrors();
    if (errors) {
        res.json({message: 'Error occured', error: errors});
        return;
    }

    try {
        const foundCard = await Card.findById(cardId)
                            .select({__v: 0})
                            .exec();

        foundCard._id = req.body.id;
        foundCard.name = req.body.name;
        foundCard.project = req.body.project;
        //foundCard.tasks = [...req.body.tasks.split(',')];

        const updatedCard = await foundCard.save();
        res.status(200).json({message: 'Card updated successfully', card_data: updatedCard});
    }
    catch(err) {
        return next(err);
    }
}

exports.deleteSingleCard = async function(req, res, next) {
    const cardId = req.params.id;

    try {
        await Card.findByIdAndRemove(cardId);
        //delete card from project
        res.status(204).json({message: 'Card deleted successfully'});
    }
    catch(err) {
        return next(err);
    }
}

exports.getCardTasks = async function(req, res, next) {
    const cardId = req.params.id;

    try {
        const card = await Card.findById(cardId)
                    .select({__v: 0})
                    .populate({path: 'tasks', select: '-__v'})
                    .exec();
        
        res.status(200).json({tasks: card.tasks});
    }
    catch(err) {
        return next(err);
    }
}

exports.updateCardTasks = async function(req, res, next) {
    const cardId = req.params.id;

    try {
        const card = await Card.findById(cardId)
                    .select({tasks: 1})
                    .exec();
        
        card.tasks = [...req.body.tasks.split(',')];
        const updatedCard = await card.save();
        res.status(200).json({message: 'Card updated successfully', card_data: updatedCard.tasks});
    }
    catch(err) {
        return next(err);
    }
}

function checkIfRequiredCardDataIsPresent(req) {
    req.checkBody('id', 'Missing Id').notEmpty();
    req.checkBody('name', 'Missing name').notEmpty();
    req.checkBody('project', 'Missing project Id').notEmpty();
}

function escapeAndTrimCardData(req) {
    req.sanitize('id').escape();
    req.sanitize('name').escape();
    req.sanitize('project').escape();
    req.sanitize('tasks').escape();

    req.sanitize('id').trim();
    req.sanitize('name').trim();
    req.sanitize('project').trim();
    req.sanitize('tasks').trim();
}