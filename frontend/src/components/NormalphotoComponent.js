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
import _ from 'lodash'
import { resToEmotionStatus, asyncErrorHandling } from '../utils/utils'
// import { FloatingAction } from 'react-native-floating-action'

export function TagList([status, setStatus], auth, state) {
	function deleteTag(id, text) {
		Axios.delete(`${auth.url}/photo/tag/${status.currentPhotoId}`, {
			params: {
				custom_tag: text
			},
			headers:auth.headers(state.language)
		}).then(() => {
			console.log(`deleting tag id:${id}`)
			let slicedTag = [...status.tag]
			var result = slicedTag.findIndex((v, i) => {
				return v.key === id
			})
			slicedTag.splice(result, 1)
			setStatus({ tag: slicedTag })
		}).catch((err) => {
			console.log(err)
		})
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
				<TouchableOpacity onPress={() => deleteTag(data.item.key, data.item.text)}>
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


export function photoFooter(that, [status, setStatus], currentIndex, state, auth) {

	function fetchTags(currentIndex) {
		const now = status.fastSource[currentIndex]
		setStatus({ currentPhotoId: now.imgId, currentId: now.id })
		Axios.get(`${auth.url}/photo/tag/${now.imgId}`, {
			headers:auth.headers(state.language)
		}).then((res) => {
			let data = res.data
			if (data.custom_tag) {
				let len = data.custom_tag.length
				setStatus({ tag: data.custom_tag.map((v, i) => ({ key: len - i - 1, text: v })) })
			} else {
				setStatus({ tag: [] })
			}
		}).then(() => {
			setStatus({ isTagModalVisi: true, actionBtnVisi: false })
		}).catch((err) => {
			console.error(err)
			setStatus({ tag: [] })
		})
	}
	function fetchEmotion(currentIndex) {
		const now = status.fastSource[currentIndex]
		setStatus({ currentPhotoId: now.imgId, currentId: now.id })
		Axios.get(`${auth.url}/photo/emotion/${now.imgId}`, {
			headers:auth.headers(state.language)
		}).then((res) => {
			let data = res.data
			let emotionState = resToEmotionStatus(status.emotionStatus, data.emotion)
			setStatus({ emotionStatus: emotionState })
		}).then(() => {
			setStatus({ isEmotionModalVisi: true, actionBtnVisi: false })
		}).catch((err) => {
			console.error(err)
		})
	}
	function checkImgAvailable(currentIndex) {
		asyncErrorHandling(async () => {
			setStatus({ actionBtnVisi: true })
			const now = status.fastSource[currentIndex]
			let res = await Axios.get(`${auth.url}/photo/${now.imgId}`, {
				headers:auth.headers(state.language)
			})
			let pObject = res.data
			if (_.isEmpty(pObject)) {
				setStatus({ isBug: true })
				throw Error('Not in server, need Refresh')
			}
		}, () => {
			setStatus({ actionBtnVisi: true })
		})
	}
	// function actions() {
	// 	var [
	// 		color,
	// 		buttonSize,
	// 		margin,
	// 	] = [
	// 		'#63CCC8',
	// 		55,
	// 		0
	// 	]
		
	// 	return [
	// 		{
	// 			text: 'Emotion',
	// 			icon: <Ionicons name="happy-outline" style={styles.actionButtonIcon} />,
	// 			name: 'Emotion',
	// 			position: 2,
	// 			margin,
	// 			color,
	// 			buttonSize,
	// 		},
	// 		{
	// 			text: 'Tags',
	// 			icon: <Ionicons name="pricetags-outline" style={styles.actionButtonIcon} />,
	// 			name: 'Tags',
	// 			position: 1,
	// 			color,
	// 			buttonSize,
	// 			margin,
	// 		}
	// 	]
	// }
	return (
		<View style={styles.root}>
			{
				!status.isMoving ? (
					// <FloatingAction
					// 	actions={actions()}
					// 	color='#63CCC8'
					// 	distanceToEdge={20}
					// 	overlayColor='transparent'
					// 	actionsPaddingTopBottom={2}
					// 	shadow={{ shadowOpacity: 0.9, shadowOffset: { width: 100, height: 100 }, shadowColor: '#F5B19C', shadowRadius: 10 }}
					// />
					<ActionButton
						buttonColor="rgba(231,76,60,1)"
						position='right'
						offsetX={10}
						offsetY={10}
						fixNativeFeedbackRadius={true}
						spacing={10}
						resetToken={status.reset}
						onPress={() => {
							if (!status.actionBtnVisi) {
								checkImgAvailable(currentIndex)
							} else {
								setStatus({ actionBtnVisi: false })
							}
						}}
					>
						<ActionButton.Item
							buttonColor='#F5B19C'
							title="Emotion"
							spaceBetween={8}
							onPress={() => {
								if (!status.isBug) {
									fetchEmotion(currentIndex)
								}
							}}
						>
							<Ionicons name="happy-outline" style={styles.actionButtonIcon} />
						</ActionButton.Item>
						<ActionButton.Item
							buttonColor='#63CCC8'
							title="New Tag"
							spaceBetween={8}
							onPress={() => {
								if (!status.isBug) {
									fetchTags(currentIndex)
								}
							}}
						>
							<Ionicons name="pricetags-outline" style={styles.actionButtonIcon} />
						</ActionButton.Item>
					</ActionButton>
				) : (
					null
				)
			}

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