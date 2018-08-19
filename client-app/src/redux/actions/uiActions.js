import { ACTIVATE_MODAL, DEACTIVATE_MODAL, SET_STATUS_FILTER } from './actionTypes';

//MODAL ACTIONS
//data should contain modal type, its data and submit callback function
export function activateModal(data) {
    return {
        type: ACTIVATE_MODAL,
        payload: {
            shouldRender: true,
            ...data
        }
    }
}

export function deactivateModal() {
    return {
        type: DEACTIVATE_MODAL,
        payload: {
            shouldRender: false,
            modalType: '',
            modalData: {},
            submit: ''
        }
    }
}

export function setStatusFilter(filter) {
    return {
        type: SET_STATUS_FILTER,
        filter
    }
}