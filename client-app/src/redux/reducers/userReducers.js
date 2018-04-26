import { ADD_USER, UPDATE_USER } from '../actions/actionTypes';

const initialState = {
    byId: {},
    allIds: []
}

//CASE REDUCERS
function addUser(state, action)
function updateUser(state, action)

//SLICE REDUCERS
function reduceById(state, action)
function reduceAllIds(state, action)

//DOMAIN REDUCER
export function userReducer(state = initialState, action) {
    return {
        byId: reduceById(state.byId, action),
        allIds: reduceAllIds(state.allIds, action)
    };
}