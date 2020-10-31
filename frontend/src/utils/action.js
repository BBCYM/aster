export function action(type, payload) {
	return {
		type,
		payload
	}
}
export const actionType = {
	SET:{
		CLEAR:'set_Clear',
		SPLASH:'set_splash',
		USER:'set_user',
		isFreshing: 'set_isFreshing',
		isSync: 'set_isSync',
		useWifi:'set_useWifi',
		lancode:'set_lancode',
		dateRange:'set_dateRange'
	}
}