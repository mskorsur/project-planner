import { ADD_CARD,
         UPDATE_CARD,
         REMOVE_CARD,
         FETCH_PROJECT_CARDS,
         FETCH_CARDS_SUCCESS,
         ADD_TASK,
         REMOVE_TASK,
         MOVE_TASK } from '../actions/actionTypes';

const initialState = {
    isFetching: false,
    byId: {},
    allIds: []
}

//CASE REDUCERS
function addCardById(byIdState, action) {
    const { payload } = action;
    const newCard = {
        ...payload,
        tasks: []
    }
    return Object.assign({}, byIdState, {
        [newCard.id]: newCard
    });
}

function updateCardById(byIdState, action) {
    const { payload } = action;
    const cardId = payload.id;
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
    const taskId = action.payload.id;

    if (byIdState[cardId].tasks.includes(taskId)) {
        return byIdState;
    }

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
    if (allIdsState.includes(action.payload.id)) {
        return allIdsState;
    }

    return [...allIdsState, action.payload.id];
}

function removeCardAllIds(allIdsState, action) {
    return allIdsState.filter(cardId => cardId !== action.id);
}

function setFetching(value) {
    return value;
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

function reduceIsFetching(fetchingState, action) {
    switch(action.type) {
        case FETCH_PROJECT_CARDS: return setFetching(true);
        case FETCH_CARDS_SUCCESS: return setFetching(false);
        default: return fetchingState;
    }
}

//DOMAIN REDUCER
export function cardReducer(state = initialState, action) {
    return {
        isFetching: reduceIsFetching(state.isFetching, action),
        byId: reduceById(state.byId, action),
        allIds: reduceAllIds(state.allIds, action)
    }
}