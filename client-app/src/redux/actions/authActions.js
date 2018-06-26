import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT } from './actionTypes';

//payload should contain userName and password
export function loginRequest(data) {
    return {
        type: LOGIN_REQUEST,
        isLoggingIn: true,
        payload: {...data}
    }
}

//payload should contain token and other data returned from the API
export function loginSuccess(data) {
    return {
        type: LOGIN_SUCCESS,
        isLoggingIn: false,
        isAuthenticated: true,
        payload: {...data}
    }
}

//payload should contain error message returned from the API
export function loginFailure(data) {
    return {
        type: LOGIN_FAILURE,
        isLoggingIn: false,
        isAuthenticated: false,
        payload: {...data}
    }
}

export function logout() {
    return {
        type: LOGOUT
    }
}