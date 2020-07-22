import * as React from 'react'
import { TouchableOpacity, View, Text, Image, TextInput, StyleSheet, ScrollView } from 'react-native'
import { GiftedChat, Avatar, Bubble, SystemMessage, Message, MessageText } from 'react-native-gifted-chat'
import { renderBubble } from './ChatContainer'

export default class HomeScreen extends React.Component {
	state = {
		text: '',
	};
	render() {
		return (
			<View style={{ backgroundColor: 'white' }}>
				<View style={styles.menuView}>
					<TouchableOpacity activeOpacity={0.2} focusedOpacity={0.5} style={{ width: '50%' }}>
						<View style={styles.photoBtn}>
							<Image
								source={require('../../pic/photo.png')} />
						</View>
					</TouchableOpacity>
					<TouchableOpacity activeOpacity={0.2} focusedOpacity={0.5} style={{ width: '50%' }}>
						<View style={styles.personBtn}>
							<Image
								source={require('../../pic/person.png')} />
						</View>
					</TouchableOpacity>
				</View>
				<View
					style={styles.botView}>
					<ScrollView
						contentInsetAdjustmentBehavior="automatic"
						style={styles.bot} >
						<GiftedChat>
							messages={this.state.messages}
                            onSend={messages => this.onSend(messages)}
                            user={{
								_id: 1,
							}}
                            renderBubble={renderBubble}
						</GiftedChat>
					</ScrollView>

					<View
						style={styles.inputView}>
						<TextInput
							style={styles.input}
							value={this.state.text}
							onChangeText={text => this.setState({ text })}
						/>
						<TouchableOpacity onPress={this.send} activeOpacity={0.2} focusedOpacity={0.5}>
							<View style={styles.sendBtn}>
								<Image
									source={require('../../pic/send.png')} />
							</View>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		)
	}
	send = async () => {
		console.log(this.state.text)

	}
}

const styles = StyleSheet.create({
	menuView: {
		height: '10%',
		backgroundColor: 'white',
		alignSelf: 'center',
		width: '100%',
		textAlign: 'center',
		elevation: 0,
		flexDirection: 'row',
		alignItems: 'stretch',
	},
	photoBtn: {
		alignSelf: 'flex-start',
		marginTop: 18,
		marginBottom: 5,
		marginLeft: 15,
	},
	personBtn: {
		alignSelf: 'flex-end',
		marginTop: 15,
		marginBottom: 5,
		marginRight: 20,
	},
	botView: {
		height: '90%',
		backgroundColor: 'grey',
		alignSelf: 'center',
		width: '100%',
		textAlign: 'center',
		borderTopLeftRadius: 50,
		borderTopRightRadius: 50,
		elevation: 10,
	},
	bot: {
		height: '86%',
		backgroundColor: 'white',
		alignSelf: 'center',
		width: '100%',
		textAlign: 'center',
		borderTopLeftRadius: 50,
		borderTopRightRadius: 50,
	},
	inputView: {
		height: '14%',
		backgroundColor: 'white',
		alignSelf: 'center',
		width: '100%',
		textAlign: 'center',
		padding: 5,
		flexDirection: 'row',
		alignItems: 'stretch',
	},
	input: {
		height: 50,
		backgroundColor: 'white',
		alignSelf: 'auto',
		width: '85%',
		textAlign: 'left',
		borderRadius: 50,
		marginTop: 5,
		marginBottom: 5,
		marginLeft: 5,
		marginRight: 0,
		padding: 7,
		elevation: 3,
	},
	sendBtn: {
		marginTop: 7,
		marginBottom: 5,
		marginLeft: 0,
		marginRight: 5,
	},
})
