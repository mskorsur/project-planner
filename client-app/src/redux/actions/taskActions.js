import { ADD_TASK_REQUEST,
         ADD_TASK, 
         UPDATE_TASK_REQUEST,
         UPDATE_TASK,
         REMOVE_TASK_REQUEST,
         REMOVE_TASK, 
         MOVE_TASK_REQUEST,
         MOVE_TASK } from './actionTypes';

//payload should contain task name, description, label, 
//due date and owning card's id 
export function addTaskRequest(data) {
    return {
        type: ADD_TASK_REQUEST,
        payload: {...data}
    }
}

//payload should contain the same data as above including id returned from the API
export function addTask(data) {
    return {
        type: ADD_TASK,
        payload: {...data}
    } 
}

export function updateTaskRequest(id, data) {
    return {
        type: UPDATE_TASK_REQUEST,
        id,
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

export function removeTaskRequest(id, card) {
    return {
        type: REMOVE_TASK_REQUEST,
        id,
        card
    }
}

export function removeTask(id, card) {
    return {
        type: REMOVE_TASK,
        id,
        card
    }
}

export function moveTaskRequest(task, source, destination) {
    return {
        type: MOVE_TASK_REQUEST,
        task,
        source,
        destination
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