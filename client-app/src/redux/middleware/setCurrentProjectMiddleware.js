import { ADD_PROJECT } from '../actions/actionTypes';
import { setCurrentProject } from '../actions/currentSelectionActions';

export const setCurrentProjectMiddleware = store => next => action => {
    if (action.type === ADD_PROJECT) {
        store.dispatch(setCurrentProject(action.id));
    }
    next(action);
}