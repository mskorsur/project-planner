import { configuration } from '../utils/Configuration';

export function createCard(cardData, token) {
    const createCardURL = `http://${configuration.host}:${configuration.port}/api/cards`;
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(cardData)
    }

    return fetch(createCardURL, requestOptions)
        .then(response => {
            return response.json();
        }); 
}

export function getCard(id, token) {
    const getCardURL = `http://${configuration.host}:${configuration.port}/api/cards/${id}`;
    const requestOptions = {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }

    return fetch(getCardURL, requestOptions)
        .then(response => {
            return response.json();
        });
}

export function updateCardData(id, cardData, token) {
    const updateCardURL = `http://${configuration.host}:${configuration.port}/api/cards/${id}`;
    const requestOptions = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(cardData)
    }
    
    return fetch(updateCardURL, requestOptions)
        .then(response => {
            return response.json();
        });
}

export function removeCardData(id, token) {
    const removeCardURL = `http://${configuration.host}:${configuration.port}/api/cards/${id}`;
    const requestOptions = {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }

    return fetch(removeCardURL, requestOptions)
        .then(response => {
            if (response.status !== 204) {
                return response.json();
            }
            return {message: 'Card deleted successfully'};
        });
}

export function getCardTasks(id, token) {
    const getCardTasksURL = `http://${configuration.host}:${configuration.port}/api/cards/${id}/tasks`;
    const requestOptions = {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }

    return fetch(getCardTasksURL, requestOptions)
        .then(response => {
            return response.json();
        });
}

export function updateCardTasks(id, cardData, token) {
    const updateCardTasksURL = `http://${configuration.host}:${configuration.port}/api/cards/${id}`;
    const requestOptions = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(cardData)
    }

    return fetch(updateCardTasksURL, requestOptions)
        .then(response => {
            return response.json();
        });
}