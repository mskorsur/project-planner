import { configuration } from '../utils/Configuration';

export function createUser(userData) {
    const createUserURL = `http://${configuration.host}:${configuration.port}/api/users`;
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    };

    return fetch(createUserURL, requestOptions)
        .then(response => {
            return response.json();
        });
        
}

export function getUser(id, token) {
    const getUserURL = `http://${configuration.host}:${configuration.port}/api/users/${id}`;
    const requestOptions = {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + token }
    };

    return fetch(getUserURL, requestOptions)
        .then(response => {
            return response.json();
        });
}

export function updateUserData(id, userData, token) {
    const updateUserURL = `http://${configuration.host}:${configuration.port}/api/users/${id}`;
    const requestOptions = {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token 
        },
        body: JSON.stringify(userData)
    };

    return fetch(updateUserURL, requestOptions)
        .then(response => {
            return response.json();
        });
}

export function updateUserPassword(id, userData, token) {
    const updateUserPasswordURL = `http://${configuration.host}:${configuration.port}/api/users/${id}?password=true`;
    const requestOptions = {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token 
        },
        body: JSON.stringify(userData)
    };

    return fetch(updateUserPasswordURL, requestOptions)
        .then(response => {
            return response.json();
        });
}

export function getUserProjects(id, token) {
    const getUserProjectsURL = `http://${configuration.host}:${configuration.port}/api/users/${id}/projects`;
    const requestOptions = {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    };

    return fetch(getUserProjectsURL, requestOptions)
        .then(response => {
            return response.json();
        });
}

export function updateUserProjects(id, userData, token) {
    const updateUserProjectsURL = `http://${configuration.host}:${configuration.port}/api/users/${id}/projects`;
    const requestOptions = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(userData)
    };

    return fetch(updateUserProjectsURL, requestOptions)
        .then(response => {
            return response.json();
        });
}