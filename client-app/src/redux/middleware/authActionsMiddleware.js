import { LOGIN_REQUEST, LOGOUT } from '../actions/actionTypes';
import { loginSuccess, loginFailure } from '../actions/authActions';
import { setCurrentUser } from '../actions/currentSelectionActions';
import { addUser } from '../actions/userActions';
import { stateChangeUnsubscribe } from '../store';
import { login } from '../../services/authService';

export const authActionsMiddleware = store => next => action => {
    if (action.type === LOGIN_REQUEST) {
        login(action.payload.userName, action.payload.password)
        .then(parsedResponse => {    
            if (parsedResponse.message === 'Auth successful') {
                store.dispatch(addUser(parsedResponse.user_data));
                store.dispatch(setCurrentUser(parsedResponse.user_data.id));
                store.dispatch(loginSuccess({message: parsedResponse.message, token: parsedResponse.token}));
            }
            else {
                store.dispatch(loginFailure({message: parsedResponse.message}));
            }
        })
        .catch(err => {
            store.dispatch(loginFailure({message: 'Server error'}));
        }); 
    }

    if (action.type === LOGOUT) {
        stateChangeUnsubscribe();
        localStorage.removeItem('state');
    }

    next(action);
}
