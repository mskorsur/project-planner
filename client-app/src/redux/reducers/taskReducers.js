import { ADD_TASK,
         UPDATE_TASK,
         REMOVE_TASK } from '../actions/actionTypes';

const initialState = {
    byId: {},
    allIds: []
}

//CASE REDUCERS
function addTaskById(byIdState, action) {
    const { payload } = action;
    const newTask = {
        id: action.id,
        ...payload,
        dependencies: []
    }
    return Object.assign({}, byIdState, {
        [newTask.id]: newTask
    });
}

function updateTaskById(byIdState, action) {
    const taskId = action.id;
    const { payload } = action;
    const updatedTask = Object.assign({}, byIdState[taskId], ...payload);

    return Object.assign({}, byIdState, {
        [taskId]: updatedTask
    });
}

function removeTaskById(byIdState, action) {
    const taskId = action.id;
    let stateWithoutRemovedTask = {...byIdState};
    delete stateWithoutRemovedTask[taskId];

    return stateWithoutRemovedTask;
}

function addTaskAllIds(allIdsState, action) {
    return [...allIdsState, action.id];
}

function removeTaskAllIds(allIdsState, action) {
    return allIdsState.filter(taskId => taskId !== action.id);
}

//SLICE REDUCERS
function reduceById(byIdState, action) {
    switch(action.type) {
        case ADD_TASK: return addTaskById(byIdState, action);
        case UPDATE_TASK: return updateTaskById(byIdState, action);
        case REMOVE_TASK: return removeTaskById(byIdState, action);
        default: return byIdState;
    }
}

function reduceAllIds(allIdsState, action) {
    switch(action.type) {
        case ADD_TASK: return addTaskAllIds(allIdsState, action);
        case REMOVE_TASK: return removeTaskAllIds(allIdsState, action);
        default: return allIdsState;
    }
}

//DOMAIN REDUCER
export function taskReducer(state = initialState, action) {
    return {
        byId: reduceById(state.byId, action),
        allIds: reduceAllIds(state.allIds, action)
    }
}