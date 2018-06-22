const Card = require('../models/card');
const Project = require('../models/project');

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
        res.status(409).json({message: 'Error occured', error: errors});
        return;
    }

    const card = new Card({
        _id: req.body.id,
        name: req.body.name,
        project: req.body.project,
        tasks: []
    });

    try {
        const projectUpdateMsg = await addCardToContainingProject(card.project, card._id);
        if (projectUpdateMsg === 'Project update successful during card create') {
            await card.save();
            res.status(201).json({message: 'Card created successfully', card_data: card});
        }
        else {
            res.status(409).json({message: 'Card not created, project update failed'});
        }
    }
    catch(err) {
        return next(err);
    }
}

async function addCardToContainingProject(projectId, cardId) {
    try {
        const project = await Project.findById(projectId)
                        .select({cards: 1})
                        .exec();

        project.cards = [...project.cards, cardId];
        await project.save();
        return 'Project update successful during card create';
    }
    catch(err) {
        return 'Project update fail during card create';
    }
}

exports.updateSingleCard = async function(req, res, next) {
    const cardId = req.params.id;

    checkIfRequiredCardDataIsPresent(req);
    escapeAndTrimCardData(req);
    const errors = req.validationErrors();
    if (errors) {
        res.status(409).json({message: 'Error occured', error: errors});
        return;
    }

    try {
        const foundCard = await Card.findById(cardId)
                            .select({__v: 0})
                            .exec();

        foundCard._id = req.body.id;
        foundCard.name = req.body.name;
        foundCard.project = req.body.project;

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
        const card = await Card.findById(cardId)
                    .select({project: 1})
                    .exec();
        
        if (card === null) {
            res.status(409).json({message: 'Card not deleted'});
            return;
        }
        
        const projectUpdateMsg = await removeCardFromContainingProject(card.project, cardId)
        if (projectUpdateMsg === 'Project update successful during card delete') {
            await Card.findByIdAndRemove(cardId);
            res.status(204).json({message: 'Card deleted successfully'});
        }
        else {
            res.status(409).json({message: 'Card not deleted, project update failed'});
        }
    }
    catch(err) {
        return next(err);
    }
}

async function removeCardFromContainingProject(projectId, cardId) {
    try {
        const project = await Project.findById(projectId)
                        .select({cards: 1})
                        .exec();
                    
        const cardsWithoutDeletedCard = project.cards.filter(card => card !== cardId);
        project.cards = [...cardsWithoutDeletedCard];
        await project.save();
        return 'Project update successful during card delete';
    }
    catch(err) {
        return 'Project update fail during card delete';
    }
}

exports.getCardTasks = async function(req, res, next) {
    const cardId = req.params.id;

    try {
        const card = await Card.findById(cardId)
                    .select({__v: 0})
                    .populate({path: 'tasks', select: '-__v'})
                    .exec();
        
        if (card !== null) {
            res.status(200).json({tasks: card.tasks});
        }
        else {
            res.status(409).json({message: 'Card not found'});
        }
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
        
        if (card !== null) {
            card.tasks = [...req.body.tasks.split(',')];
            const updatedCard = await card.save();
            res.status(200).json({message: 'Card updated successfully', card_data: updatedCard.tasks});
        }
        else {
            res.status(409).json({message: 'Card not found'});
        }
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