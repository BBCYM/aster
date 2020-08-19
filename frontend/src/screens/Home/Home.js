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
import _ from 'lodash'
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
		fastSource: [],
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
			const response = await fetch(`http://${ipv4}:3000/album?userId=113073984862808105932`, {
				method: 'GET',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'X-Requested-With': "com.rnexparea",
					//'Authorization': 'Bearer 5f380ee0789056bccfab23ed'	
				},
			})
			var data = await response.json()
			let fSource = []
			let i = 0
			for (const [_id, _title, _coverId] of _.zip(data._idArray, data.albumNameArray, data.coverPhotoIdArray)) {
				console.log(_id, _title, _coverId)
				let res = await Axios.get(`https://photoslibrary.googleapis.com/v1/mediaItems/${_coverId}`, {
					headers: {
						'Authorization': `Bearer ${accessToken}`,
						'Content-type': 'application/json'
					}
				})
				var width = 400
				var height = 400
				var album = {
					id: i++,
					albumId: _id,
					title: _title,
					coverUrl: `${res.data['baseUrl']}=w${width}-h${height}`,
					headers: { Authorization: `Bearer ${accessToken}` },
				}
				fSource.push(album)
				await setStatus({ fastSource: fSource })
				// fastSource=[{id:, albumId:, title:,coverUrl:,headers:}*n]
			}
		} catch (err) {
			console.log('error')
			console.log(err)
		}
	}

	//get Tag
	// async function fetchAlbumsTag() {
	// 	const response = await fetch(`http://${ipv4}:3000/album/tag?_id=5f380ee0789056bccfab23ed`, {
	// 		method: 'GET',
	// 		headers: {
	// 			'Accept': 'application/json',
	// 			'Content-Type': 'application/json',
	// 			'X-Requested-With': "com.rnexparea",
	// 		},
	// 	})
	// 	var data = await response.json()
	// 	var tag = data.result
	// 	console.log(data)

	// 	console.log(tag)

	// 	//albumPhot albumTag albumName 
	// 	//var data = JSON.parse(data)
	// 	//console.log(data)
	// 	// album_tag_array = []
	// 	//this.setState({})
	// 	//this.setState({image: photoId   })

	// }

	React.useEffect(() => {
		fetchAlbumSource()
		//fetchAlbumsTag()
		console.log('hi album')
	}, [])

	//go to albumphoto
	function showAlbum(item) {
		props.navigation.navigate('SomeGallery', {
			// albumId:string, photoIds:[], albumtitle:string, 
			albumId: item.albumId,
			albumTitle: item.title
		})
	}

	//delete album
	// async function deleteAlbum() {
	// 	var r = alert('Delete?')
	// 	if (r = true) {
	// 		const response = await fetch(`http://${ipv4}:3000/album`, {
	// 			method: 'Delete',
	// 			hesders: {
	// 				'Content-Type': 'application/json',
	// 				'X-Requested-With': "com.rnexparea"
	// 			},
	// 			body: {
	// 				albumId: this.state.albumId,
	// 			}
	// 		})
	// 	}
	// }
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
							<Text style={{ marginLeft: 30, fontSize: 18 }}>{item.title}</Text>
						</TouchableOpacity>
					</View>
				)}
				//Setting the number of column
				numColumns={2}
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
	image: {
		height: 125,
		width: 150,
		borderRadius: 20,
		overflow: "hidden",
		marginLeft: 23,
		marginTop: 30

	},
})