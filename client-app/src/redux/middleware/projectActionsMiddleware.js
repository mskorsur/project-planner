import { ADD_PROJECT_REQUEST, UPDATE_PROJECT_REQUEST, REMOVE_PROJECT_REQUEST } from '../actions/actionTypes';
import { addProject, updateProject, removeProject, projectRedirect } from '../actions/projectActions';
import { createProject, updateProjectData, removeProjectData } from '../../services/projectService';
import { activateErrorModal, activateSuccessModal } from '../../utils/NotificationModalsManager';

export const projectActionsMiddleware = store => next => action => {
    if (action.type === ADD_PROJECT_REQUEST) {
        handleAddProjectRequest(store, action);
    }

    if (action.type === UPDATE_PROJECT_REQUEST) {
        handleUpdateProjectRequest(store, action);
    }

    if (action.type === REMOVE_PROJECT_REQUEST) {
        handleRemoveProjectRequest(store, action);
    }

    next(action);
}

function handleAddProjectRequest(store, action) {
    const token = store.getState().auth.token;
    const history = action.payload.history;
    delete action.payload.history;

    createProject(action.payload, token)
    .then(parsedResponse => {
        if (parsedResponse.message === 'Error occurred') {
            const message = 'Project information missing, please fill out required fields';
            activateErrorModal(store, message);
        }
        else if (parsedResponse.message === 'Project not created, user update fail') {
            activateErrorModal(store, parsedResponse.message);
        }
        else {
            store.dispatch(addProject(parsedResponse.project_data));
            store.dispatch(projectRedirect(parsedResponse.project_data.id, history));
        }
    })
    .catch(err => {
        const message = 'Server error, try again';
        activateErrorModal(store, message);
    });
}

function handleUpdateProjectRequest(store, action) {
    const token = store.getState().auth.token;

    updateProjectData(action.id, action.payload, token)
    .then(parsedResponse => {
        if (parsedResponse.message === 'Error occurred') {
            const message = 'Project information missing, please fill out required fields';
            activateErrorModal(store, message);
        }
        else {
            store.dispatch(updateProject(parsedResponse.project_data.id, parsedResponse.project_data));
        }
    })
    .catch(err => {
        const message = 'Server error, try again';
        activateErrorModal(store, message);
    });
}

function handleRemoveProjectRequest(store, action) {
    const token = store.getState().auth.token;
    
    removeProjectData(action.id, token)
    .then(parsedResponse => {
        if (parsedResponse.message === 'Project not deleted, user update failed') {
            activateErrorModal(store, parsedResponse.message);
        }
        else {
            store.dispatch(removeProject(action.id, action.user));
            activateSuccessModal(store, parsedResponse.message);
        }
    })
    .catch(err => {
        const message = 'Server error, try again';
        activateErrorModal(store, message);
    });
}