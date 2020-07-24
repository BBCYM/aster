import * as React from 'react'
import {
	View,
	Text,
	StyleSheet,
	Dimensions,
	TouchableOpacity,
	TouchableHighlight
} from 'react-native'
import { SearchBar, ListItem } from 'react-native-elements'
import ActionButton from 'react-native-action-button'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view'


export function TagList(that) {
	return (
		<SwipeListView
			data={that.state.tag}
			renderItem={(data, rowMap) => (
				<View>
					<ListItem
						key={data.item.key}
						title={data.item.text}
						bottomDivider
					/>
				</View>
			)}
			renderHiddenItem={(data, rowMap) => (
				<TouchableHighlight>
					<View>
						<Ionicons name='trash-outline' />
					</View>
				</TouchableHighlight>
			)}
			leftOpenValue={75}
			rightOpenValue={-75}
		/>
	)
}


export function photoFooter(that) {
	return (
		<View style={styles.root}>
			<ActionButton
				buttonColor="rgba(231,76,60,1)"
				position='right'
				offsetX={20}
				offsetY={20}
				fixNativeFeedbackRadius={true}
				spacing={10}
			>
				<ActionButton.Item
					buttonColor='#9b59b6'
					title="New Tag"
					spaceBetween={5}
					onPress={() => { that.setState({ isTagModalVisi: true }) }}
				>
					<Ionicons name="pricetags-outline" style={styles.actionButtonIcon} />
				</ActionButton.Item>
			</ActionButton>
		</View>
	)
}
const screenWidth = Math.round(Dimensions.get('window').width)
const screenHeight = Math.round(Dimensions.get('window').height)
const styles = StyleSheet.create({
	root: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		width: screenWidth,
		height: screenHeight * 0.2,
		borderTopColor: '#FFFFFF',
		borderTopWidth: 1
	},
	actionButtonIcon: {
		fontSize: 20,
		height: 22,
		color: 'white',
	},

})