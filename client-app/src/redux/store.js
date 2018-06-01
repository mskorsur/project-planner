import { createStore, applyMiddleware } from 'redux';
import { appReducer } from './reducers/appReducer';
import { loggerMiddleware } from './middleware/loggerMiddleware';
import { setCurrentProjectMiddleware } from './middleware/setCurrentProjectMiddleware';
import { loadState, saveState } from '../utils/LocalStorageManager';
import throttle from '../../node_modules/lodash/throttle';

const persistedState = loadState();
const middleware = applyMiddleware(loggerMiddleware, setCurrentProjectMiddleware);
export const store = createStore(appReducer, persistedState, middleware);

store.subscribe(throttle(() => {
    saveState({
        currentUser: store.getState().currentUser,
        currentProject: store.getState().currentProject,
        users: store.getState().users,
        projects: store.getState().projects,
        cards: store.getState().cards,
        tasks: store.getState().tasks
    });
}, 1000));