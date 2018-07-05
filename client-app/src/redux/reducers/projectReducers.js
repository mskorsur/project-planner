import { ADD_PROJECT, 
         UPDATE_PROJECT, 
         REMOVE_PROJECT, 
         ADD_CARD, 
         REMOVE_CARD } from '../actions/actionTypes';


const initialState = {
    byId: {},
    allIds: []
}

//CASE REDUCERS
function addProjectById(byIdState, action) {
    const { payload } = action;
    const newProject = {
        ...payload,
        cards: []
    }
    return Object.assign({}, byIdState, {
        [newProject.id]: newProject
    });
}

function updateProjectById(byIdState, action) {
    const { payload } = action;
    const projectId = payload.id;
    const updatedProject = Object.assign({}, byIdState[projectId], payload);

    return Object.assign({}, byIdState, {
        [projectId]: updatedProject
    });
}

function removeProjectById(byIdState, action) {
    const projectId = action.id;
    let stateWithoutRemovedProject = {...byIdState};
    delete stateWithoutRemovedProject[projectId];

    return stateWithoutRemovedProject;
}

function addCardToProject(byIdState, action) {
    const projectId = action.payload.project;
    const cardId = action.id;

    const projectCardsWithNewCard = [...byIdState[projectId].cards, cardId];
    const updatedProject = Object.assign({}, byIdState[projectId], {
        cards: projectCardsWithNewCard
    });

    return Object.assign({}, byIdState, {
        [projectId]: updatedProject
    });
}

function removeCardFromProject(byIdState, action) {
    const projectId = action.project;
    const cardId = action.id;

    let projectCards = [...byIdState[projectId].cards];
    let cardsWithoutRemovedCard = projectCards.filter(card => card !== cardId);
    const updatedProject = Object.assign({}, byIdState[projectId], {
        cards: cardsWithoutRemovedCard
    });

    return Object.assign({}, byIdState, {
        [projectId]: updatedProject
    });
}

function addProjectAllIds(allIdsState, action) {
    return [...allIdsState, action.payload.id];
}

function removeProjectAllIds(allIdsState, action) {
    return allIdsState.filter(projectId => projectId !== action.id);
}

//SLICE REDUCERS
function reduceById(byIdState, action) {
    switch(action.type) {
        case ADD_PROJECT: return addProjectById(byIdState, action);
        case UPDATE_PROJECT: return updateProjectById(byIdState, action);
        case REMOVE_PROJECT: return removeProjectById(byIdState, action);
        case ADD_CARD: return addCardToProject(byIdState, action);
        case REMOVE_CARD: return removeCardFromProject(byIdState, action);
        default: return byIdState;
    }
}

function reduceAllIds(allIdsState, action) {
    switch(action.type) {
        case ADD_PROJECT: return addProjectAllIds(allIdsState, action);
        case REMOVE_PROJECT: return removeProjectAllIds(allIdsState, action);
        default: return allIdsState;
    }
}

//DOMAIN REDUCER
export function projectReducer(state = initialState, action) {
    return {
        byId: reduceById(state.byId, action),
        allIds: reduceAllIds(state.allIds, action)
    };
}