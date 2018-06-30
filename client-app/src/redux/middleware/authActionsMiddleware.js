import { LOGIN_REQUEST, LOGOUT } from '../actions/actionTypes';
import { loginSuccess, loginFailure } from '../actions/authActions';
import { setCurrentUser } from '../actions/currentSelectionActions';
import { login } from '../../services/authService';
const jwtDecode = require('jwt-decode');

export const authActionsMiddleware = store => next => action => {
    if (action.type === LOGIN_REQUEST) {
        login(action.payload.userName, action.payload.password)
        .then(parsedResponse => {    
            if (parsedResponse.message === 'Auth successful') {
                const decodedToken = jwtDecode(parsedResponse.token);
                store.dispatch(setCurrentUser(decodedToken.id));
                store.dispatch(loginSuccess(parsedResponse));
            }
            else {
                store.dispatch(loginFailure({message: parsedResponse.message}));
            }
        })
        .catch(err => {
            store.dispatch(loginFailure({message: 'Server error'}));
        }); 
    }

    next(action);
}
