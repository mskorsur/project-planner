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
        id: action.id,
        ...payload,
        cards: []
    }
    return Object.assign({}, byIdState, {
        [newProject.id]: newProject
    });
}

function updateProjectById(byIdState, action) {
    const projectId = action.id;
    const { payload } = action;
    const updatedProject = Object.assign({}, byIdState[projectId], ...payload);

    return Object.assign({}, byIdState, {
        [projectId]: updatedUser
    });
}

function removeProjectById(byIdState, action) {
    const projectId = action.id;
    let stateWithoutRemovedProject = {...byIdState};
    delete stateWithoutRemovedProject[projectId];

    return stateWithoutRemovedProject;
}

function addProjectAllIds(allIdsState, action) {
    return [...allIdsState, action.id];
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