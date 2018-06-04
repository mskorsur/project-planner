import { userReducer } from './userReducers';
import { projectReducer } from './projectReducers';
import { cardReducer } from './cardReducers';
import { taskReducer } from './taskReducers';
import { currentUserReducer, currentProjectReducer } from './currentSelectionReducers';
import { uiReducer } from './uiReducers';

const initialState = {
    currentUser: 'mskorsur',
    currentProject: 'example',
    users: {
        byId: {
            'mskorsur': {
                id: 'mskorsur',
                userName: 'mskorsur',
                firstName: 'Marin',
                lastName: 'Skorsur',
                email: 'm.skorsur@gmail.com',
                organization: 'FESB',
                github: 'https://github.com/mskorsur',
                projects: ['example']
            }
        },
        allIds: []
    },
    projects: {
        byId: {
            'example': {
                id: 'example',
                name: 'Example project',
                user: 'mskorsur',
                status: 'active',
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