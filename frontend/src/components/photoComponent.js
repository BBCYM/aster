import * as React from 'react'
import {
	View,
	StyleSheet,
	TouchableOpacity,
} from 'react-native'
import { ListItem } from 'react-native-elements'
import ActionButton from 'react-native-action-button'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { SwipeListView } from 'react-native-swipe-list-view'
import Axios from 'axios'
import { ipv4 } from '../utils/dev'
import {resToEmotionStatus} from '../utils/utils'


export function TagList([status, setStatus]) {
	function deleteTag(id) {
		console.log(`deleting tag id:${id}`)
		let slicedTag = [...status.tag]
		var result = slicedTag.findIndex((v, i) => {
			return v.key === id
		})
		slicedTag.splice(result, 1)
		// dispatch(action(actionType.SET.TAG, slicedTag))
		setStatus({ tag: slicedTag })
	}
	return (
		<SwipeListView
			data={status.tag}
			renderItem={(data, rowMap) => (
				<View>
					<ListItem
						key={data.item.key}
						title={data.item.text}
						bottomDivider
					/>
				</View>
			)}
			renderHiddenItem={(data, rowMap) => (
				<TouchableOpacity onPress={() => deleteTag(data.item.key)}>
					<ListItem
						key={data.item.key}
						rightElement={
							<Ionicons name='trash-outline' size={30} />
						}
						containerStyle={{ backgroundColor: 'pink' }}
					/>
				</TouchableOpacity>
			)}
			disableRightSwipe
			rightOpenValue={-65}
			useNativeDriver={true}
		/>
	)
}


export function photoFooter(that, [status, setStatus], currentIndex, state) {

	function fetchTags(currentIndex) {
		const now = status.fastSource[currentIndex]
		setStatus({currentPhotoId:now.imgId,currentId:now.id})
		Axios.get(`http://${ipv4}:3000/photo/tag`, {
			params: {
				userId: state.user.id,
				photoId: now.imgId
			}
		}).then((res)=>{
			let data = JSON.parse(res.data)
			console.log(data)
			if(data.custom_tag){
				let len = data.custom_tag.length
				setStatus({tag:data.custom_tag.map((v,i)=>({key:len-i-1,text:v}))})
			} else {
				setStatus({tag:[]})
			}
		}).then(()=>{
			setStatus({isTagModalVisi: true})
		}).catch((err)=>{
			console.error(err)
			setStatus({tag:[]})
		})
	}
	function fetchEmotion(currentIndex) {
		const now = status.fastSource[currentIndex]
		setStatus({currentPhotoId:now.imgId,currentId:now.id})
		Axios.get(`http://${ipv4}:3000/photo/emotion`, {
			params: {
				userId: state.user.id,
				photoId: now.imgId
			}
		}).then((res) => {
			let data = JSON.parse(res.data)
			// console.log(data.message)
			let emotionState = resToEmotionStatus(status.emotionStatus,data.message)
			setStatus({emotionStatus:emotionState})
		}).then(()=>{
			setStatus({ isEmotionModalVisi: true })
		}).catch((err)=>{
			console.error(err)
		})
	}
	return (
		<View style={styles.root}>
			<ActionButton
				buttonColor="rgba(231,76,60,1)"
				position='right'
				offsetX={10}
				offsetY={10}
				fixNativeFeedbackRadius={true}
				spacing={10}
			>
				<ActionButton.Item
					buttonColor='#F5B19C'
					title="Emotion"
					spaceBetween={8}
					onPress={() => fetchEmotion(currentIndex)}
				>
					<Ionicons name="happy-outline" style={styles.actionButtonIcon} />
				</ActionButton.Item>
				<ActionButton.Item
					buttonColor='#63CCC8'
					title="New Tag"
					spaceBetween={8}
					onPress={() => fetchTags(currentIndex)}
				>
					<Ionicons name="pricetags-outline" style={styles.actionButtonIcon} />
				</ActionButton.Item>
			</ActionButton>
		</View>
	)
}

const styles = StyleSheet.create({
	root: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center'
	},
	actionButtonIcon: {
		fontSize: 25,
		height: 25,
		color: '#303960',
	}
})