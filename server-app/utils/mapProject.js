module.exports = (projectData) => {
    if (projectData === null) {
        return null;
    }

    return {
        id: projectData._id,
        name: projectData.name,
        status: projectData.status,
        lastModified: projectData.lastModified,
        user: projectData.user,
        cards: projectData.cards
    }
}