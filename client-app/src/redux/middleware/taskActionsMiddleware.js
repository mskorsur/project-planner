import { ADD_TASK_REQUEST, UPDATE_TASK_REQUEST, REMOVE_TASK_REQUEST, MOVE_TASK_REQUEST } from '../actions/actionTypes';
import { addTask, updateTask, removeTask, moveTask } from '../actions/taskActions';
import { createTask, updateTaskData, removeTaskData } from '../../services/taskService';
import { activateErrorModal } from '../../utils/NotificationModalsManager';
import { updateProjectModificationDate } from '../../utils/ProjectDateUpdater';

export const taskActionsMiddleware = store => next => action => {
    if (action.type === ADD_TASK_REQUEST) {
        handleAddTaskRequest(store, action);
    }

    if (action.type === UPDATE_TASK_REQUEST) {
        handleUpdateTaskRequest(store, action);
    }

    if (action.type === REMOVE_TASK_REQUEST) {
        handleRemoveTaskRequest(store, action);
    }

    if (action.type === MOVE_TASK_REQUEST) {
        handleMoveTaskRequest(store, action);
    }

    next(action);
}

function handleAddTaskRequest(store, action) {
    const token = store.getState().auth.token;

    createTask(action.payload, token)
    .then(parsedResponse => {
        if (parsedResponse.message === 'Error occurred') {
            const message = 'Task information missing, please fill out required fields';
            activateErrorModal(store, message);
        }
        else if (parsedResponse.message === 'Task not created, card update failed') {
            activateErrorModal(store, parsedResponse.message);
        }
        else {
            store.dispatch(addTask(parsedResponse.task_data));
            updateProjectModificationDate(store, parsedResponse.task_data.card);
        }
    })
    .catch(err => {
        const message = 'Server error, try again';
        activateErrorModal(store, message);
    });
}

function handleUpdateTaskRequest(store, action) {
    const token = store.getState().auth.token;

    updateTaskData(action.id, action.payload, token)
    .then(parsedResponse => {
        if (parsedResponse.message === 'Error occurred') {
            const message = 'Task information missing, please fill out required fields';
            activateErrorModal(store, message);
        }
        else {
            store.dispatch(updateTask(parsedResponse.task_data.id, parsedResponse.task_data));
            updateProjectModificationDate(store, parsedResponse.task_data.card);
        }
    })
    .catch(err => {
        const message = 'Server error, try again';
        activateErrorModal(store, message);
    });
}

function handleRemoveTaskRequest(store, action) {
    const token = store.getState().auth.token;

    removeTaskData(action.id, token)
    .then(parsedResponse => {
        if (parsedResponse.message === 'Task not deleted, card update failed') {
            activateErrorModal(store, parsedResponse.message);
        }
        else {
            store.dispatch(removeTask(action.id, action.card));
            updateProjectModificationDate(store, action.card);
        }
    })
    .catch(err => {
        const message = 'Server error, try again';
        activateErrorModal(store, message);
    });
}

function handleMoveTaskRequest(store, action) {
    const token = store.getState().auth.token;
    let { task } = action;
    task.card = action.destination;

    updateTaskData(task.id, task, token)
    .then(parsedResponse => {
        if (parsedResponse.message === 'Task not updated, cards updates failed') {
            const message = 'Task cannot be moved, try again';
            activateErrorModal(store, message);
        }
        else {
            task.dependencies = task.dependencies.split(',');
            store.dispatch(updateTask(task.id, parsedResponse.task_data));
            store.dispatch(moveTask(task.id, action.source, action.destination));

            updateProjectModificationDate(store, parsedResponse.task_data.card);
        }
    })
    .catch(err => {
        const message = 'Server error, try again';
        activateErrorModal(store, message);
    });
}