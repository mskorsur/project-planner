import { ADD_USER, UPDATE_USER } from './actionTypes';

export function addUser(name) {
    return {
        type: ADD_USER,
        name
    }
}

export function updateUser(name) {
    return {
        type: UPDATE_USER,
        name
    }
}