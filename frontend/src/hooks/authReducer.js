import {actionType} from '../utils/action'
export function authReducer(state, action){
    console.log(action.type)
    switch (action.type) {
        case actionType.Auth.SIGNIN:
            return {
                ...state,
                idToken: action.payload.idToken,
                name: action.payload.name
            };
        default:
            return state;
    }
}