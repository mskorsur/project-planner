module.exports = (cardData) => {
    if (cardData === null) {
        return null;
    }

    return {
        id: cardData.id,
        name: cardData.name,
        project: cardData.project,
        tasks: cardData.tasks
    }
}