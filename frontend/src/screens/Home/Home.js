import * as React from 'react'
import {
	StyleSheet,
	View,
	FlatList,
	TouchableOpacity,
	Dimensions,
	Text,
} from 'react-native'
import Modal from 'react-native-modalbox';
import { Input, ListItem, Button } from 'react-native-elements'
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
		albumName: '',
		albumId: 0,
		isOpen: false,
		isDisabled: false,
		aModal: false
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
		console.log('hi album')
	}, [])

	//go to albumphoto
	function showAlbum(item) {
		props.navigation.navigate('SomeGallery', {
			albumId: item.albumId,
			albumTitle: item.title
		})
	}

	//delete album
	async function deleteAlbum() {
		const response = await fetch(`http://${ipv4}:3000/album?_id=5f3d46604d0267a1a3b7d9e9`, {
			method: 'DELETE',
			hesders: {
				'Content-Type': 'application/json',
				'X-Requested-With': "com.rnexparea"
			},
		})
		console.log("delete ok")

		let slicedAlbum = [...status.doubleCheese]
        var result = slicedAlbum.findIndex((v, i) => {
            return v.albumId === status.toDel
        })
        slicedAlbum.splice(result, 1)
        setStatus({ doubleCheese: slicedAlbum , toDel: null,aModal: false  })
	}
	return (
		<View>
			<Modal backButtonClose={true} isOpen={status.aModal} onClosed={() => setStatus({ aModal: false })} style={styles.modal4} position={"bottom"}>
				<View style={styles.modal}>
					<View style={styles.AlbumText}>
						<Text h1 style={{ fontSize: 20, color: 'black' }}>刪除相簿</Text>
					</View>
					<View style={{ paddingTop: 30, paddingBottom: 30, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end' }}>
						<View>
							<Button
								title="Dismiss"
								type="outline"
								titleStyle={{ color: 'black' }}
								onPress={() => setStatus({ aModal: false })}
								buttonStyle={{ borderColor: 'black', width: 100 }}
							/>
						</View>
						<View>
							<Button
								title="delete"
								type="outline"
								titleStyle={{ color: 'black' }}
								onPress={() => deleteAlbum()}
								buttonStyle={{ borderColor: 'black', width: 100 }}
							/>
						</View>
					</View>
				</View>
			</Modal>
			<View style={styles.container}>

				{/* <Text style={styles.title}
					style={{
						fontSize: 20,
						color: 'black',
						//backgroundColor: 'white',
					}}>

				</Text> */}
				<FlatList
					data={status.fastSource}
					renderItem={({ item }) => (
						<View style={{ flex: 1, flexDirection: 'column', margin: 1 }}>
							<TouchableOpacity
								key={item.id}
								style={{ flex: 1 }}
								onPress={() => showAlbum(item)}
								onLongPress={() => setStatus({ aModal: true, toDel:item.albumId })} 
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
					numColumns={2}
					keyExtractor={(item, index) => index}
				/>
			</View>
		</View>

	)

}
const screenWidth = Math.round(Dimensions.get('window').width)
const screenHeight = Math.round(Dimensions.get('window').height)
const styles = StyleSheet.create({
	image: {
		height: 125,
		width: 150,
		borderRadius: 20,
		overflow: "hidden",
		marginLeft: 23,
		marginTop: 30

	},
	container:{
		// borderWidth:2,
		// borderColor:'green',
		// flex:1,
		height:'100%',
		width:'100%'

	},
	modal4: {
		backgroundColor:'green',
		height: 200,
	},
	modal: {
		flex: 1,
		alignItems: 'stretch',
		// backgroundColor: '#b197fc',
		// borderTopLeftRadius: 30,
		// borderTopRightRadius: 30,
	},
	AlbumText: {
		justifyContent: 'flex-start',
		alignItems: 'center',
		padding: 10,
		// borderColor: 'black',
		// borderWidth: 1
	}

})