import _ from 'lodash'
export function checkEmotion(eState, want) {
	let eCopy = [...eState]
	let now = eCopy.indexOf(true)
	if(now === -1) {
		// not set yet
		eCopy[want] = true
	} else {
		// something is set
		if(now === want) {
			// unlike
			eCopy[want] = false
		} else {
			eCopy[now] = false
			eCopy[want] = true
		}
	}
	return eCopy

}
export function resToEmotionStatus(eState, want){
	let temp = Number(want)
	let eCopy = Array(6).fill(false)
	if(temp !== -1) {
		eCopy[temp] = true
	}
	return eCopy
}

export function concatLocalTag(pid_tag){
	let temp = []
	pid_tag.forEach((v, i) => {
		temp = _.concat(temp,v.tag)
	})
	return _.uniq(temp).map((v,i)=>({key:temp.length-i-1,text:v}))
}

// export function preCleanPid(pids){
// 	let temp = pids.map((v, i)=>{
// 		return {
// 			pid: v.pid,
// 			tag: new Set(v.tag)
// 		}
// 	})
// 	temp = _.sortBy(temp,[function(o){return len(o.tag)}])
	
// }