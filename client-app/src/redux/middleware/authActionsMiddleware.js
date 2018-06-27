import { LOGIN_REQUEST, LOGOUT } from '../actions/actionTypes';
import { loginSuccess, loginFailure } from '../actions/authActions';
import { login } from '../../services/authService';

export const authActionsMiddleware = store => next => action => {
    if (action.type === LOGIN_REQUEST) {
        login(action.payload.userName, action.payload.password)
        .then(parsedResponse => {
            const data = {
                token: parsedResponse.token,
                message: parsedResponse.message
            }
            
            parsedResponse.message === 'Auth successful'
            ? store.dispatch(loginSuccess(data))
            : store.dispatch(loginFailure({message: data.message}))
        })
        .catch(err => {
            store.dispatch(loginFailure({message: 'Server error'}));
        }); 
    }

    next(action);
}
