import * as React from 'react'
import {
	View,
	StyleSheet,
	// Dimensions,
	TouchableOpacity,
} from 'react-native'
import { ListItem } from 'react-native-elements'
// import SlidingUpPanel from 'rn-sliding-up-panel';
import ActionButton from 'react-native-action-button'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { SwipeListView } from 'react-native-swipe-list-view'
// import { Footer, FooterTab, Button, Container } from 'native-base'
// import {SearchBar} from 'react-native-elements'
// const screenWidth = Math.round(Dimensions.get('window').width)
// const screenHeight = Math.round(Dimensions.get('window').height)

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


export function photoFooter(that, [status, setStatus], currentIndex) {

	async function fetchTags(currentIndex) {
		console.log(currentIndex)
		setStatus({
			tag: Array(20).fill('').map((_, i) => ({ key: `${20 - i - 1}`, text: `item: ${currentIndex} #${i}` })),
		})
	}
	async function fetchEmotion(currentIndex){

	}
	// console.log(screenHeight)
	return (
		<View style={styles.root}>
			<ActionButton
				buttonColor="rgba(231,76,60,1)"
				position='right'
				offsetX={10}
				offsetY={10}
				fixNativeFeedbackRadius={true}
				spacing={10}
				onPress={()=>fetchTags(currentIndex)}
			>
				<ActionButton.Item
					buttonColor='#F5B19C'
					title="Emotion"
					spaceBetween={8}
					onPress={() => setStatus({isEmotionModalVisi: true})}
				>
					<Ionicons name="happy-outline" style={styles.actionButtonIcon} />
				</ActionButton.Item>
				<ActionButton.Item
					buttonColor='#63CCC8'
					title="New Tag"
					spaceBetween={8}
					onPress={() => setStatus({isTagModalVisi: true})}
				>
					<Ionicons name="pricetags-outline" style={styles.actionButtonIcon} />
				</ActionButton.Item>
			</ActionButton>
		</View>
	)
}

const styles = StyleSheet.create({
	root: {
		flex: 1,
		flexDirection:'row',
		alignItems: 'center',
		justifyContent:'center'	
	},
	actionButtonIcon: {
		fontSize: 25,
		height: 25,
		color: '#303960',
	}
})