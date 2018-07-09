import { ADD_CARD_REQUEST, UPDATE_CARD_REQUEST, REMOVE_CARD_REQUEST, FETCH_PROJECT_CARDS } from '../actions/actionTypes';
import { addCard, updateCard, removeCard, fetchCardsSuccess } from '../actions/cardActions';
import { addTask } from '../actions/taskActions';
import { createCard, updateCardData, removeCardData } from '../../services/cardService';
import { getProjectCards } from '../../services/projectService';
import { activateErrorModal } from '../../utils/NotificationModalsManager';

export const cardActionsMiddleware = store => next => action => {
    if (action.type === ADD_CARD_REQUEST) {
        handleAddCardRequest(store, action);
    }

    if (action.type === UPDATE_CARD_REQUEST) {
        handleUpdateCardRequest(store, action);
    }

    if (action.type === REMOVE_CARD_REQUEST) {
        handleRemoveCardRequest(store, action);
    }

    if (action.type === FETCH_PROJECT_CARDS) {
        handleFetchProjectCards(store, action);
    }

    next(action);
}

function handleAddCardRequest(store, action) {
    const token = store.getState().auth.token;

    createCard(action.payload, token)
    .then(parsedResponse => {
        if (parsedResponse.message === 'Error occurred') {
            const message = 'Card information missing, please fill out required fields';
            activateErrorModal(store, message);
        }
        else if (parsedResponse.message === 'Card not created, project update failed') {
            activateErrorModal(store, parsedResponse.message);
        }
        else {
            store.dispatch(addCard(parsedResponse.card_data));
        }
    })
    .catch(err => {
        const message = 'Server error, try again';
        activateErrorModal(store, message);
    });
}

function handleUpdateCardRequest(store, action) {
    const token = store.getState().auth.token;

    updateCardData(action.id, action.payload, token)
    .then(parsedResponse => {
        if (parsedResponse.message === 'Error occurred') {
            const message = 'Card information missing, please fill out required fields';
            activateErrorModal(store, message);
        }
        else {
            store.dispatch(updateCard(parsedResponse.card_data.id, parsedResponse.card_data));
        }
    })
    .catch(err => {
        const message = 'Server error, try again';
        activateErrorModal(store, message);
    });
}

function handleRemoveCardRequest(store, action) {
    const token = store.getState().auth.token;

    removeCardData(action.id, token)
    .then(parsedResponse => {
        if (parsedResponse.message === 'Card not deleted, project update failed') {
            activateErrorModal(store, parsedResponse.message);
        }
        else {
            store.dispatch(removeCard(action.id, action.project));
        }
    })
    .catch(err => {
        const message = 'Server error, try again';
        activateErrorModal(store, message);
    });
}

function handleFetchProjectCards(store, action) {
    const token = store.getState().auth.token;

    getProjectCards(action.project, token)
    .then(parsedResponse => {
        if (parsedResponse.message === 'Project not found') {
            activateErrorModal(store, parsedResponse.message);
        }
        else {
            parsedResponse.cards.forEach(card => {
                store.dispatch(addCard(card));
               
            });

            parsedResponse.cards.forEach(card => {
                card.tasks.forEach(task => store.dispatch(addTask(task)));
            });

            store.dispatch(fetchCardsSuccess());
        }
    })
    .catch(err => {
        const message = 'Server error, try again';
        activateErrorModal(store, message);
    });
}