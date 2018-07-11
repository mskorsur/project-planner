const Card = require('../models/card');

module.exports = (cards) => {
    cards.forEach(async cardId => {
        await Card.findByIdAndRemove(cardId);
    });
}