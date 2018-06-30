import { ADD_USER_REQUEST, UPDATE_USER_REQUEST } from '../actions/actionTypes';
import { addUser, updateUser } from '../actions/userActions';
import { loginSuccess } from '../actions/authActions';
import { activateModal } from '../actions/uiActions';
import { setCurrentUser } from '../actions/currentSelectionActions';
import { createUser, updateUserData, updateUserPassword } from '../../services/userService';

export const userActionsMiddleware = store => next => action => {
    if (action.type === ADD_USER_REQUEST) {
        handleAddUserRequest(store, action);
    }

    if (action.type === UPDATE_USER_REQUEST) {
        handleUpdateUserRequest(store, action);
    }

    next(action);
}

function handleAddUserRequest(store, action) {
    createUser(action.payload)
        .then(parsedResponse => {
            if (parsedResponse.message === 'Error occurred') {
                const message = 'User information missing, please fill out required fields';
                activateErrorModal(store, message);
            }
            else if (parsedResponse.message === 'Username already exists') {
               const message = parsedResponse.message + ', please choose another one';
               activateErrorModal(store, message);
            }
            else {
                store.dispatch(addUser(parsedResponse.user_data));
                store.dispatch(setCurrentUser(parsedResponse.user_data.id));
                store.dispatch(loginSuccess({token: parsedResponse.token, message: 'Auth successful'}));               
            }
        })
        .catch(err => {
            const message = 'Server error, try again';
            activateErrorModal(store, message);
        });
}

function handleUpdateUserRequest(store, action) {
    const token = store.getState().auth.token;
    if (action.payload.hasOwnProperty('currentPassword')) {
        updateUserPassword(action.id, action.payload, token)
        .then(parsedResponse => {
            if (parsedResponse.message === 'Error occurred') {
                const message = 'User information missing, please fill out required fields';
                activateErrorModal(store, message);
            }
            else if (parsedResponse.message === 'Password error') {
                const message = 'Error changing the password, please try again';
                activateErrorModal(store, message);
            }
            else {
                const message = 'Password changed successfully!';
                activateSuccessModal(store, message);
            }
        })
        .catch(err => {
            const message = 'Server error, try again';
            activateErrorModal(store, message);
        });
    }
    else {
        updateUserData(action.id, action.payload, token)
        .then(parsedResponse => {
            if (parsedResponse.message === 'Error occurred') {
                const message = 'User information missing, please fill out required fields';
                activateErrorModal(store, message);
            }
            else {
                store.dispatch(updateUser(parsedResponse.user_data.id, parsedResponse.user_data));
            }
        })
        .catch(err => {
            const message = 'Server error, try again';
            activateErrorModal(store, message);
        });
    }
}

function activateErrorModal(store, message) {
    const errorModal = {
        modalType: 'Display Errors Modal',
        modalData: message,
        submit: []
    };
    store.dispatch(activateModal(errorModal));
}

function activateSuccessModal(store, message) {
    const successModal = {
        modalType: 'Display Success Modal',
        modalData: message,
        submit: []
    };
    store.dispatch(activateModal(successModal));
}