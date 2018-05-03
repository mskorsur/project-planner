import { ADD_CARD, UPDATE_CARD, REMOVE_CARD } from './actionTypes';
import { generateId } from '../../utils/UuidGenerator';

//payload should contain card name and owning project's id
export function addCard(data) {
    return {
        type: ADD_CARD,
        id: generateId(),
        payload: {...data}
    }
}

export function updateCard(id, data) {
    return {
        type: UPDATE_CARD,
        id,
        payload: {...data}
    }
}

export function removeCard(id, project) {
    return {
        type: REMOVE_CARD,
        id,
        project
    }
}