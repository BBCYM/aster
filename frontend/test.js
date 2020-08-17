var hash = require('object-hash')
var _ = require('lodash')
function preCleanPid(pid) {
	pid = _.sortBy(pid,[function(o){return o.p_tag.length}]).reverse()
	let hashMap = new Map()
	pid.forEach((v)=>{
		v.p_tag.sort()
		var hashTag = hash.MD5(v.p_tag)
		if(hashMap.has(hashTag)){
			var past = hashMap.get(hashTag)
			past.pid.push(v.pid)
			hashMap.set(hashTag, past)
		} else {
			hashMap.set(hashTag, {tag:v.p_tag, pid:[v.pid]})
		}
	})
	return hashMap
}
function main() {
	let temp = [
		{ 'pid': 'p1', 'p_tag': ['狗狗', '小柴'] },
		{ 'pid': 'p2', 'p_tag': ['小柴', '狗狗'] },
		{ 'pid': 'p3', 'p_tag': ['狗狗', '小柴'] },
		{ 'pid': 'p4', 'p_tag': ['狗狗'] },
		{ 'pid': 'p5', 'p_tag': ['貓貓', '小柴'] },
		{ 'pid': 'p6', 'p_tag': ['城市', '風光','人物'] },
		{ 'pid': 'p7', 'p_tag': ['人物', '風光'] },
		{ 'pid': 'p8', 'p_tag': ['哈寶寶','哈士奇','狗狗'] },
		{ 'pid': 'p9', 'p_tag': ['哈士奇','哈寶寶','狗狗'] },
		{ 'pid': 'p10', 'p_tag': ['小柴'] },
		{ 'pid': 'p11', 'p_tag': ['風光'] },
	]
	preCleanPid(temp)
}
main()