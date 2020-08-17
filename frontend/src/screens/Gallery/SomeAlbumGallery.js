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
	Image
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
		dataSource: [],
		aModal: false,
		tag: [],
		albumName: ''
	})
	const [visible, setVisible] = React.useState(false)

    const showModal = () => setVisible(true)

    const hideModal = () => setVisible(false)
	


	//get photo
	async function fetchAlbums(){
		const response = await fetch(`http://${ipv4}:3000/album/tag?_id=5f380ee0789056bccfab23ed`,{
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'X-Requested-With': "com.rnexparea",
				//'Authorization': 'Bearer 5f380ee0789056bccfab23ed'
			
		},
		})

	// .catch((error) => {
	//    console.error(error);
	// });
	 var data = await response.json()
	 var album_tag = data['album_tag'][0]
	
	//  var _idArray = data['_idArray']
	// console.log(JSON.stringify(data))
	// console.log(typeof(response))
	 //response = await response.json()
	//var data = JSON.stringify()
	console.log(data)
	console.log(album_tag)
	// console.log(_idArray)
	 //console.log(album_object)
	// console.log(albumName)
	console.log(typeof(data))
	let dSource = []
	//var item = res.data
	//dSource.push(data)
	//await setStatus({ dataSource: dSource })

	 //this.setState({dataSource: data.data})
	

	 //console.log(data1)
	

	// var _id = await response.json()
	// var albumName = await response.json()
	// var albumPhoto = await response.json()
	// var albumTag = await response.json()
	//albumPhot albumTag albumName 

			
	//this.setState({dataSource:    })
	
	// set state to show image
 }
	
	React.useEffect(() => {
		fetchAlbums()
		//editAlbumName()
		console.log('hello photo')
	}, [])

	function showPhoto(item) {
		navigation.navigate('SomeGallery',{
			// albumId:string, photoIds:[], albumtitle:string, 
			// albumId: status._id,
			// photoIds: [] ,
			//albumTitle: status.AlbumName
			
		})
	}

	//console.log(state.newAlbumName)
    // async function editAlbumName(){
	// 	let albumName = status.newAlbumName
	// 	let _id = status._id
	// 	const response = await fetch(`http://${ipv4}:3000/album?_id=5f380ee0789056bccfab23ed&albunName=album1`,{
	// 		method: 'PUT',
	// 		headers: {
	// 			'Content-Type': 'application/json',
	// 			'X-Requested-With': "com.rnexparea"
	// 		},
	// 		body: JSON.stringify ({
	// 			_id: status._id,
	// 			albumName: status.newAlbumName
	// 		}),
	// 	})

	// 	console.log(albumName)
	// 	console.log(_id)
	// 	//this.setState({albumName: this.state.albumName})
	// 	setVisible(false)
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

return(
	<View style={styles.container}>

            {/* 這邊開始 */}
			<Text></Text>
		
		<Overlay visible={visible} onBackdropPress={hideModal} overlayStyle={styles.overlayStyle}>
					<View style={{ flex: 1 }}>
                		<View style={styles.AlbumText}>
                    		<Text h1 style={{ fontSize: 25, color: '#000000' }}>編輯相簿名稱</Text>
                		</View>
                		<View style={styles.AlbumTitle}>
                    		<Input label='Album Name' labelStyle={{ color: '#000000' }} onChangeText={value => setStatus({ newAlbumName: value })} value={status.newAlbumName?status.newAlbumName:''} inputContainerStyle={{ borderBottomColor: '#000000' }} />
               	 		</View>
						<View style={{ paddingTop: 10, paddingBottom: 10, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end' }}>
                    		<View>
                        		<Button
                            		title="Dismiss"
                           	 		type="outline"
                           	 		titleStyle={{ color: 'black' }}
                            		onPress={hideModal}
                            		buttonStyle={{ borderColor: 'black', width: 100 }}
                        		/>
                    		</View>
                    		<View>
                        		<Button
                            		title="submit"
                           			type="outline"
                            		titleStyle={{ color: 'black' }}
									onPress={() => editAlbumName()}
                            		buttonStyle={{ borderColor: 'black', width: 100 }}
                        		/>
                    		</View>
                		</View>
					</View>
           
		</Overlay>
            <View >
                <TouchableOpacity style={styles.albumName} activeOpacity={0.2} focusedOpacity={0.5} onPress={showModal} >
					<Text style={{fontSize: 20}}>Press</Text>
                    {/*<Ionicons name='heart-outline' color={'red'} size={50} />*/}
                </TouchableOpacity>
            </View>
	

	

	
	
		<FlatList
			data={status.dataSource}
			renderItem={({ item }) => (
				<View style={{ flex: 1, flexDirection: 'column', margin: 1 }}>
					<TouchableOpacity
			  			key={item._id}
			  			style={{ flex: 1 }}
			  			onPress={() => showPhoto(item)}
					/>

					<FastImage
						style={styles.imagephoto}
						source={{
							uri: item.photoId, //{this.state.photo}
							headers: item.headers
						}}
					/>

				</View>
			)}
		
	
			//Setting the number of column
		numColumns={3}
		keyExtractor={(item, index) => index.toString()}
		/>
	</View>
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
        // height: screenHeight * 0.1,
        // width: screenWidth * 0.8,
        position: 'relative',
        bottom: 40,
        height: 250,
        width: 313,
        marginLeft: 3,
        // margin: 0,
        padding: 0,
		marginBottom: 20,
		backgroundColor:'white',
		borderRadius:30
	},
	Save: {
		paddingRight: 5,
		fontSize: 17,
		color: '#63CCC8',
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
    AlbumText: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 10,
        // borderColor: 'black',
        // borderWidth: 1
	},
	albumName: {
		alignItems: 'center',
	}
})
