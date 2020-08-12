// // for cai
import * as React from 'react'
import {
	StyleSheet,
	View,
	FlatList,
	Modal,
	TouchableOpacity,
	Dimensions,
	Text,
} from 'react-native'
import ActionButton from 'react-native-action-button';
import { Input, ListItem, Button } from 'react-native-elements'
import { Overlay, SearchBar } from 'react-native-elements'
import FastImage from 'react-native-fast-image'
import ImageViewer from 'react-native-image-zoom-viewer'
//import { photoFooter, TagList } from '../../components/photoComponent copy'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Axios from 'axios'
import { AuthContext } from '../../contexts/AuthContext'
import { ipv4 } from '../../utils/dev'

export default function SomeAlbumGalleryScreen(props) {
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
		
		tag: []
	})
	
	
	
	//get photo
	async function fetchAlbums(){
		const response = await fetch(`http://${ipv4}:3000/album`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'X-Requested-With': "com.rnexparea"
			},
		})
		var data = await response.json()
		print(data)

		// var albumId = await response.json()
		// var albumName = await response.json()
		// var albumPhoto = await response.json()
		// var albumTag = await response.json()
		//albumPhot albumTag albumName 
		//var data = JSON.parse(data)
		//console.log(data)
		
		//this.setState({dataSource:    })
		
		// set state to show image
	}
	
	React.useEffect(() => {
		 fetchAlbums()
		console.log('hello photo')
	}, [])

	function showPhoto(item) {
		navigation.navigate('SomeGallery',{
			// albumId:string, photoIds:[], albumtitle:string, 
			// albumId: this.state.id,
			// photoIds: [] ,
			
		})
	}
    //edit albumName
	// editAlbumName = (albumName) => {
	// 	// async function putAlbum(){
	// 	// 	const response = await fetch(`http://${ipv4}:3000/album` , {
	// 	// 		method: 'PUT',
	// 	// 		hesders: {
	// 	// 		   'Content-Type': 'application/json',
	// 	// 		   'X-Requested-With': "com.rnexparea"
	// 	// 	   },
	// 	// 	   body: {
	// 	// 		 albumId: this.state.albumId,
	// 	// 		 albumName: this.state.albumName
	// 	// 	   }
				   
	// 	//    })
	// 	// }
	// }
	
// async function deletePhoto(){
// 	var r=alert('Deleted?')
// 	if(r=true){
// 		const response = await fetch(`http://${ipv4}:3000/album/photo` , {
// 			method: 'DELETE',
// 			hesders: {
// 				'Content-Type': 'application/json',
// 				'X-Requested-With': "com.rnexparea"
// 			},
// 	        body: {
			  
// 			}
// 		})
// 	}
// }
	
function editAlbumName() {
	const imgIDRes = status.fastSource.map((v,i)=>{return v.imgId})
	let albumName = status.newAlbumName
	let albumId = status.albumId

	console.log(albumName)
	console.log(albumId)
	// try{
	//     let albumName = status.aName
	//     let userId = state.user.id
	//     let coverPhotoId = _.sample(imgIDRes)
	//     let albumPhoto = imgIDRes
	//     let albumTag = status.doubleCheese.map((v,i)=>{return v.text})
	// }catch(err){
	//     console.log(err)
	// }
	Axios.put(`http://${ipv4}:3000/album`, JSON.stringify({
		albumId: albumId,
		albumName: albumName,
		
	}), {
		headers: {
			'Content-Type': 'application/json'
		}
	}).then((res) => {
		console.log(res.data)
		//props.navigation.navigate('Home')
	}).catch((err) => {
		console.error(err)
	})
}

return(
	<TouchableOpacity onPress={}>
		<Text>Press</Text>
            	<View style={styles.modal}>
                	<View style={styles.AlbumText}>
                    	<Text h1 style={{ fontSize: 25, color: '#ffffff' }}>編輯相簿名稱</Text>
                	</View>
                	<View style={styles.AlbumTitle}>
                    	<Input label='Album Name' labelStyle={{ color: '#ffffff' }} onChangeText={value => setStatus({ newAlbumName: value })} value={status.newAlbumName?status.newAlbumName:''} inputContainerStyle={{ borderBottomColor: '#ffffff' }} />
               	 	</View>
					<View style={{ paddingTop: 10, paddingBottom: 10, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end' }}>
                    	<View>
                        	<Button
                            	title="Dismiss"
                           	 	type="outline"
                           	 	titleStyle={{ color: 'white' }}
                            	onPress={() => setStatus({ aModal: false })}
                            	buttonStyle={{ borderColor: 'white', width: 100 }}
                        	/>
                    	</View>
                    	<View>
                        	<Button
                            	title="submit"
                           		type="outline"
                            	titleStyle={{ color: 'white' }}
                            	onPress={() => editAlbumName()}
                            	buttonStyle={{ borderColor: 'white', width: 100 }}
                        	/>
                    	</View>
                	</View>
				</View>
  </TouchableOpacity>


	// 	transparent={false}
	// 	nimationType={'fade'}
	// 	visible={status.isVisible}
	// 	onRequestClose={() => { setStatus({ isVisible: false, isTagModalVisi: false }) }}
	// >
	// <View style={styles.container}>
	// 	<TouchableOpacity style={styles.title}
	// 		//style={{//fontSize: 20,
	// 		//color: 'black',
	// 		//backgroundColor: 'white',}}
	// 		onLongPress={() => editAlbumName(albumName)}
	// 	>
	// 		<Text style={{fontSize:20,color:'black'}}>{this.state.albumName}</Text>
	// 	</TouchableOpacity>
	// </View>
	// <FlatList
	// 	data={this.state.dataSource}
	// 	renderItem={({ item }) => (
	// 		<View style={{ flex: 1, flexDirection: 'column', margin: 1 }}>
	// 			<TouchableOpacity
	// 		  		key={item.id}
	// 		  		style={{ flex: 1 }}
	// 		  		onPress={() => showPhoto(item)}
	// 		  		onLongPress={() => deletePhoto()}
	// 			/>

	// 			<FastImage
	// 				style={styles.imagephoto}
	// 				source={{
	// 					uri: item.src, //{this.state.photo}
	// 				}}
	// 			/>

	// 		</View>
	// 	)}
	// 		//Setting the number of column
	// 	numColumns={3}
	// 	keyExtractor={(item, index) => index.toString()}
	// />
	// </Modal>
)
}
export function OneClickAction([status, setStatus]) {
    return (
        <ActionButton
            buttonColor="#FF6130"
            position='right'
            offsetX={10}
            offsetY={10}
            fixNativeFeedbackRadius={true}
            renderIcon={() => (
                <Ionicons name="albums-outline" style={styles.actionButtonIcon} />
            )}
            onPress={() => {
                let c = [...status.preBuildTag]
                setStatus({ aModal: true, doubleCheese: c })
            }}
        />
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
