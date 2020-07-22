export function action(type, payload) {
	return {
		type,
		payload
	}
}
export const actionType = {
	SET:{
		CLEAR:'set_Clear',
		isLoading:'set_isLoading',
		SPLASH:'set_splash',
		USER:'set_user'
	}
}