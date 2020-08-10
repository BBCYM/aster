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
//import { photoFooter, TagList } from '../../components/photoComponent copy'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Axios from 'axios'
import { AuthContext } from '../../contexts/AuthContext'
import { ipv4 } from '../../utils/dev';
import { TextInput } from 'react-native-gesture-handler'
import { createIconSetFromFontello } from 'react-native-vector-icons'

export default function HomeScreen(props) {
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
		albumId: 0
	})
	const { auth } = React.useContext(AuthContext)
	async function fetchAlbumSource(callback) {
		const accessToken = await auth.getAccessToken()
        //get albumid Name coverPhotoId
		try {
			let res = await Axios.get(`http://${ipv4}:3000/album`, {
				headers: {
					'Authorization': `Bearer ${accessToken}`,
					'Content-type': 'application/json'
				}
			})
			var data = await response.json()
  			//var data = JSON.parse(data)
  			console.log(data)
			
			//let albumId = res.data['albumId']
			 let fSource = status.fastSource
			for (const [i, item] of mediaItems.entries()) {
				let res = await Axios.get(`https://photoslibrary.googleapis.com/v1/mediaItems/${coverPhotoId}`, {
					headers: {
						'Authorization': `Bearer ${accessToken}`,
						'Content-type': 'application/json'
					}
				})
				let albums = res.data['albums']
				let fSource = status.fastSource
				var width = 400
				var height = 400
				var img = {
					id: i,
					albumId: item['id'],
					title: item['title'],
					coverUrl: `${item['BaseUrl']}=w${width}-h${height}`,
					coverId: item['coverPhotoMediaItemId'],
					headers: { Authorization: `Bearer ${accessToken}` },
				}
				fSource.push(img)
			}
			setStatus({ fastSource: fSource })
		} catch (err) {
			console.log('error')
			console.log(err)
		}
		// callback(isLoaded)
	}

	//get Tag
	async function fetchAlbumsTag() {
		const response = await fetch(`http://${ipv4}:3000/album/tag`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'X-Requested-With': "com.rnexparea"
			},
		})
		var albumId = await response.json()

		//albumPhot albumTag albumName 
		//var data = JSON.parse(data)
		//console.log(data)
		// album_tag_array = []
		this.setState({})
		//this.setState({image: photoId   })

	}

	React.useEffect(() => {
		fetchAlbumSource()
		console.log('hi album')
	}, [])

	//go to albumphoto
	function showAlbum(item) {
		navigation.navigate('SomeAlbumGallery', {
			// albumId:string, photoIds:[], albumtitle:string, 
			albumId: item.id,
			photos: albumPhotos['photoId'],
			albumTitle: item.title
		})
	}

	//delete album
	async function deleteAlbum() {
		var r = alert('Delete?')
		if (r = true) {
			const response = await fetch(`http://${ipv4}:3000/album`, {
				method: 'Delete',
				hesders: {
					'Content-Type': 'application/json',
					'X-Requested-With': "com.rnexparea"
				},
				body: {
					albumId: this.state.albumId,
				}
			})
		}
	}

	//delete album and albumphoto
	//edit albumName
	return (
		<View style={styles.container}>
			<Text style={styles.title}
				style={{
					fontSize: 20,
					color: 'black',
					//backgroundColor: 'white',
				}}>

			</Text>
			<FlatList
				data={status.fastSource}
				renderItem={({ item }) => (
					<View style={{ flex: 1, flexDirection: 'column', margin: 1 }}>
						<TouchableOpacity
							key={item.id}
							style={{ flex: 1 }}
							onPress={() => showAlbum(item)}
							onLongPress={() => deleteAlbum(albumId)}
						>
							<FastImage
								style={styles.image}
								source={{
									uri: item.coverUrl,
									headers: item.headers,
									priority: FastImage.priority.high,
								}}
							/>
							<Text style={{ marginLeft: 30, fontSize: 18 }}>{this.state.albumName}</Text>
						</TouchableOpacity>
					</View>
				)}
				//Setting the number of column
				numColumns={2}
				keyExtractor={(item, index) => index.toString()}
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
