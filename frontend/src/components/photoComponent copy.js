import * as React from 'react'
import {
	View,
	StyleSheet,
	Dimensions,
	TouchableOpacity,
} from 'react-native'
import { ListItem } from 'react-native-elements'
import ActionButton from 'react-native-action-button'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { SwipeListView } from 'react-native-swipe-list-view'


export function TagList([status, setStatus]) {
	function deleteTag(id) {
		console.log(`deleting tag id:${id}`)
		let slicedTag = [...status.tag]
		var result = slicedTag.findIndex((v, i) => {
			return v.key === id
		})
		slicedTag.splice(result, 1)
		// dispatch(action(actionType.SET.TAG, slicedTag))
		setStatus({ tag: slicedTag })
	}
	return (
		<SwipeListView
			data={status.tag}
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
				<TouchableOpacity onPress={() => deleteTag(data.item.key)}>
					<ListItem
						key={data.item.key}
						rightElement={
							<Ionicons name='trash-outline' size={30} />
						}
						containerStyle={{ backgroundColor: 'pink' }}
					/>
				</TouchableOpacity>
			)}
			disableRightSwipe
			rightOpenValue={-65}
			useNativeDriver={true}
		/>
	)
}


export function photoFooter([status, setStatus], currentIndex) {

	function fetchTags(currentIndex) {
		console.log(currentIndex)
		setStatus({
			tag: Array(20).fill('').map((_, i) => ({ key: `${20 - i - 1}`, text: `item #${i}` })),
			isTagModalVisi: true
		})
	}

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
					buttonColor='#63CCC8'
					title="New Tag"
					spaceBetween={5}
					onPress={() => fetchTags(currentIndex)}
				>
					<Ionicons name="pricetags-outline" style={styles.actionButtonIcon} />
				</ActionButton.Item>
				{/* <ActionButton.Item
					buttonColor='#63CCC8'
					title="Description"
					spaceBetween={5}
					// onPress={()=>{that.setState({isTagModalVisi:true, tag:Array(20).fill('').map((_, i) => ({ key: `${20 - i - 1}`, text: `item #${i}` }))})}}
				>
					<Ionicons name="clipboard-outline" style={styles.actionButtonIcon} />
				</ActionButton.Item> */}
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