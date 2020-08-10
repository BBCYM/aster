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

	async function fetchAlbums(){
		const response = await fetch(`http://${ipv4}:3000/album`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'X-Requested-With': "com.rnexparea"
			},
			// body:  JSON.stringify({
			// 		userId:'5'
			// 	})
			
		})
		var data = await response.json()
		//var data = JSON.parse(data)
		console.log(data)

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
	
	
	return (
		<TouchableOpacity onPress={fetchAlbums}>
			<Text>Press</Text>
		</TouchableOpacity>
	)

}