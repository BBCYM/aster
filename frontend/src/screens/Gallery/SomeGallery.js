import * as React from 'react'
import {
	StyleSheet,
	View,
	FlatList,
	Modal,
	TouchableOpacity,
	Dimensions,
	Image
} from 'react-native'
import { Overlay, SearchBar } from 'react-native-elements'
import FastImage from 'react-native-fast-image'
import ImageViewer from 'react-native-image-zoom-viewer'
import { photoFooter, TagList } from '../../components/photoComponent'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Axios from 'axios'
import { AuthContext } from '../../contexts/AuthContext'
import { checkEmotion, preCleanPid } from '../../utils/utils'
import { ipv4 } from '../../utils/dev'


export default function SomeGalleryScreen(props) {
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
		emotionStatus: Array(6).fill(false),
	})
	const { auth,state } = React.useContext(AuthContext)
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
		console.log('Loading photo')
		// const cleanImgnTag = preCleanPid(props.route.params.pid_tag)
		// console.log(cleanImgnTag)
		const temp = props.route.params.pid
		const accessToken = await auth.getAccessToken()
		let fSource = []
		let mSource = []
		for (const [i,v] of temp.entries()) {
			Axios.get(`https://photoslibrary.googleapis.com/v1/mediaItems/${v}`, {
				headers: {
					'Authorization': `Bearer ${accessToken}`,
					'Content-type': 'application/json'
				}
			}).then((res) => {
				var item = res.data
				var width = 400
				var height = 400
				var img = {
					id: i,
					imgId: item['id'],
					src: `${item['baseUrl']}=w${width}-h${height}`,
					headers: { Authorization: `Bearer ${accessToken}` }
				}
				fSource.push(img)
				mSource.push({
					url: item['baseUrl'],
					// props:{
					// 	headers:{Authorization:`Bearer ${accessToken}`}
					// }
				})
				setStatus({ fastSource: fSource, modalSource: mSource })
			})
		}
	}
	React.useEffect(() => {
		fetchImageSource()
		console.log('hello from some screen')
	}, [])

	function showImage(item) {
		setStatus({
			currentImg: item.src,
			currentId: item.id,
			isVisible: true,
			currentPhotoId: item.imgId,
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

	return (
		<View style={{ flex: 1 }}>
			<Overlay
				isVisible={status.isTagModalVisi}
				onBackdropPress={() => { setStatus({ isTagModalVisi: false }) }}
				overlayStyle={styles.overlayStyle}
			>
				<View style={{ flex: 1 }} >
					<View>
						<SearchBar
							// ref={search => this.search = search}
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
					{TagList([status, setStatus])}
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
									borderColor:'black',
									borderWidth:1
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
					renderIndicator={() => null}
					renderFooter={(currentIndex) => photoFooter(that, [status, setStatus], currentIndex, state)}
					footerContainerStyle={{
						flex: 1,
						alignSelf: 'flex-end',
						flexDirection: 'row',
						width: 140,
						height: 200,
						borderColor: 'black',
						borderWidth: 1,
						zIndex: 1
					}}
				/>
			</Modal>
			<FlatList
				data={status.fastSource}
				renderItem={({ item }) => (
					<View style={{ flex: 1, flexDirection: 'column', margin: 1 }}>
						<TouchableOpacity onPress={() => showImage(item)}>
							<FastImage
								style={styles.imageThumbnail}
								source={{
									uri: item.src,
									headers: item.headers,
									priority: FastImage.priority.high,
								}}
							/>
						</TouchableOpacity>
					</View>
				)}
				//Setting the number of column
				numColumns={3}
				keyExtractor={(item, index) => index}
			/>
		</View>
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
	emotion:{
		width: 50,
		height: 50,
	}
})
