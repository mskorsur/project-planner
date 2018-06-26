import { LOGIN_REQUEST, 
         LOGIN_SUCCESS, 
         LOGIN_FAILURE, 
         LOGOUT } from '../actions/actionTypes';
    
const initialState = {
    isLoggingIn: false,
    isAuthenticated: false,
    token: '',
    message: ''
}

//CASE REDUCERS
function loginRequest(state, action) {
    const { isLoggingIn } = action;
    return Object.assign({}, state, isLoggingIn);
}

function loginSuccess(state, action) {
    const { isLoggingIn, isAuthenticated, payload } = action;
    return Object.assign({}, state, {
        isAuthenticated: isAuthenticated,
        isLoggingIn: isLoggingIn,
        token: payload.token,
        message: payload.message
    });
}

function loginFailure(state, action) {
    const { isLoggingIn, isAuthenticated, payload } = action;
    return Object.assign({}, state, {
        isAuthenticated: isAuthenticated,
        isLoggingIn: isLoggingIn,
        message: payload.message
    });
}

function logout(state, action) {
    return Object.assign({}, state, {
        isAuthenticated: false,
        isLoggingIn: false,
        token: '',
        message: ''
    });
}

//DOMAIN REDUCER
export function authReducer(state = initialState, action) {
    switch(action.type) {
        case LOGIN_REQUEST: return loginRequest(state, action);
        case LOGIN_SUCCESS: return loginSuccess(state, action);
        case LOGIN_FAILURE: return loginFailure(state, action);
        case LOGOUT: return logout(state, action);
        default: return state;
    }
}