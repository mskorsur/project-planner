import { ADD_CARD_REQUEST,
         ADD_CARD,
         UPDATE_CARD_REQUEST, 
         UPDATE_CARD,
         REMOVE_CARD_REQUEST, 
         REMOVE_CARD,
         FETCH_PROJECT_CARDS,
         FETCH_CARDS_SUCCESS } from './actionTypes';

//payload should contain card name and owning project's id
export function addCardRequest(data) {
    return {
        type: ADD_CARD_REQUEST,
        payload: {...data}
    }
}

//payload should contain the same data as above including id returned from the API
export function addCard(data) {
    return {
        type: ADD_CARD,
        payload: {...data}
    }
}

export function updateCardRequest(id, data) {
    return {
        type: UPDATE_CARD_REQUEST,
        id,
        payload: {...data}
    }
}

export function updateCard(id, data) {
    return {
        type: UPDATE_CARD,
        id,
        payload: {...data}
    }
}

export function removeCardRequest(id, project) {
    return {
        type: REMOVE_CARD_REQUEST,
        id,
        project
    }
}

export function removeCard(id, project) {
    return {
        type: REMOVE_CARD,
        id,
        project
    }
}

export function fetchProjectCards(project) {
    return {
        type: FETCH_PROJECT_CARDS,
        project
    }
}

export function fetchCardsSuccess() {
    return {
        type: FETCH_CARDS_SUCCESS
    }
}