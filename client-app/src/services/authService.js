import { configuration } from '../utils/Configuration';

export function login(userName, password) {
    const loginURL = `http://${configuration.host}:${configuration.port}/api/login`;
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