module.exports = (taskData) => {
    if (taskData === null) {
        return null;
    }

    return {
        id: taskData._id,
        name: taskData.name,
        description: taskData.description,
        label: taskData.label,
        dueDate: taskData.dueDate,
        dependencies: taskData.dependencies,
        card: taskData.card
    }
}