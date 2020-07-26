import React, { Component } from 'react'
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
import { photoFooter, TagList } from '../../components/photoComponent'
import Ionicons from 'react-native-vector-icons/Ionicons'


export default class GalleryScreen extends Component {

	constructor(props) {
		super(props)
		this.state = {
			isVisible: false,
			currentId: 0,
			isTagModalVisi: false,
			inputTag: '',
			tag: []
		}
	}


	componentDidMount() {
		let items = Array.apply(null, Array(60)).map((v, i) => {
			return { id: i, src: 'https://unsplash.it/400/400?image=' + (i + 1) }
		})
		var newArr = items.map((v, i) => {
			return { url: v.src }
		})
		this.setState({
			fastSource: items,
			modalSource: newArr
		})
	}

	changeCurrentTag = (inputTag) => {
		this.setState({ inputTag })
	}
	showImage(item) {
		// load tag of the item
		this.setState({
			currentImg: item.src,
			currentId: item.id,
			isVisible: true,
		})
	}
	addTag = () => {
		console.log(this.state.inputTag.length !== 0)
		console.log(this.state.inputTag.trim())
		if (this.state.inputTag.length !== 0 && this.state.inputTag.trim()) {
			this.setState(prevState => {
				console.log('adding tag')
				let tags = [...prevState.tag]
				let l = tags.length
				let t
				if (l > 0) {
					t = Number(tags[0].key) + 1
				} else {
					t = 0
				}
				tags.unshift({ key: String(t), text: prevState.inputTag })
				return {
					...prevState,
					tag: tags,
					inputTag: ''
				}
			})
		} else {
			this.setState({ inputTag: '' })
			this.search.clear()
		}
	}

	render() {
		return (
			<View style={{ flex: 1 }}>
				<Overlay
					isVisible={this.state.isTagModalVisi}
					onBackdropPress={() => { this.setState({ isTagModalVisi: false }) }}
					overlayStyle={styles.overlayStyle}
				>
					<View style={{ flex: 1 }} >
						<View>
							<SearchBar
								ref={search => this.search = search}
								placeholder="Add Tag"
								onChangeText={(inputTag) => { this.setState({ inputTag }) }}
								onSubmitEditing={this.addTag}
								value={this.state.inputTag}
								inputStyle={{ color: '#303960' }}
								lightTheme={true}
								searchIcon={() => <Ionicons name='pricetag-outline' size={20} color='#75828e' />}
								round={true}
								containerStyle={{ padding: 5 }}
							/>
						</View>
						{TagList(this)}
					</View>
				</Overlay>
				<Modal visible={this.state.isVisible} transparent={false} onRequestClose={() => { this.setState({ isVisible: false, isTagModalVisi: false }) }}>
					<ImageViewer
						useNativeDriver={true}
						imageUrls={this.state.modalSource}
						index={this.state.currentId}
						enablePreload={true}
						renderIndicator={() => null}
						renderFooter={(currentIndex) => photoFooter(this, currentIndex)}
						footerContainerStyle={{ bottom: 0, position: 'absolute', zIndex: 1000 }}
					/>
				</Modal>
				<FlatList
					data={this.state.fastSource}
					renderItem={({ item }) => (
						<View style={{ flex: 1, flexDirection: 'column', margin: 1 }}>
							<TouchableOpacity onPress={() => this.showImage(item)}>
								<FastImage
									style={styles.imageThumbnail}
									source={{
										uri: item.src,
										priority: FastImage.priority.high,
									}}
								/>
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
