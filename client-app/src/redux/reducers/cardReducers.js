import { ADD_CARD,
         UPDATE_CARD,
         REMOVE_CARD,
         ADD_TASK,
         REMOVE_TASK,
         MOVE_TASK } from '../actions/actionTypes';

const initialState = {
    byId: {},
    allIds: []
}

//CASE REDUCERS
function addCardById(byIdState, action) {
    const { payload } = action;
    const newCard = {
        id: action.id,
        ...payload,
        tasks: []
    }
    return Object.assign({}, byIdState, {
        [newCard.id]: newCard
    });
}

function updateCardById(byIdState, action) {
    const cardId = action.id;
    const { payload } = action;
    const updatedCard = Object.assign({}, byIdState[cardId], payload);

    return Object.assign({}, byIdState, {
        [cardId]: updatedCard
    });
}

function removeCardById(byIdState, action) {
    const cardId = action.id;
    let stateWithoutRemovedCard = {...byIdState};
    delete stateWithoutRemovedCard[cardId];

    return stateWithoutRemovedCard;
}

function addTaskToCard(byIdState, action) {
    const cardId = action.payload.card;
    const taskId = action.id;

    const cardTasksWithNewTask = [...byIdState[cardId].tasks, taskId];
    const updatedCard = Object.assign({}, byIdState[cardId], {
        tasks: cardTasksWithNewTask
    });

    return Object.assign({}, byIdState, {
        [cardId]: updatedCard
    });
}

function removeTaskFromCard(byIdState, action) {
    const cardId = action.card;
    const taskId = action.id;

    let cardTasks = [...byIdState[cardId].tasks];
    let tasksWithoutRemovedTask = cardTasks.filter(task => task !== taskId);
    const updatedCard = Object.assign({}, byIdState[cardId], {
        tasks: tasksWithoutRemovedTask
    });

    return Object.assign({}, byIdState, {
        [cardId]: updatedCard
    });
}

function moveTaskFromSrcToDestCard(byIdState, action) {
    const sourceCardId = action.source;
    const destinationCardId = action.destination;
    const taskId = action.id;

    let srcCardTasks = [...byIdState[sourceCardId].tasks];
    let srcTasksWithoutMovedTask = srcCardTasks.filter(task => task !== taskId);
    const updatedSrcCard = Object.assign({}, byIdState[sourceCardId], {
        tasks: srcTasksWithoutMovedTask
    });

    let destCardTasks = [...byIdState[destinationCardId].tasks, taskId];
    const updatedDestCard = Object.assign({}, byIdState[destinationCardId], {
        tasks: destCardTasks
    });

    return Object.assign({}, byIdState, {
        [sourceCardId]: updatedSrcCard,
        [destinationCardId]: updatedDestCard
    });
}

function addCardAllIds(allIdsState, action) {
    return [...allIdsState, action.id];
}

function removeCardAllIds(allIdsState, action) {
    return allIdsState.filter(cardId => cardId !== action.id);
}

//SLICE REDUCERS
function reduceById(byIdState, action) {
    switch(action.type) {
        case ADD_CARD: return addCardById(byIdState, action);
        case UPDATE_CARD: return updateCardById(byIdState, action);
        case REMOVE_CARD: return removeCardById(byIdState, action);
        case ADD_TASK: return addTaskToCard(byIdState, action);
        case REMOVE_TASK: return removeTaskFromCard(byIdState, action);
        case MOVE_TASK: return moveTaskFromSrcToDestCard(byIdState, action);
        default: return byIdState;
    }
}

function reduceAllIds(allIdsState, action) {
    switch(action.type) {
        case ADD_CARD: return addCardAllIds(allIdsState, action);
        case REMOVE_CARD: return removeCardAllIds(allIdsState, action);
        default: return allIdsState;
    }
}

//DOMAIN REDUCER
export function cardReducer(state = initialState, action) {
    return {
        byId: reduceById(state.byId, action),
        allIds: reduceAllIds(state.allIds, action)
    }
}