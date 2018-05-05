import { createStore } from 'redux';
import { appReducer } from './reducers/appReducer';

export const store = createStore(appReducer);