import { activateModal } from '../redux/actions/uiActions';

export function activateErrorModal(store, message) {
    const errorModal = {
        modalType: 'Display Errors Modal',
        modalData: message,
        submit: []
    };
    store.dispatch(activateModal(errorModal));
}

export function activateSuccessModal(store, message) {
    const successModal = {
        modalType: 'Display Success Modal',
        modalData: message,
        submit: []
    };
    store.dispatch(activateModal(successModal));
}