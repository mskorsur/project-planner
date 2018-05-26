import { userReducer } from './userReducers';
import { projectReducer } from './projectReducers';
import { cardReducer } from './cardReducers';
import { taskReducer } from './taskReducers';
import { currentUserReducer, currentProjectReducer } from './currentSelectionReducers';
import { uiReducer } from './uiReducers';

const initialState = {
    currentUser: 'Marin',
    currentProject: 'example',
    users: {
        byId: {
            'Marin': {
                id: 'Marin'
            }
        },
        allIds: []
    },
    projects: {
        byId: {
            'example': {
                id: 'example',
                name: 'Example project',
                cards: []
            }
        },
        allIds: []
    },
    cards: {
        byId: {},
        allIds: []
    },
    tasks: {
        byId: {},
        allIds: []
    },
    ui: {
        currentModal: {
            shouldRender: false,
            modalType: '',
            modalData: {},
            submit: ''
        }
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
        ui: uiReducer(state.ui, action)
    }
}