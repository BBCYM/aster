import _ from 'lodash'
import hash from 'object-hash'
import Snackbar from 'react-native-snackbar'
export async function asyncErrorHandling(check:Function,after:Function){
	let hasError = false
	try{
		await check()
	} catch(err){
		console.log('has err')
		console.log(err.message)
		hasError = true
		Snackbar.show({
			text: err.message,
			textColor:'#F6C570',
			backgroundColor:'#303960',
			duration:Snackbar.LENGTH_INDEFINITE,
			action:{
				text:'Go Fix',
				textColor:'#F6C570'
			}
		})
	}
	if(!hasError) {
		console.log('Outbound')
		await after()
	}
}
export function ErrorHandling(check:Function,after:Function){
	let hasError = false
	try{
		check()
	} catch(err){
		console.log('has err')
		console.log(err.message)
		hasError = true
		Snackbar.show({
			text: err.message,
			textColor:'#F6C570',
			backgroundColor:'#303960',
			duration:Snackbar.LENGTH_INDEFINITE,
			action:{
				text:'Go Fix',
				textColor:'#F6C570'
			}
		})
	}
	if(!hasError) {
		console.log('Outbound')
		after()
	}
}

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

export function concatLocalTag(hashTag){
	// console.log(hashTag)
	let temp = []
	let pids = []
	hashTag.forEach((v,k)=>{
		temp = _.concat(temp, v.tag)
		pids = _.concat(pids,v.pid)
	})
	temp = _.uniq(temp).map((v,i)=>({key:temp.length-i-1,text:v}))
	return {pids, temp}
}

export function preCleanPid(pids){
	pids = _.sortBy(pids,[function(o){return o.tag.length}]).reverse()
	let hashMap = new Map()
	pids.forEach((v)=>{
		v.tag.sort()
		var hashTag = hash.MD5(v.tag)
		if(hashMap.has(hashTag)){
			var past = hashMap.get(hashTag)
			past.pid.push(v.pid)
			hashMap.set(hashTag, past)
		} else {
			hashMap.set(hashTag, {tag:v.tag, pid:[v.pid]})
		}
	})
	return hashMap
}