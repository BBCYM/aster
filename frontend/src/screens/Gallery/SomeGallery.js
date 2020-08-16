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
import { Overlay, SearchBar, Badge } from 'react-native-elements'
import FastImage from 'react-native-fast-image'
import ImageViewer from 'react-native-image-zoom-viewer'
import { photoFooter, TagList } from '../../components/photoComponent'
import { OneClickAction, AlbumModal } from '../../components/oneClickSave'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Axios from 'axios'
import { AuthContext } from '../../contexts/AuthContext'
import { checkEmotion, preCleanPid, concatLocalTag } from '../../utils/utils'
import { ipv4 } from '../../utils/dev'
import Dash from 'react-native-dash'
import _ from 'lodash'


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
		aModal: false,
		emotionStatus: Array(6).fill(false),
		isMoving:false
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
	React.useEffect(() => {
		fetchImageSource()
		console.log('hello from some screen')
	}, [])
	async function fetchImageSource(callback) {
		console.log('Loading photo')
		let hashTag = preCleanPid(props.route.params.pid_tag)
		let { pids, temp } = concatLocalTag(hashTag)
		setStatus({ preBuildTag: temp })
		const accessToken = await auth.getAccessToken()
		let fSource = []
		let mSource = []
		await hashTag.forEach(async (v, k) => {
			fSource.push({ key: k, tags: v.tag, pics: [] })
			let m = _.findIndex(fSource,function (o){return o.key === k})
			for (const onePid of v.pid) {
				await Axios.get(`https://photoslibrary.googleapis.com/v1/mediaItems/${onePid}`, {
					headers: {
						'Authorization': `Bearer ${accessToken}`,
						'Content-type': 'application/json'
					}
				}).then(async(res) => {
					var item = res.data
					var width = 400
					var height = 400
					var img = {
						id: pids.indexOf(item['id']),
						imgId: item['id'],
						src: `${item['baseUrl']}=w${width}-h${height}`,
						headers: { Authorization: `Bearer ${accessToken}` }
					}
					fSource[m].pics.push(img)
					mSource.push({url:item['baseUrl']})
					await setStatus({ modalSource:mSource, fastSource: fSource})
				})
			}	
		})
	}

	async function showImage(item) {
		console.log(item.id)
		await setStatus({
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
			<FlatList
				data={status.fastSource}
				extraData={status}
				renderItem={({ item }) => (
					<View style={{flex:1, flexDirection: 'row'}}>
						<View style={styles.dashContainer}>
							<View>
								<View style={styles._innerContainer}>
									<View
										style={styles.outerContainer}
									/>
								</View>
							</View>
							<View>
								<Dash dashGap={7} dashLength={5} dashColor="#63CCC8" style={{ width: 1, height: '100%', flexDirection: 'column' }} />
							</View>
						</View>
						<View style={{flex:1,paddingTop:5,paddingBottom:5}}>
							<View style={{flex:1, flexDirection:'row-reverse', padding:3}}>
								{
									item.tags.map((v,i)=>(
										<View key={i}>
											<Badge status='error' value={v}/>
										</View>
									))
								}
								
							</View>
							<FlatList
								data={item.pics}
								extraData={status}
								renderItem={(block) => (
									<View style={{ flex: 1, flexDirection: 'column', margin: 1 }}>
										<TouchableOpacity onPress={() => showImage(block.item)}>
											<FastImage
												style={styles.imageThumbnail}
												source={{
													uri: block.item.src,
													headers: block.item.headers,
												}}
											/>
										</TouchableOpacity>
									</View>
								)}
								//Setting the number of column
								numColumns={3}
								listKey={(item,index)=>item.imgId}
							/>
						</View>
					</View>
				)}
				keyExtractor={(item, index) => {
					return item.key
				}}
			/>

			{AlbumModal([status, setStatus], state, props)}
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
					onMove={(m)=>{
						if(m.type==='onPanResponderRelease'){
							setStatus({isMoving:false, })
						} else {
							if(status.isMoving===false){
								setStatus({isMoving:true,actionBtnVisi:false})
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
						// borderColor: 'black',
						// borderWidth: 1,
						zIndex: 1
					}}
				/>
			</Modal>
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
	}
})
