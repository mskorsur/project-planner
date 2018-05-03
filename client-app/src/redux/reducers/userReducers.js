import { ADD_USER, 
         UPDATE_USER, 
         ADD_PROJECT, 
         REMOVE_PROJECT } from '../actions/actionTypes';

const initialState = {
    byId: {},
    allIds: []
}

//CASE REDUCERS
function addUserById(byIdState, action) {
    const { payload } = action;
    const newUser = {
        id: action.id,
        ...payload,
        projects: []
    }
    return Object.assign({}, byIdState, {
        [newUser.id]: newUser
    });
}

function updateUserById(byIdState, action) {
    const userId = action.id;
    const { payload } = action;
    const updatedUser = Object.assign({}, byIdState[userId], ...payload);

    return Object.assign({}, byIdState, {
        [userId]: updatedUser
    });
}

function addProjectToUser(byIdState, action) {
    const userId = action.payload.user;
    const projectId = action.id;

    const userProjectsWithNewProject = [...byIdState[userId].projects, projectId];
    const updatedUser = Object.assign({}, byIdState[userId], {
        projects: userProjectsWithNewProject
    });

    return Object.assign({}, byIdState, {
        [userId]: updatedUser
    });
}

function removeProjectFromUser(byIdState, action) {
    const userId = action.user;
    const projectId = action.id;

    let userProjects = [...byIdState[userId].projects];
    let projectsWithoutRemovedProject = userProjects.filter(project => project !== projectId);
    const updatedUser = Object.assign({}, byIdState[userId], {
        projects: projectsWithoutRemovedProject
    });

    return Object.assign({}, byIdState, {
        [userId]: updatedUser
    });
}

function addUserAllIds(allIdsState, action) {
    return [...allIdsState, action.id];
}

//SLICE REDUCERS
function reduceById(byIdState, action) {
    switch(action.type) {
        case ADD_USER: return addUserById(byIdState, action);
        case UPDATE_USER: return updateUserById(byIdState, action);
        case ADD_PROJECT: return addProjectToUser(byIdState, action);
        case REMOVE_PROJECT: return removeProjectFromUser(byIdState, action);
        default: return byIdState;
    }
}

function reduceAllIds(allIdsState, action) {
    switch(action.type) {
        case ADD_USER: return addUserAllIds(allIdsState, action);
        default: return allIdsState;
    }
}

//DOMAIN REDUCER
export function userReducer(state = initialState, action) {
    return {
        byId: reduceById(state.byId, action),
        allIds: reduceAllIds(state.allIds, action)
    };
}