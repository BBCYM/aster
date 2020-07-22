/*This is an Example of Grid Image Gallery in React Native*/
import React, { Component } from 'react'
import { ButtonGroup } from 'react-native-elements'
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	FlatList,
	Modal,
	Image
} from 'react-native'
import FastImage from 'react-native-fast-image'

export default class App extends Component {
	constructor(props) {
		super(props)
		this.state = {
			imageuri: '',
			ModalVisibleStatus: false,
			selectedIndex: 2,
			data: [{ image: '' }]
		}
		this.updateIndex = this.updateIndex.bind(this)
	}

	ShowModalFunction(visible, imageURL) {
		//handler to handle the click on image of Grid
		//and close button on modal
		this.setState({
			ModalVisibleStatus: visible,
			imageuri: imageURL,

		})
	}

	updateIndex(selectedIndex) {
		this.setState({ selectedIndex })
	}

	componentDidMount() {
		var that = this
		let items = Array.apply(null, Array(120)).map((v, i) => {
			return { id: i, image: '' + (i + 1) }
		})
		that.setState({
			dataSource: items,
		})
	}

	render() {
		const buttons = ['Album', 'Photo']
		const { selectedIndex } = this.state

		if (this.state.ModalVisibleStatus) {
			return (
				<Modal
					transparent={false}
					animationType={'fade'}
					visible={this.state.ModalVisibleStatus}
					onRequestClose={() => {
						this.ShowModalFunction(!this.state.ModalVisibleStatus, '')
					}}>
					<View style={styles.modelStyle}>
						<FastImage
							style={styles.fullImageStyle}
							source={{ uri: this.state.image }}
							resizeMode={FastImage.resizeMode.contain}
						/>
						{/* 單張照片的叉叉按鈕 */}
						<TouchableOpacity
							activeOpacity={0.5}
							style={styles.closeButtonStyle}
							onPress={() => {
								this.ShowModalFunction(!this.state.ModalVisibleStatus, '')
							}}>
							<FastImage
								source={{
									uri:
										'https://raw.githubusercontent.com/AboutReact/sampleresource/master/close.png',
								}}
								style={{ width: 35, height: 35, marginTop: 16 }}
							/>
						</TouchableOpacity>
					</View>
				</Modal>
			)
		} else {
			return (
				// 頁面最上層文字(未設)
				<View style={styles.container}>
					<Text
						style={{
							fontSize: 20,
						}}>
					</Text>

					<FlatList
						data={this.state.dataSource}
						renderItem={({ item }) => (
							<View style={{ flex: 1, flexDirection: 'column', margin: 1 }}>
								<TouchableOpacity
									key={item.id}
									style={{ flex: 1 }}
									onPress={() => {
										this.ShowModalFunction(true, item.image)
									}}>
									<FastImage
										style={styles.image}
										source={{
											uri: this.state.image,
										}}
									/>
								</TouchableOpacity>
							</View>
						)}
						//Setting the number of column
						numColumns={3}
						keyExtractor={(item, index) => index.toString()}
					/>
					<View style={styles.container1}>
						<ButtonGroup
							onPress={this._ping}
							selectedIndex={selectedIndex}
							buttons={buttons}
							containerStyle={{ height: 40, borderRadius: 50, marginLeft: 70, marginRight: 70 }}
							buttonContainerStyle={{ opacity: 0.5 }}
							style={styles.buttongroup}
						/>
					</View>
				</View>
			)
		}

	}
	_ping = async () => {
		// await 必須寫在async函式裡，await makes JavaScript wait until that promise settles and returns its result.
		// 這邊用法是等fetch的伺服器回應我們後才讓結果等於response
		// 可以把fetch看成是ajax，真的很像
		const response = await fetch('http://192.168.43.95:3000/cai', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'X-Requested-With': 'com.rnexparea'
			},



		})
		// dj back to rn，用到response，一樣先await
		var data = await response.json()
		//var data = JSON.parse(data)
		//var name = JSON.parse(data)

		console.log(data)



		this.setState({ name: data.name })
		this.setState({ image: data.image })


	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: 30,
	},
	image: {
		height: 120,
		width: '100%',
	},
	fullImageStyle: {
		justifyContent: 'center',
		alignItems: 'center',
		height: '100%',
		width: '98%',
		resizeMode: 'contain',
	},
	modelStyle: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'black',
	},
	closeButtonStyle: {
		width: 25,
		height: 25,
		top: 9,
		right: 9,
		position: 'absolute',
	},
	container1: {


	}
})





