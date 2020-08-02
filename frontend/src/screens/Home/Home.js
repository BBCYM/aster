// for cai
import * as React from 'react'
import {
	StyleSheet,
	View,
	FlatList,
	Modal,
	TouchableOpacity,
	Dimensions,
	Text
} from 'react-native'
import { Overlay, SearchBar } from 'react-native-elements'
import FastImage from 'react-native-fast-image'
import ImageViewer from 'react-native-image-zoom-viewer'
import { photoFooter, TagList } from '../../components/photoComponent copy'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Axios from 'axios'
import { AuthContext } from '../../contexts/AuthContext'

export default function SomeGalleryScreen(props) {
	function useMergeState(initialState) {
		const [state, setState] = React.useState(initialState)
		const setStatus = newState =>
			setState(prevState => Object.assign({}, prevState, newState))
		return [state, setStatus]
	}
	const [status, setStatus] = useMergeState({
		isVisible: false,
		currendId: 0,
		//isTagModalVisi: false,
		//inputTag: '',
		fastSource: [],
		modalSource: [],
		//tag: [],
		albumName: '',
		//image:'',
		photoId: 0
	})
	const { auth } = React.useContext(AuthContext)
	async function fetchImageSource(callback) {
		console.log('Loading photo')
		const accessToken = await auth.getAccessToken()
		let fSource = []
		// v = id
		for (const [i, v] of temp.entries()){
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
				albumId: item['id'] ,
				imgsrc: `${item['baseUrl']}=w${width}-h${height}`,
				imgsArr: [],
				headers: { Authorization: `Bearer ${accessToken}` }
			}
			fSource.push(img)
			// mSource.push({
			// 	url: item['baseUrl'],
			// 	// props:{
			// 	// 	headers:{Authorization:`Bearer ${accessToken}`}
			// 	// }
			// })
			setStatus({ fastSource: fSource})
		})
		// for (const [i, v] of temp.entries()) {
		}
	}
	async function fetchAlbums(){
		const response = await fetch("http://172.20.10.8:3000/album", {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'X-Requested-With': "com.rnexparea"
			},
		})
		var albumId = await response.json()
		var photoId = await response.json()
		var albumName = await response.json()
		//var data = JSON.parse(data)
		//console.log(data)
        fetchImageSource = () => {
			this.setState({photoId: this.state.photoId})

		}
		
		this.setState({ albumName: albumName })
		//this.setState({image: photoId   })

		
		// fetch albums from back end
		// get album id and photo ids
		// pass 1 image id to fetchImageSource()
		// set state to show image
	}
	
	React.useEffect(() => {
		 fetchAlbums()
		console.log('hello from some screen')
	}, [])

	function showAlbum(item) {
		navigation.navigate('SomeGallery',{
			albumId: item.id,
			imgsArr: [] 

		})
		// navigagte to SomeGallery, also pass album details to it
		// albumid
		// imgArr
		//props.navigator
	}


	return (
		<View style={{ flex: 1 }}>
			<FlatList
				data={status.fastSource}
				renderItem={({ item }) => (
					<View style={{ flex: 1, flexDirection: 'column', margin: 1 }}>
						<TouchableOpacity onPress={() => showAlbum(item)}>
							<FastImage
								style={styles.imageThumbnail}
								source={{
									uri: item.src,
									headers: item.headers,
									priority: FastImage.priority.high,
								}}
							/>
							<Text style={{ marginLeft: 30, fontSize: 18 }}>{this.state.albumName}</Text>
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
