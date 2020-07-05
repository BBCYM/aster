import { actionType } from '../utils/action'
export function authReducer(state, action) {
    console.log(action.type)
    switch (action.type) {
        case actionType.Auth.SIGNIN:
            return {
                ...state,
                user: action.payload
            };
        // case actionType.SET.isLoading:
        //     return {
        //         ...state,
        //         isLoading:action.payload
        //     }
        case actionType.SET.CLEAR:
            return {
                ...state,
                user: action.payload
            }
        case actionType.SET.isLoading:
            return {
                ...state,
                isLoading: action.payload
            }
        default:
            return state;
    }
}