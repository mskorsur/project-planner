import { SET_CURRENT_USER, SET_CURRENT_PROJECT } from '../actions/actionTypes';

const initialState = {
    currentUser: '',
    currentProject: ''
}

//DOMAIN REDUCERS
export function currentUserReducer(userState = initialState.currentUser, action) {
    switch(action.type) {
        case SET_CURRENT_USER: return action.userId;
        default: return userState;
    }
}

export function currentProjectReducer(projectState = initialState.projectState, action) {
    switch(action.type) {
        case SET_CURRENT_PROJECT: return action.projectId;
        default: return projectState;
    }
}