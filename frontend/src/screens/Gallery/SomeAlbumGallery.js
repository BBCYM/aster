// for cai
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
//import { photoFooter, TagList } from '../../components/photoComponent copy'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Axios from 'axios'
import { AuthContext } from '../../contexts/AuthContext'

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
	editAlbumName = (albumName) => {
		// async function putAlbum(){
		// 	const response = await fetch(`http://${ipv4}:3000/album` , {
		// 		method: 'PUT',
		// 		hesders: {
		// 		   'Content-Type': 'application/json',
		// 		   'X-Requested-With': "com.rnexparea"
		// 	   },
		// 	   body: {
		// 		 albumId: this.state.albumId,
		// 		 albumName: this.state.albumName
		// 	   }
				   
		//    })
		// }
	}
	
async function deletePhoto(){
	var r=alert('Deleted?')
	if(r=true){
		const response = await fetch(`http://${ipv4}:3000/album/photo` , {
			method: 'DELETE',
			hesders: {
				'Content-Type': 'application/json',
				'X-Requested-With': "com.rnexparea"
			},
	        body: {
			  
			}
		})
	}
}
return(
	<Modal
		transparent={false}
		nimationType={'fade'}
		visible={status.isVisible}
		onRequestClose={() => { setStatus({ isVisible: false, isTagModalVisi: false }) }}
	>
	<View style={styles.container}>
		<TouchableOpacity style={styles.title}
			//style={{//fontSize: 20,
			//color: 'black',
			//backgroundColor: 'white',}}
			onLongPress={() => editAlbumName(albumName)}
		>
			<Text style={{fontSize:20,color:'black'}}>{this.state.albumName}</Text>
		</TouchableOpacity>
	</View>
	<FlatList
		data={this.state.dataSource}
		renderItem={({ item }) => (
			<View style={{ flex: 1, flexDirection: 'column', margin: 1 }}>
				<TouchableOpacity
			  		key={item.id}
			  		style={{ flex: 1 }}
			  		onPress={() => showPhoto(item)}
			  		onLongPress={() => deletePhoto()}
				/>

				<FastImage
					style={styles.imagephoto}
					source={{
						uri: item.src, //{this.state.photo}
					}}
				/>

			</View>
		)}
			//Setting the number of column
		numColumns={3}
		keyExtractor={(item, index) => index.toString()}
	/>
	</Modal>
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
