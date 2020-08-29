import * as React from 'react'
import {
	StyleSheet,
	View,
	FlatList,
	Modal,
	TouchableOpacity,
	Dimensions,
	Image,
	Text,
	ActivityIndicator
} from 'react-native'
import { Overlay, SearchBar, Button } from 'react-native-elements'
import FastImage from 'react-native-fast-image'
import ImageViewer from 'react-native-image-zoom-viewer'
import { photoFooter, TagList } from '../../components/NormalphotoComponent'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Axios from 'axios'
import ModalBox from 'react-native-modalbox'
import { AuthContext } from '../../contexts/AuthContext'
import AsyncStorage from '@react-native-community/async-storage'
import { checkEmotion, ErrorHandling } from '../../utils/utils'
import { ipv4 } from '../../utils/dev'
export default function GalleryScreen(that) {
	function useMergeState(initialState) {
		const [state, setState] = React.useState(initialState)
		const setStatus = newState =>
			setState(prevState => Object.assign({}, prevState, newState))
		return [state, setStatus]
	}
	const [status, setStatus] = useMergeState({
		aModal: false,
		isVisible: false,
		currentId: 0,
		currentPhotoId: '',
		isTagModalVisi: false,
		isEmotionModalVisi: false,
		inputTag: '',
		fastSource: [],
		modalSource: [],
		tag: [],
		emotionStatus: Array(6).fill(false),
		actionBtnVisi: false,
		isMoving: false,
		isLoading: true
	})
	const { auth, state } = React.useContext(AuthContext)
	function setEmotion(n) {
		let newEmotion = checkEmotion(status.emotionStatus, n).indexOf(true)
		Axios.put(`http://${ipv4}:3000/photo/emotion`, JSON.stringify({
			userId: state.user.id,
			photoId: status.currentPhotoId,
			emotion_tag: newEmotion
		}), {
			headers: {
				'Content-Type': 'application/json'
			}
		}).then((res) => {
			setStatus({ emotionStatus: newEmotion, isEmotionModalVisi: false })
		})
	}

	async function fetchImageSource(callback) {
		let deletedPid = await Axios.get(`http://${ipv4}:3000/photo`, {
			params: {
				userId: state.user.id,
				isDeleted:false
			}
		})
		console.log(deletedPid.data)
		const isLoaded = await AsyncStorage.getItem('GalleryLoaded')
		// if (isLoaded === 'false') {
		// 	console.log('Loading photo')
		// 	const accessToken = await auth.getAccessToken()
		// 	let pageToken = ''
		// 	let i = 0
		// 	do {
		// 		var params = {
		// 			pageSize: 100
		// 		}
		// 		if (pageToken) {
		// 			console.log('has pageToken')
		// 			params.pageToken = pageToken
		// 		}
		// 		try {
		// 			let res = await Axios.get('https://photoslibrary.googleapis.com/v1/mediaItems', {
		// 				params: params,
		// 				headers: {
		// 					'Authorization': `Bearer ${accessToken}`,
		// 					'Content-type': 'application/json'
		// 				}
		// 			})
		// 			pageToken = res.data['nextPageToken']
		// 			let mediaItems = res.data['mediaItems']
		// 			let fSource = status.fastSource
		// 			let mSource = status.modalSource
		// 			for (const item of mediaItems) {
		// 				var width = 400
		// 				var height = 400
		// 				var img = {
		// 					id: i++,
		// 					imgId: item['id'],
		// 					src: `${item['baseUrl']}=w${width}-h${height}`,
		// 					headers: { Authorization: `Bearer ${accessToken}` }
		// 				}
		// 				fSource.push(img)
		// 				mSource.push({
		// 					url: item['baseUrl'],
		// 				})
		// 			}
		// 			setStatus({ fastSource: fSource, modalSource: mSource })
		// 		} catch (err) {
		// 			console.log('error')
		// 			console.log(err.message)
		// 		}
		// 	} while (pageToken)
		// }
		callback(isLoaded)
	}
	React.useEffect(() => {
		fetchImageSource(async (isLoaded) => {
			console.log(isLoaded)
			if (isLoaded === 'false') {
				// first time
				let fSource = ['fSource', JSON.stringify(status.fastSource)]
				let mSource = ['mSource', JSON.stringify(status.modalSource)]
				let GalleryLoaded = ['GalleryLoaded', 'true']
				await AsyncStorage.multiSet([fSource, mSource, GalleryLoaded])
			} else {
				let temp = await AsyncStorage.multiGet(['fSource', 'mSource'])
				setStatus({ fastSource: JSON.parse(temp[0][1]), modalSource: JSON.parse(temp[1][1]) })
			}
		})
	}, [])

	function showImage(item) {
		// load tag of the item
		setStatus({
			currentId: item.id,
			isVisible: true,
			currentPhotoId: item.imgId,
			reset: undefined,
			actionBtnVisi: false
		})
	}


	function addTag() {
		if (status.inputTag.length !== 0 && status.inputTag.trim()) {
			let tags = [...status.tag]
			let l = tags.length
			let t
			if (l > 0) {
				t = Number(tags[0].key) + 1
			} else {
				t = 0
			}
			tags.unshift({ key: String(t), text: status.inputTag })
			setStatus({ tag: tags, inputTag: '' })
			Axios.put(`http://${ipv4}:3000/photo/tag`, JSON.stringify({
				userId: state.user.id,
				photoId: status.currentPhotoId,
				customTag: status.inputTag
			}), {
				headers: {
					'Content-Type': 'application/json'
				}
			})
		} else {
			setStatus({ inputTag: '' })
		}
	}
	function EmotionGroup() {
		let temp = [
			{ source: require('../../emotionIcon/like.gif'), index: 0 },
			{ source: require('../../emotionIcon/love.gif'), index: 1 },
			{ source: require('../../emotionIcon/haha.gif'), index: 2 },
			{ source: require('../../emotionIcon/wow.gif'), index: 3 },
			{ source: require('../../emotionIcon/sad.gif'), index: 4 },
			{ source: require('../../emotionIcon/angry.gif'), index: 5 },
		]
		return temp
	}
	function deletePhoto() {
		ErrorHandling(async () => {
			let res = await Axios.delete(`http://${ipv4}:3000/photo/${status.currentPhotoId}`, {
				params: {
					userId: state.user.id,
				}
			})
			if (res.status !== 200) {
				throw Error('Delete not success')
			}
		})
	}
	return (
		<View style={{flex: 1}}>
			{
				status.isLoading ? (
					<View style={{flex: 1, justifyContent: 'center'}}>
						<ActivityIndicator size='large' color="#FF6130" />
					</View>
				) : (
					<View style={{ flex: 1 }}>
						<Overlay
							isVisible={status.isTagModalVisi}
							onBackdropPress={() => { setStatus({ isTagModalVisi: false }) }}
							overlayStyle={styles.overlayStyle}
						>
							<View style={{ flex: 1 }} >
								<View>
									<SearchBar
										placeholder="Add Tag"
										onChangeText={(inputTag) => { setStatus({ inputTag: inputTag }) }}
										onSubmitEditing={() => addTag()}
										value={status.inputTag}
										inputStyle={{ color: '#303960' }}
										lightTheme={true}
										searchIcon={() => <Ionicons name='pricetag-outline' size={20} color='#75828e' />}
										round={true}
										containerStyle={{ padding: 5 }}
									/>
								</View>
								{TagList([status, setStatus], state)}
							</View>
						</Overlay>
						<Overlay isVisible={status.isEmotionModalVisi}
							onBackdropPress={() => { setStatus({ isEmotionModalVisi: false }) }}
							overlayStyle={styles.overlayStyle2}>

							<View style={{ flexDirection: 'row' }}>
								{
									EmotionGroup().map((item, i) => {
										return status.emotionStatus[i] === true ? (
											<TouchableOpacity key={i} activeOpacity={0.4} focusedOpacity={0.5} onPress={() => setEmotion(item.index)} style={{
												borderColor: 'black',
												borderWidth: 1
											}}>
												<Image
													style={styles.emotion}
													source={item.source}
												/>
											</TouchableOpacity>
										) : (
											<TouchableOpacity key={i} activeOpacity={0.4} focusedOpacity={0.5} onPress={() => setEmotion(item.index)}>
												<Image
													style={styles.emotion}
													source={item.source}
												/>
											</TouchableOpacity>
										)
									})
								}
							</View>
						</Overlay>
						<Modal visible={status.isVisible} transparent={false} onRequestClose={() => { setStatus({ isVisible: false, isTagModalVisi: false }) }}>
							<ImageViewer
								backgroundColor='#d7d7cb'
								imageUrls={status.modalSource}
								index={status.currentId}
								enableImageZoom={true}
								enablePreload={true}
								renderIndicator={() => null}
								onCancel={() => setStatus({ reset: true, isVisible: false })}
								onMove={(m) => {
									if (m.type === 'onPanResponderRelease') {
										setStatus({ isMoving: false, })
									} else {
										if (status.isMoving === false) {
											setStatus({ isMoving: true, actionBtnVisi: false })
										}
									}
								}}
								renderFooter={(currentIndex) => photoFooter(that, [status, setStatus], currentIndex, state)}
								footerContainerStyle={{
									flex: 1,
									alignSelf: 'flex-end',
									flexDirection: 'row',
									width: 140,
									height: 200,
									// borderColor: 'black',
									// borderWidth: 1,
									zIndex: 1
								}}
							/>
						</Modal>
						<FlatList
							data={status.fastSource}
							renderItem={({ item }) => (
								<View style={{ flex: 1, flexDirection: 'column', margin: 1 }}>
									<TouchableOpacity onPress={() => showImage(item)} onLongPress={() => setStatus({ currentPhotoId: item.imgId, aModal: true })}>
										<FastImage
											style={styles.imageThumbnail}
											source={{
												uri: item.src,
												headers: item.headers,
											}}
										/>
									</TouchableOpacity>
								</View>
							)}
							//Setting the number of column
							numColumns={3}
							keyExtractor={(item, index) => index}
						/>
						<ModalBox backButtonClose={true} isOpen={status.aModal} onClosed={() => setStatus({ aModal: false, currentPhotoId: null })} style={styles.modal4} position={'center'}>
							<View style={styles.modal}>
								<View style={styles.AlbumText}>
									<Text h1 style={{ fontSize: 22, color: '#303960' }}>Delete Photo</Text>
								</View>
								<View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end' }}>
									<View>
										<Button
											title="Dismiss"
											type="outline"
											titleStyle={styles.modalBtnTitle}
											onPress={() => setStatus({ aModal: false, currentPhotoId: null })}
											buttonStyle={styles.modalBtnStyle}
										/>
									</View>
									<View>
										<Button
											title="Delete"
											type="outline"
											titleStyle={styles.modalBtnTitle}
											onPress={() => deletePhoto()}
											buttonStyle={styles.modalBtnStyle}
										/>
									</View>
								</View>
							</View>
						</ModalBox>
					</View>
				)
			}
		</View >
	)

}
const screenWidth = Math.round(Dimensions.get('window').width)
const screenHeight = Math.round(Dimensions.get('window').height)
const styles = StyleSheet.create({
	imageThumbnail: {
		justifyContent: 'center',
		alignItems: 'center',
		height: 100,
	},
	overlayStyle: {
		height: screenHeight * 0.5,
		width: screenWidth * 0.8,
		margin: 0,
		padding: 0,
	},
	Save: {
		paddingRight: 5,
		fontSize: 17,
		color: '#63CCC8',
	},
	overlayStyle2: {
		height: 55,
		width: 313,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 0,
		margin: 0,
		borderRadius: 15,
		backgroundColor: '#63CCC8'
	},
	emotion: {
		width: 50,
		height: 50,
	},
	modalBtnTitle: { color: '#303960', fontWeight: 'bold' },
	modalBtnStyle: { borderColor: '#303960', width: 90, borderWidth: 2 },
	modal4: {
		backgroundColor: '#63CCC8',
		height: 115,
		width: '90%',
		borderRadius: 15,
		borderColor: '#F5B19C',
		borderWidth: 2
	},
	modal: {
		flex: 1,
		alignItems: 'stretch',
	},
	AlbumText: {
		justifyContent: 'flex-start',
		alignItems: 'center',
		padding: 10,
	}
})