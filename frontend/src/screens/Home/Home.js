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
import Axios from 'axios'
import { AuthContext } from '../../contexts/AuthContext'
import { ipv4 } from '../../utils/dev';
import _ from 'lodash'

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
		aModal: false
	})
	const { auth, state } = React.useContext(AuthContext)
	async function fetchAlbumSource(callback) {
		const accessToken = await auth.getAccessToken()
		const userId = await state.user.id
		try {
			const response = await fetch(`${auth.url}/album/${userId}`, {
				method: 'GET',
				headers: auth.headers
			})
			var data = await response.json()
			let fSource = []
			let i = 0
			for (const [_id, _title, _coverId] of _.zip(data._idArray, data.albumNameArray, data.coverPhotoIdArray)) {
				console.log(_id, _title, _coverId)
				let res = await Axios.get(`https://photoslibrary.googleapis.com/v1/mediaItems/${_coverId}`, {
					headers:  {
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
			}
		} catch (err) {
			console.log('error')
			console.log(err)
		} 
	}
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
		const response = await fetch(`${auth.url}/album/${status.toDel}`, {
			method: 'DELETE',
			hesders: auth.headers 
		})
		console.log("delete ok")
		let slicedAlbum = [...status.fastSource]
        var result = slicedAlbum.findIndex((v, i) => {
            return v.albumId === status.toDel
        })
		slicedAlbum.splice(result, 1)
        setStatus({ fastSource: slicedAlbum , toDel: null,aModal: false })
	}
	return (
		<View>
			<Modal backButtonClose={true} isOpen={status.aModal} onClosed={() => setStatus({ aModal: false })} style={styles.modal4} position={"bottom"}>
				<View style={styles.modal}>
					<View style={styles.AlbumText}>
						<Text h1 style={{ fontSize: 23, color: 'white', paddingTop: 10, }}>刪除</Text>
					</View>
					<View style={{ paddingTop: 35, paddingBottom: 35, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end' }}>
						<View>
							<Button
								title="Dismiss"
								type="outline"
								titleStyle={{color: 'white' }}
								onPress={() => setStatus({ aModal: false })}
								buttonStyle={{ borderColor: 'white', width: 100}}
							/>
						</View>
						<View>
							<Button
								title="delete"
								type="outline"
								titleStyle={{ color: 'white' }}
								onPress={() => deleteAlbum()}
								buttonStyle={{ borderColor: 'white', width: 100}}	
							/>
						</View>
					</View>
				</View>
			</Modal>
			<View style={styles.container}>
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
		height:'100%',
		width:'100%',
	},
	modal4: {
		backgroundColor:'#ACD6FF',
		height: 220,
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
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
	AlbumTitle: {
		flexDirection: 'row',
		alignItems: 'stretch',
		paddingRight: 15,
		paddingLeft: 15,
		paddingBottom: 0,
		margin: 0,
		// borderColor: 'red',
		// borderWidth: 1
	},
})