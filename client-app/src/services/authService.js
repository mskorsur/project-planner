import { configuration } from '../utils/Configuration';

const loginURL = `http://${configuration.host}:${configuration.port}/api/login`;

export function login(userName, password) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({userName, password})
    };

    return fetch(loginURL, requestOptions)
        .then(response => {
            return response.json();
        });
        
}