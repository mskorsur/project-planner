import { ADD_PROJECT } from '../actions/actionTypes';

export const addProjectRedirectMiddleware = store => next => action => {
    if (action.type === ADD_PROJECT) {
        action.payload.history.push(`/project/${action.id}`);
        delete action.payload.history;
    }
    next(action);
}