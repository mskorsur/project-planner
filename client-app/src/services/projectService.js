import { configuration } from '../utils/Configuration';

export function createProject(projectData, token) {
    const createProjectURL = `http://${configuration.host}:${configuration.port}/api/projects`;
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(projectData)
    }

    return fetch(createProjectURL, requestOptions)
        .then(response => {
            return response.json();
        });
}

export function getProject(id, token) {
    const getProjectURL = `http://${configuration.host}:${configuration.port}/api/projects/${id}`;
    const requestOptions = {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }

    return fetch(getProjectURL, requestOptions)
        .then(response => {
            return response.json();
        });
}

export function updateProjectData(id, projectData, token) {
    const updateProjectURL = `http://${configuration.host}:${configuration.port}/api/projects/${id}`;
    const requestOptions = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(projectData) 
    }

    return fetch(updateProjectURL, requestOptions)
        .then(response => {
            return response.json();
        });
}

export function removeProjectData(id, token) {
    const removeProjectURL = `http://${configuration.host}:${configuration.port}/api/projects/${id}`;
    const requestOptions = {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }

    return fetch(removeProjectURL, requestOptions)
        .then(response => {
            if (response.status !== 204) {
                return response.json();
            }
            return {message: 'Project deleted successfully'};
        });
}

export function getProjectCards(id, token) {
    const getProjectCardsURL = `http://${configuration.host}:${configuration.port}/api/projects/${id}/cards`;
    const requestOptions = {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }

    return fetch(getProjectCardsURL, requestOptions)
        .then(response => {
            response.json();
        });
}

export function updateProjectCards(id, projectData, token) {
    const updateProjectCardsURL = `http://${configuration.host}:${configuration.port}/api/projects/${id}/cards`;
    const requestOptions = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(projectData)
    }

    return fetch(updateProjectCardsURL, requestOptions)
        .then(response => {
            response.json();
        });
}