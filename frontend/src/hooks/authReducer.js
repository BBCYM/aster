import {actionType} from '../utils/action'
export function authReducer(state, action){
    console.log(action.type)
    switch (action.type) {
        case actionType.SET.idToken:
            return {
                ...state,
                idToken: action.payload
            };
        default:
            return state;
    }
}