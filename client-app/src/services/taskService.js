import { configuration } from '../utils/Configuration';

export function createTask(taskData, token) {
    const createTaskURL = `http://${configuration.host}:${configuration.port}/api/tasks`;
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(taskData)
    }
    
    return fetch(createTaskURL, requestOptions)
        .then(response => {
            return response.json();
        });
}

export function getTask(id, token) {
    const getTaskURL = `http://${configuration.host}:${configuration.port}/api/tasks/${id}`;
    const requestOptions = {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }

    return fetch(getTaskURL, requestOptions)
        .then(response => {
            return response.json();
        });
}

export function updateTaskData(id, taskData, token) {
    const updateTaskURL = `http://${configuration.host}:${configuration.port}/api/tasks/${id}`;
    const requestOptions = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(taskData)
    }

    return fetch(updateTaskURL, requestOptions)
        .then(response => {
            return response.json();
        });
}

export function removeTaskData(id, token) {
    const removeTaskURL = `http://${configuration.host}:${configuration.port}/api/tasks/${id}`;
    const requestOptions = {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }

    return fetch(removeTaskURL, requestOptions)
        .then(response => {
            if (response.status !== 204) {
                return response.json();
            }
            return {message: 'Task deleted successfully'};
        });
}