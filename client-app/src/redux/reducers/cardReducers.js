import { ADD_CARD,
         UPDATE_CARD,
         REMOVE_CARD } from '../actions/actionTypes';

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
    const updatedCard = Object.assign({}, byIdState[cardId], ...payload);

    return Object.assign({}, byIdState, {
        [cardId]: updatedCard
    });
}

function removeCardById(byIdState, action) {
    const cardId = action.id;
    let stateWithoutRemovedCard = {...byIdState};
    delete stateWithoutRemovedCard[cardId];

    return stateWithoutRemovedProject;
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