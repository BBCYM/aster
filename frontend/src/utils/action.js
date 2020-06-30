export function createAction(type, payload) {
    return {
        type,
        payload
    }
}
export const actionType = {
    Auth: {
        SIGNIN: 'SIGNIN'
    }
}