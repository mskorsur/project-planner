import { ADD_USER, UPDATE_USER } from './actionTypes';
import { generateId } from '../../utils/UuidGenerator';

export function addUser(data) {
    return {
        type: ADD_USER,
        id: generateId(),
        ...data
    }
}

export function updateUser(id, data) {
    return {
        type: UPDATE_USER,
        id,
        ...data
    }
}