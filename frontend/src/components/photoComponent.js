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
import _ from 'lodash'
import { resToEmotionStatus, asyncErrorHandling } from '../utils/utils'


export function TagList([status, setStatus], state) {
	function deleteTag(id, text) {
		Axios.delete(`http://${ipv4}:3000/photo/tag`, {
			params: {
				userId: state.user.id,
				photoId: status.currentPhotoId,
				custom_tag: text
			}
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


export function photoFooter(that, [status, setStatus], currentIndex, state) {

	function fetchTags(currentIndex) {
		const temp = _.flatMap(status.fastSource, (v) => {
			return v.pics.map((v) => { return _.pick(v, ['id', 'imgId']) })
		})
		const now = _.find(temp, (o) => { return o.id === currentIndex })
		setStatus({ currentPhotoId: now.imgId, currentId: now.id })
		Axios.get(`http://${ipv4}:3000/photo/tag`, {
			params: {
				userId: state.user.id,
				photoId: now.imgId
			}
		}).then((res) => {
			let data = JSON.parse(res.data)
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
		const temp = _.flatMap(status.fastSource, (v) => {
			return v.pics.map((v) => { return _.pick(v, ['id', 'imgId']) })
		})
		const now = _.find(temp, (o) => { return o.id === currentIndex })
		setStatus({ currentPhotoId: now.imgId, currentId: now.id })
		Axios.get(`http://${ipv4}:3000/photo/emotion`, {
			params: {
				userId: state.user.id,
				photoId: now.imgId
			}
		}).then((res) => {
			let data = JSON.parse(res.data)
			let emotionState = resToEmotionStatus(status.emotionStatus, data.message)
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
			const temp = _.flatMap(status.fastSource, (v) => {
				return v.pics.map((v) => { return _.pick(v, ['id', 'imgId']) })
			})
			const now = _.find(temp, (o) => { return o.id === currentIndex })
			let res = await Axios.get(`http://${ipv4}:3000/photo`, {
				params: {
					userId: state.user.id,
					photoId: now.imgId
				}
			})
			let pObject = JSON.parse(res.data.photo_object)
			if (_.isEmpty(pObject)) {
				setStatus({ isBug: true })
				throw Error('Not in server, need Refresh')
			}
		}, () => {
			setStatus({ actionBtnVisi: true })
		})
	}
	return (
		<View style={styles.root}>
			{
				!status.isMoving ? (
					<ActionButton
						buttonColor="rgba(231,76,60,1)"
						position='right'
						offsetX={10}
						offsetY={10}
						fixNativeFeedbackRadius={true}
						spacing={10}
						resetToken={status.reset}
						active={status.actionBtnVisi}
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