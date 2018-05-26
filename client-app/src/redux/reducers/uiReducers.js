import { ACTIVATE_MODAL,
         DEACTIVATE_MODAL } from '../actions/actionTypes';

//extend later if necessary
const initialState = {
    currentModal: {
        shouldRender: false,
        modalType: '',
        modalData: {},
        submit: ''
    }
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

//DOMAIN REDUCER - extend later if necessary
export function uiReducer(state = initialState, action) {
    return {
        currentModal: reduceCurrentModal(state.currentModal, action)
    }
}