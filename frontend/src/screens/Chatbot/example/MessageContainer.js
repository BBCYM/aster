import React from 'react'
import {View, Text} from 'react-native'
import {
	Avatar,
	Bubble,
	SystemMessage,
	Message,
	MessageText,
} from 'react-native-gifted-chat'

export const renderAvatar = props => (
	<Avatar
		{...props}
		containerStyle={{left: {borderWidth: 0, borderColor: 'white'}, right: {}}}
		imageStyle={{left: {borderWidth: 0, borderColor: 'white'}, right: {}}}
	/>
)

export const renderBubble = props => (
	<Bubble
		{...props}
		// renderTime={() => <Text>Time</Text>}
		// renderTicks={() => <Text>Ticks</Text>}
		containerStyle={{
			left: {borderColor: 'teal', borderWidth: 0},
			right: {},
		}}
		wrapperStyle={{
			left: {borderColor: 'tomato', borderWidth: 0},
			right: {},
		}}
		bottomContainerStyle={{
			left: {borderColor: 'purple', borderWidth: 0},
			right: {},
		}}
		tickStyle={{}}
		usernameStyle={{color: 'tomato', fontWeight: '100'}}
		containerToNextStyle={{
			left: {borderColor: 'navy', borderWidth: 0},
			right: {},
		}}
		containerToPreviousStyle={{
			left: {borderColor: 'mediumorchid', borderWidth: 0},
			right: {},
		}}
	/>
)

export const renderSystemMessage = props => (
	<SystemMessage
		{...props}
		containerStyle={{backgroundColor: 'white'}}
		wrapperStyle={{borderWidth: 0, borderColor: 'white'}}
		textStyle={{color: 'black', fontWeight: '500'}}
	/>
)

export const renderMessage = props => (
	<Message
		{...props}
		// renderDay={() => <Text>Date</Text>}
		containerStyle={{
			left: {backgroundColor: 'white'},
			right: {backgroundColor: 'white'},
		}}
	/>
)

export const renderMessageText = props => (
	<MessageText
		{...props}
		containerStyle={{
			left: {backgroundColor: 'white'},
			right: {backgroundColor: 'white'},
		}}
		textStyle={{
			left: {color: 'black'},
			right: {color: 'black'},
		}}
		linkStyle={
			{
				//   left: {color: 'orange'},
				//   right: {color: 'orange'},
			}
		}
		customTextStyle={{fontSize: 12, lineHeight: 20}}
	/>
)

export const renderCustomView = ({user}) => (
	<View style={{minHeight: 10, alignItems: 'center'}}>
		<Text>
      Current user:
			{user.name}
		</Text>
		<Text>From CustomView</Text>
	</View>
)
