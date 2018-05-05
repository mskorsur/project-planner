import { SET_CURRENT_USER, SET_CURRENT_PROJECT } from './actionTypes';

export function setCurrentUser(userId) {
    return {
        type: SET_CURRENT_USER,
        userId
    }
}

export function setCurrentProject(projectId) {
    return {
        type: SET_CURRENT_PROJECT,
        projectId
    }
}