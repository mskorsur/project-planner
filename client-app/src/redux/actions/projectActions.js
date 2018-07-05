import { ADD_PROJECT_REQUEST, 
         ADD_PROJECT, 
         PROJECT_REDIRECT,
         UPDATE_PROJECT_REQUEST, 
         UPDATE_PROJECT,
         REMOVE_PROJECT_REQUEST, 
         REMOVE_PROJECT } from './actionTypes';


//payload should contain project name, status, lastModified date and owning user's id
export function addProjectRequest(data) {
    return {
        type: ADD_PROJECT_REQUEST,
        payload: {...data}
    }
}

//payload should contain the same data as above including id returned from the API
export function addProject(data) {
    return {
        type: ADD_PROJECT,
        payload: {...data}
    }
}

export function projectRedirect(id, history) {
    return {
        type: PROJECT_REDIRECT,
        id,
        history
    }
}

export function updateProjectRequest(id, data) {
    return {
        type: UPDATE_PROJECT_REQUEST,
        id,
        payload: {...data}
    }
}

export function updateProject(id, data) {
    return {
        type: UPDATE_PROJECT,
        id,
        payload: {...data}
    }
}

export function removeProjectRequest(id, user) {
    return {
        type: REMOVE_PROJECT_REQUEST,
        id,
        user
    }
}

export function removeProject(id, user) {
    return {
        type: REMOVE_PROJECT,
        id,
        user
    }
}