import { createStore, applyMiddleware } from 'redux';
import { appReducer } from './reducers/appReducer';
import { loggerMiddleware } from './middleware/loggerMiddleware';
import { authActionsMiddleware } from './middleware/authActionsMiddleware';
import { userActionsMiddleware } from './middleware/userActionsMiddleware';
import { projectActionsMiddleware } from './middleware/projectActionsMiddleware';
import { cardActionsMiddleware } from './middleware/cardActionsMiddleware';
import { taskActionsMiddleware } from './middleware/taskActionsMiddleware';
import { addProjectRedirectMiddleware } from './middleware/addProjectRedirectMiddleware';
import { loadState, saveState } from '../utils/LocalStorageManager';
import throttle from '../../node_modules/lodash/throttle';

const persistedState = loadState();
const middleware = applyMiddleware(
    loggerMiddleware,
    authActionsMiddleware, 
    userActionsMiddleware,
    projectActionsMiddleware,
    cardActionsMiddleware,
    taskActionsMiddleware,
    addProjectRedirectMiddleware
);
export const store = createStore(appReducer, persistedState, middleware);

export const stateChangeUnsubscribe = store.subscribe(throttle(() => {
    saveState({
        currentUser: store.getState().currentUser,
        currentProject: store.getState().currentProject,
        users: store.getState().users,
        projects: store.getState().projects,
        cards: store.getState().cards,
        tasks: store.getState().tasks,
        auth: store.getState().auth
    });
}, 1000));