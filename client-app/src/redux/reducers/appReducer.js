import { userReducer } from './userReducers';
import { projectReducer } from './projectReducers';
import { cardReducer } from './cardReducers';
import { taskReducer } from './taskReducers';
import { currentUserReducer, currentProjectReducer } from './currentSelectionReducers';

const initialState = {
    currentUser: '',
    currentProject: '',
    users: {
        byId: {},
        allIds: []
    },
    projects: {
        byId: {},
        allIds: []
    },
    cards: {
        byId: {},
        allIds: []
    },
    tasks: {
        byId: {},
        allIds: []
    }
    /*
    ui: {}
    */
}

export function appReducer(state = initialState, action) {
    return {
        currentUser: currentUserReducer(state.currentUser, action),
        currentProject: currentProjectReducer(state.currentProject, action),
        users: userReducer(state.users, action),
        projects: projectReducer(state.projects, action),
        cards: cardReducer(state.cards, action),
        tasks: taskReducer(state.tasks, action)
    }
}