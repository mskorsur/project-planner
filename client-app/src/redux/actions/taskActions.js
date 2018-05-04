import { ADD_TASK, UPDATE_TASK, REMOVE_TASK, MOVE_TASK } from './actionTypes';
import { generateId } from '../../utils/UuidGenerator';

//payload shoud contain task name, description, label, 
//steps and owning card's id 
export function addTask(data) {
    return {
        type: ADD_TASK,
        id: generateId(),
        payload: {...data}
    }
}

export function updateTask(id, data) {
    return {
        type: UPDATE_TASK,
        id,
        payload: {...data}
    }
}

export function removeTask(id, card) {
    return {
        type: REMOVE_TASK,
        id,
        card
    }
}

export function moveTask(id, source, destination) {
    return {
        type: MOVE_TASK,
        id,
        source,
        destination
    }
}