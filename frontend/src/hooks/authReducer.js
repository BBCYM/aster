import { actionType } from '../utils/action'
function execSwitch(state, action){
    console.log(`Action: ${action.type}`)
    switch (action.type) {
        case actionType.SET.USER:
            return {
                ...state,
                user: action.payload
            };
        case actionType.SET.CLEAR:
            return {
                ...state,
                user: action.payload
            }
        case actionType.SET.SPLASH:
            return {
                ...state,
                splash:action.payload
            }
        default:
            return state;
    }
}
export function authReducer(state, actions) {
    let temp = state
    if (Array.isArray(actions)) {
        actions.forEach( (action)=> {
            temp = execSwitch(temp, action)
        });
    } else {
        temp = execSwitch(temp,actions)
    }
    return temp
}