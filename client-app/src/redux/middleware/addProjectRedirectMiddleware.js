import { PROJECT_REDIRECT } from '../actions/actionTypes';

export const addProjectRedirectMiddleware = store => next => action => {
    if (action.type === PROJECT_REDIRECT) {
        action.history.push(`/project/${action.id}`);
    }

   next(action);
}