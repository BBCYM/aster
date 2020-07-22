
import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Animated, { interpolate } from 'react-native-reanimated'
import { Ionicons as Icon } from '@expo/vector-icons'
import { TapGestureHandler } from 'react-native-gesture-handler'
const HeaderBackArrow = ({ isOpenAnimation, gestureHandler }) => {
	const opacity = interpolate(isOpenAnimation, {
		inputRange: [0, 0.7, 1],
		outputRange: [0, 0, 1],
	})

	return (
		<TapGestureHandler {...gestureHandler}>
			<Animated.View style={{ ...styles.backArrow, opacity }}>
				<Text>back</Text>

			</Animated.View>
		</TapGestureHandler>
	)
}
export default HeaderBackArrow

const styles = StyleSheet.create({
	backArrow: {
		position: 'absolute',
		height: '10%',
		width: '100%',
		top: 0,
		// left: 25,
		zIndex: 10,
	},
})