import { ADD_USER, UPDATE_USER } from './actionTypes';
import { generateId } from '../../utils/UuidGenerator';

export function addUser(data) {
    return {
        type: ADD_USER,
        id: generateId(),
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