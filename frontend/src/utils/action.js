export function createAction(type, payload) {
    return {
        type,
        payload
    }
}
export const actionType = {
    Auth: {
        SIGNIN: 'SIGNIN'
    },
    SET:{
        CLEAR:'set_Clear',
        isLoading:'set_isLoading'
    }
}