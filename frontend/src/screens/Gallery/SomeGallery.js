import * as React from 'react'
import {
	StyleSheet,
	View,
	FlatList,
	Modal,
	TouchableOpacity,
	Dimensions,
} from 'react-native'
import { Overlay, SearchBar } from 'react-native-elements'
import FastImage from 'react-native-fast-image'
import ImageViewer from 'react-native-image-zoom-viewer'
import { photoFooter, TagList } from '../../components/photoComponent copy'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Axios from 'axios'
import { AuthContext } from '../../contexts/AuthContext'

export default function SomeGalleryScreen() {
	function useMergeState(initialState) {
		const [state, setState] = React.useState(initialState)
		const setStatus = newState =>
			setState(prevState => Object.assign({}, prevState, newState))
		return [state, setStatus]
	}
	const [status, setStatus] = useMergeState({
		isVisible: false,
		currendId: 0,
		isTagModalVisi: false,
		inputTag: '',
		fastSource: [],
		modalSource: [],
		tag: []
	})
	const { auth } = React.useContext(AuthContext)
	async function fetchImageSource(callback) {
		console.log('Loading photo')
		const temp = ['a', 'b', 'c']
		const accessToken = await auth.getAccessToken()
		let fSource = []
		let mSource = []
		for (const [i, v] of temp.entries()) {
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
		// load tag of the item
		setStatus({
			currentImg: item.src,
			currentId: item.id,
			isVisible: true,
		})
	}
	function addTag() {
		console.log(status.inputTag.length !== 0)
		console.log(status.inputTag.trim())
		if (status.inputTag.length !== 0 && status.inputTag.trim()) {
			console.log('adding tag')
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
		} else {
			setStatus({ inputTag: '' })
			// this.search.clear()
		}
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
			<Modal visible={status.isVisible} transparent={false} onRequestClose={() => { setStatus({ isVisible: false, isTagModalVisi: false }) }}>
				<ImageViewer
					imageUrls={status.modalSource}
					index={status.currentId}
					enablePreload={true}
					renderIndicator={() => null}
					renderFooter={(currentIndex) => photoFooter([status, setStatus], currentIndex)}
					footerContainerStyle={{ bottom: 0, position: 'absolute', zIndex: 1000 }}
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
	}
})
