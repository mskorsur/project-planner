import { ADD_USER, UPDATE_USER } from './actionTypes';
import { generateId } from '../../utils/UuidGenerator';

//payload should contain userName, password, firstName, lastName, email, organization and github link
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