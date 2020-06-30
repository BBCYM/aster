export function createAction(type, payload) {
    return {
        type,
        payload
    }
}
export const actionType = {
    SET:{
        idToken:'SET_idToken'
    }
}