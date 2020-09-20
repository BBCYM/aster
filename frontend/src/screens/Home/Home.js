import * as React from 'react'
import {
	StyleSheet,
	View,
	FlatList,
	TouchableOpacity,
	Text,
	ActivityIndicator,
} from 'react-native'
import Modal from 'react-native-modalbox'
import { Button } from 'react-native-elements'
import FastImage from 'react-native-fast-image'
import Axios from 'axios'
import { AuthContext } from '../../contexts/AuthContext'
import _ from 'lodash'
import Snackbar from 'react-native-snackbar'

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
		aModal: false,
		isLoading: true
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
		callback()
	}
	React.useEffect(() => {
		fetchAlbumSource(() => {
			console.log('hi album')
			auth.checkNetwork(state,(verified)=>{
				if (verified){
					setStatus({isLoading:false})
				} else {
					Snackbar.show({
						text: 'Wifi only!!',
						textColor:'#F6C570',
						backgroundColor:'#303960',
						duration:Snackbar.LENGTH_LONG,
						action:{
							text:'Go Fix',
							textColor:'#F6C570'
						}
					})
				}
			})
		})

	}, [])
	//go to albumphoto
	function showAlbum(item) {
		props.navigation.navigate('AlbumDetails', {
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
		let slicedAlbum = [...status.fastSource]
		var result = slicedAlbum.findIndex((v, i) => {
			return v.albumId === status.toDel
		})
		slicedAlbum.splice(result, 1)
		setStatus({ fastSource: slicedAlbum, toDel: null, aModal: false })
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
						<Modal useNativeDriver={true} animationDuration={300} backButtonClose={true} isOpen={status.aModal} onClosed={() => setStatus({ aModal: false })} style={styles.modal4} position={'center'}>
							<View style={styles.modal}>
								<View style={styles.AlbumText}>
									<Text h1 style={{ fontSize: 22, color: '#303960' }}>Delete Album</Text>
								</View>
								<View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end' }}>
									<View>
										<Button
											title="Dismiss"
											type="outline"
											titleStyle={styles.modalBtnTitle}
											onPress={() => setStatus({ aModal: false })}
											buttonStyle={styles.modalBtnStyle}
										/>
									</View>
									<View>
										<Button
											title="Delete"
											type="outline"
											titleStyle={styles.modalBtnTitle}
											onPress={() => deleteAlbum()}
											buttonStyle={styles.modalBtnStyle}
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
											onLongPress={() => setStatus({ aModal: true, toDel: item.albumId })}
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
		</View>
	)
}

const styles = StyleSheet.create({
	image: {
		height: 125,
		width: 150,
		borderRadius: 20,
		overflow: 'hidden',
		marginLeft: 23,
		marginTop: 30
	},

	container: {
		height: '100%',
		width: '100%'
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