import { ADD_USER_REQUEST, ADD_USER, UPDATE_USER_REQUEST, UPDATE_USER } from './actionTypes';

//payload should contain userName, password, firstName, lastName, email, organization and github link
export function addUserRequest(data) {
    return {
        type: ADD_USER_REQUEST,
        payload: {...data}
    }
}

//payload should contain the same data as above including id returned from the API
export function addUser(data) {
    return {
        type: ADD_USER,
        payload: {...data}
    }
}

export function updateUserRequest(id, data) {
    return {
        type: UPDATE_USER_REQUEST,
        id,
        payload: {...data}
    }
}

export function updateUser(id, data) {
    return {
        type: UPDATE_USER,
        id,
        payload: {...data}
    }
}