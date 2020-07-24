import React from 'react'
import { View, Text } from 'react-native'
import { Avatar, Bubble, Message, MessageText } from 'react-native-gifted-chat'

export const renderBubble = props => (
	<Bubble
		{...props}
		textStyle={{
			left: {
				color: '#fff',
				fontFamily: 'CerebriSans-Book',
			},
			right: {
				color: '#fff',
				fontFamily: 'CerebriSans-Book',
			},
		}}
		wrapperStyle={{
			left: {
				backgroundColor: '#303960',
				borderTopLeftRadius: 15,
				borderTopRightRadius: 15,
				borderBottomLeftRadius: 3,
				borderBottomRightRadius: 15,
			},
			right: {
				backgroundColor: '#63CCC8',
				borderTopLeftRadius: 15,
				borderTopRightRadius: 15,
				borderBottomLeftRadius: 15,
				borderBottomRightRadius: 3,
			},
		}}
	/>
)
