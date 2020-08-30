import * as React from 'react'
import ActionButton from 'react-native-action-button';
import {
	StyleSheet,
	View,
	Text,
	TouchableOpacity
} from 'react-native'
import { Input, ListItem, Button } from 'react-native-elements'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Modal from 'react-native-modalbox'
import { SwipeListView } from 'react-native-swipe-list-view'
import Axios from 'axios'
import _ from 'lodash'
import { ipv4 } from '../utils/dev'
import { ErrorHandling } from '../utils/utils'
export function AlbumModal([status, setStatus], state, props) {
	function editAlbum() {
		let albumName = status.aName
		let albumId = status.currentAlbumId
		let newTags = _.differenceBy(status.doubleCheese, status.preBuildTag, 'text').map((v)=>{return v.text})
		let deleteTags = _.differenceBy(status.preBuildTag, status.doubleCheese, 'text').map((v)=>{return v.text})
		ErrorHandling(() => {
			if (!albumName || _.isEmpty(albumName.trim())) {
				throw Error('Need a album name')
			}
		}, () => {
			for (const nt of newTags){
				Axios.post(`http://${ipv4}:3000/album/tag`, JSON.stringify({
					_id: albumId,
					albumTag: nt,
				}), {
					headers: {
						'Content-Type': 'application/json'
					}
				})
			}
			for (const dt of deleteTags) {
				Axios.delete(`http://${ipv4}:3000/album/tag`, {
					headers: {
						'Content-Type': 'application/json'
					},
					params:{
						_id: albumId,
						albumTag: dt,
					}
				})
			}
			Axios.put(`http://${ipv4}:3000/album`, JSON.stringify({
				_id: status.currentAlbumId,
				albumName: albumName,
			}), {
				headers: {
					'Content-Type': 'application/json'
				}
			}).then((res) => {
				props.navigation.navigate('Home')
			}).catch((err) => {
				console.log(err)
			})
		})
	}
	function deleteTag(id, text) {
		console.log(`deleting tag id:${id}`)
		let slicedTag = [...status.doubleCheese]
		var result = slicedTag.findIndex((v, i) => {
			return v.key === id
		})
		slicedTag.splice(result, 1)
		setStatus({ doubleCheese: slicedTag })
	}
	function addTag(){
		let temp = [...status.doubleCheese]
		let t
		if (temp.length > 0) {
			t = Number(temp[0].key) + 1
		} else {
			t = 0
		}
		temp.unshift({ key: String(t), text: status.TagtoAdd })
		setStatus({ doubleCheese: temp, TagtoAdd: '' })
	}
	return (
		<Modal backButtonClose={true} isOpen={status.aModal} onClosed={() => setStatus({ aModal: false })} style={styles.modal4} position={"bottom"}>
			<View style={styles.modal}>
				<View style={styles.AlbumText}>
					<Text h1 style={{ fontSize: 30, color: '#ffffff' }}>編輯相簿</Text>
				</View>
				<View style={styles.AlbumTitle}>
					<Input label='Album Name' labelStyle={{ color: '#ffffff' }} onChangeText={value => setStatus({ aName: value })} value={status.aName ? status.aName : ''} inputContainerStyle={{ borderBottomColor: '#ffffff' }} />
				</View>
				<View style={styles.AlbumTitle}>
					<Input label='Add Tag' labelStyle={{ color: '#ffffff' }} onChangeText={value => setStatus({ TagtoAdd: value })} value={status.TagtoAdd} placeholder={'Enter new Tag'} onSubmitEditing={()=>addTag()} inputContainerStyle={{ borderBottomColor: '#ffffff' }} />
				</View>
				<View style={{ flex: 1 }}>
					<SwipeListView
						data={status.doubleCheese}
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

							<TouchableOpacity onPress={() => deleteTag(data.item.key, data.item.text)}>
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
				</View>
				<View style={{ paddingTop: 10, paddingBottom: 10, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end' }}>
					<View>
						<Button
							title="Dismiss"
							type="outline"
							titleStyle={{ color: 'white' }}
							onPress={() => setStatus({ aModal: false })}
							buttonStyle={{ borderColor: 'white', width: 100 }}
						/>
					</View>
					<View>
						<Button
							title="Edit"
							type="outline"
							titleStyle={{ color: 'white' }}
							onPress={() => editAlbum()}
							buttonStyle={{ borderColor: 'white', width: 100 }}
						/>
					</View>
				</View>
			</View>

		</Modal>
	)
}
export function OneClickAction([status, setStatus]) {
	return (
		<ActionButton
			buttonColor="#FF6130"
			position='right'
			offsetX={10}
			offsetY={10}
			fixNativeFeedbackRadius={true}
			renderIcon={() => (
				<Ionicons name="albums-outline" style={styles.actionButtonIcon} />
			)}
			onPress={() => {
				let c = [...status.preBuildTag]
				setStatus({ aModal: true, doubleCheese: c })
			}}
		/>
	)
}
const styles = StyleSheet.create({
	actionButtonIcon: {
		fontSize: 25,
		height: 25,
		color: '#303960',
	},
	modal4: {
		height: 600,
		backgroundColor: 'transparent'

	},
	modal: {
		flex: 1,
		alignItems: 'stretch',
		backgroundColor: '#b197fc',
		borderTopLeftRadius: 30,
		borderTopRightRadius: 30,
	},
	AlbumTitle: {
		flexDirection: 'row',
		alignItems: 'stretch',
		paddingRight: 15,
		paddingLeft: 15,
		paddingBottom: 0,
		margin: 0,
		// borderColor: 'red',
		// borderWidth: 1
	},
	AlbumText: {
		justifyContent: 'flex-start',
		alignItems: 'center',
		padding: 10,
		// borderColor: 'black',
		// borderWidth: 1
	}
})