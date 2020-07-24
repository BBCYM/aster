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
		USER:'set_user',
		fastImage: 'set_fast',
		imageViewer: 'set_viewer',
		inputTag:'set_inputTag',
		TAG:'set_tag',
		CurrentImg:'set_currentImg',
		CurrentId:	'set_currentId',
		isVisible: 'set_isVisible',
		isTagModalVisi :'set_isTagModalVisi'
				
	}
}