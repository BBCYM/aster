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
import ModalBox from 'react-native-modalbox'
import { Overlay, SearchBar, Button } from 'react-native-elements'
import FastImage from 'react-native-fast-image'
import ImageViewer from 'react-native-image-zoom-viewer'
import { photoFooter, TagList } from '../../components/photoComponent'
import { OneClickAction, AlbumModal } from '../../components/oneClickEdit'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Axios from 'axios'
import { AuthContext } from '../../contexts/AuthContext'
import { checkEmotion, asyncErrorHandling } from '../../utils/utils'
import _ from 'lodash'


export default function AlbumDetails(props) {
	function useMergeState(initialState) {
		const [state, setState] = React.useState(initialState)
		const setStatus = newState =>
			setState(prevState => Object.assign({}, prevState, newState))
		return [state, setStatus]
	}
	const [status, setStatus] = useMergeState({
		isVisible: false,
		currentId: 0,
		currentPhotoId: '',
		isTagModalVisi: false,
		isEmotionModalVisi: false,
		inputTag: '',
		fastSource: [],
		modalSource: [],
		tag: [],
		aModal: false,
		emotionStatus: Array(6).fill(false),
		actionBtnVisi: false,
		isMoving: false,
		bModal: false,
		isLoading:true
	})
	const { auth, state } = React.useContext(AuthContext)
	function setEmotion(n) {
		let newEmotion = checkEmotion(status.emotionStatus, n).indexOf(true)
		Axios.put(`${auth.url}/photo/emotion/${status.currentPhotoId}`, JSON.stringify({
			emotion_tag: newEmotion
		}), {
			headers: auth.headers(state.language)
		}).then((res) => {
			setStatus({ emotionStatus: newEmotion, isEmotionModalVisi: false })
		})
	}
	React.useEffect(() => {
		fetchImageSource(()=>{
			console.log('hello from some screen')
			setStatus({isLoading:false})
		})
	}, [])
	async function fetchImageSource(callback) {
		console.log('Loading photo')
		let res = await Axios.get(`${auth.url}/album/photo/${props.route.params.albumId}`, {
			headers:auth.headers(state.language)
		})
		setStatus({ currentAlbumId: props.route.params.albumId, aName: props.route.params.albumTitle, preBuildTag: res.data['albumTagArray'].map((v, i) => ({ key: res.data['albumTagArray'].length - i - 1, text: v })) })
		const accessToken = await auth.getAccessToken()
		let fSource = []
		let mSource = []
		let i = 0
		res.data['albumPhotoIdArray'].forEach(async (v, k) => {
			try {
				let gres = await Axios.get(`https://photoslibrary.googleapis.com/v1/mediaItems/${v}`, {
					headers: {
						'Authorization': `Bearer ${accessToken}`,
						'Content-type': 'application/json'
					}
				})
				var item = gres.data
				var width = 400
				var height = 400
				var img = {
					id: i++,
					imgId: item['id'],
					src: `${item['baseUrl']}=w${width}-h${height}`,
					headers: { Authorization: `Bearer ${accessToken}` }
				}
				fSource.push(img)
				mSource.push({ url: item['baseUrl'] })
			} catch (err) {
				console.log(err)
			}
			await setStatus({ fastSource: fSource, modalSource: mSource })
		})
		callback()
	}

	async function showImage(item) {
		await setStatus({
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
			Axios.put(`${auth.url}/photo/tag/${status.currentPhotoId}`, JSON.stringify({
				customTag: status.inputTag
			}), {
				headers: auth.headers(state.language)
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
		asyncErrorHandling(async () => {
			let res = await Axios.delete(`${auth.url}/album/photo/${status.currentPhotoId}`, {
				headers:auth.headers(state.language)
			})
			if (res.status !== 200) {
				throw Error('Delete not success')
			}
		}, async () => {
			var index = _.findIndex(status.fastSource, function (o) { return o.imgId === status.currentPhotoId })
			var fSource = [...status.fastSource]
			var mSource = [...status.modalSource]
			_.pullAt(fSource, index)
			_.pullAt(mSource, index)
			setStatus({ fastSource: fSource, modalSource: mSource, bModal: false })
		})
	}
	return (
		<View style={{ flex: 1 }}>
			{
				status.isLoading ? (
					<View style={{ flex: 1, justifyContent: 'center' }}>
						<ActivityIndicator size='large' color="#FF6130" />
					</View>
				) : (
					<View style={{ flex: 1 }}>
						<ModalBox useNativeDriver={true} animationDuration={300} backButtonClose={true} isOpen={status.bModal} onClosed={() => setStatus({ bModal: false, currentPhotoId: null })} style={styles.modal4} position={'center'}>
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
											onPress={() => setStatus({ bModal: false, currentPhotoId: null })}
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
						<FlatList
							data={status.fastSource}
							extraData={status}
							renderItem={({ item }) => (
								<View style={styles.photoSize}>
									<TouchableOpacity onPress={() => showImage(item)} onLongPress={() => setStatus({ bModal: true, currentPhotoId: item.imgId })}>
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
							numColumns={3}
							keyExtractor={(item, index) => index.toString()}
						/>

						{AlbumModal([status, setStatus], state, props, auth)}
						{OneClickAction([status, setStatus])}
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
								{TagList([status, setStatus], auth, state)}
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
								useNativeDriver={true}
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
								renderIndicator={() => null}
								renderFooter={(currentIndex) => photoFooter(props, [status, setStatus], currentIndex, state)}
								footerContainerStyle={{
									flex: 1,
									alignSelf: 'flex-end',
									flexDirection: 'row',
									width: 140,
									height: 200,
									zIndex: 1
								}}
							/>
						</Modal>
					</View>
				)
			}
		</View>
	)

}
const screenWidth = Math.round(Dimensions.get('window').width)
const screenHeight = Math.round(Dimensions.get('window').height)
const styles = StyleSheet.create({
	_innerContainer: {
		top: 0,
		left: -5,
		width: 10,
		height: 10,
		backgroundColor: '#FF6130',
		borderRadius: 30,
		position: 'absolute',
		alignItems: 'center',
		justifyContent: 'center',
		shadowColor: '#FF6130',
		shadowRadius: 8,
		shadowOpacity: 0.3,
		shadowOffset: {
			width: 0,
			height: 3
		},
		zIndex: 1
	},
	outerContainer: {
		width: 20,
		height: 20,
		borderColor: 'rgba(255, 97, 48, 0.1)',
		borderWidth: 3,
		backgroundColor: 'rgba(255, 97, 48, 0.05)',
		borderRadius: 16,
	},
	dashContainer: {
		paddingTop: 10,
		paddingRight: 10,
		paddingLeft: 10,
		flexDirection: 'column',
		alignItems: 'center'
	},
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
	},
	photoSize: {
		resizeMode: 'center',
		width: (screenWidth - 9)/3,
		flexDirection: 'column',
		margin:1.5
	}
})
