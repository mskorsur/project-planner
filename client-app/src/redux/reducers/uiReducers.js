import { ACTIVATE_MODAL,
         DEACTIVATE_MODAL,
         SET_STATUS_FILTER } from '../actions/actionTypes';

//extend later if necessary
const initialState = {
    currentModal: {
        shouldRender: false,
        modalType: '',
        modalData: {},
        submit: ''
    },
    statusFilter: 'All'
}

//CASE REDUCERS
function activateModal(currentModalState, action) {
    const { payload } = action;
    return {...payload};
}

function deactivateModal(currentModalState, action) {
    const { payload } = action;
    return {...payload};
}

//SLICE REDUCERS
function reduceCurrentModal(currentModalState, action) {
    switch(action.type) {
        case ACTIVATE_MODAL: return activateModal(currentModalState, action);
        case DEACTIVATE_MODAL: return deactivateModal(currentModalState, action);
        default: return currentModalState;
    }
}

function reduceStatusFilter(filterState, action) {
    switch(action.type) {
        case SET_STATUS_FILTER: return action.filter;
        default: return filterState;
    }
}

//DOMAIN REDUCER - extend later if necessary
export function uiReducer(state = initialState, action) {
    return {
        currentModal: reduceCurrentModal(state.currentModal, action),
        statusFilter: reduceStatusFilter(state.statusFilter, action)
    }
}