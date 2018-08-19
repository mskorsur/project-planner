import { userReducer } from './userReducers';
import { projectReducer } from './projectReducers';
import { cardReducer } from './cardReducers';
import { taskReducer } from './taskReducers';
import { currentUserReducer, currentProjectReducer } from './currentSelectionReducers';
import { authReducer } from './authReducers';
import { uiReducer } from './uiReducers';

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
        isFetching: false,
        byId: {},
        allIds: []
    },
    tasks: {
        byId: {},
        allIds: []
    },
    auth: {
        isLoggingIn: false,
        isAuthenticated: false,
        token: '',
        message: ''
    },
    ui: {
        currentModal: {
            shouldRender: false,
            modalType: '',
            modalData: {},
            submit: ''
        },
        statusFilter: 'All'
    }
}

export function appReducer(state = initialState, action) {
    return {
        currentUser: currentUserReducer(state.currentUser, action),
        currentProject: currentProjectReducer(state.currentProject, action),
        users: userReducer(state.users, action),
        projects: projectReducer(state.projects, action),
        cards: cardReducer(state.cards, action),
        tasks: taskReducer(state.tasks, action),
        auth: authReducer(state.auth, action),
        ui: uiReducer(state.ui, action)
    }
}