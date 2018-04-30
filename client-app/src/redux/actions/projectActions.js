import { ADD_PROJECT, UPDATE_PROJECT, REMOVE_PROJECT } from './actionTypes';
import { generateId } from '../../utils/UuidGenerator';

//payload should contain project name, status and owning user's id
export function addProject(data) {
    return {
        type: ADD_PROJECT,
        id: generateId(),
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

export function removeProject(id, user) {
    return {
        type: REMOVE_PROJECT,
        id,
        user
    }
}