import * as React from 'react'
import {
	View,
	Text,
	StyleSheet,
	ScrollView
} from 'react-native'
import { AuthContext } from '../../contexts/AuthContext'
import {Card, Button} from 'react-native-elements'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Picker } from '@react-native-picker/picker'
import ToggleSwitch from 'toggle-switch-react-native'
import axios from 'axios'

export function TPModuleSreeen() {
	const { auth, state } = React.useContext(AuthContext)
	const [status, setStatus] = useMergeState({
		colorOnto:false,
		peopleOnto:false,
	})
	function useMergeState(initialState) {
		const [state, setState] = React.useState(initialState)
		const setStatus = newState =>
			setState(prevState => Object.assign({}, prevState, newState))
		return [state, setStatus]
	}
	async function getOntoState(){
		let res = await axios.get(`${auth.url}/ontology/${state.user.id}/color`, {
			headers: auth.headers
		})
		let res2 = await axios.get(`${auth.url}/ontology/${state.user.id}/people`, {
			headers: auth.headers
		})
		setStatus({colorOnto:res.data,peopleOnto:res2.data})
	}
	async function setColorState(isOn){
		let res = await axios.post(`${auth.url}/ontology/${state.user.id}/color`, JSON.stringify({
			subscribe: isOn,
		}), {
			headers: auth.headers
		})
		setStatus({colorOnto:res.data})
	}
	async function setPeopleState(isOn){
		let res = await axios.post(`${auth.url}/ontology/${state.user.id}/people`, JSON.stringify({
			subscribe: isOn,
		}), {
			headers: auth.headers
		})
		setStatus({peopleOnto:res.data})
	}
	React.useEffect(()=>{
		getOntoState()
	},[])
	return (
		// style={styles.main}
		<ScrollView>
			<Card>
				<Card.Title>Location Module</Card.Title>
				<Card.Divider/>
				<View style={styles.cardBody}>
					<View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
						<Ionicons name='locate-sharp' size={40} color={'#63CCC8'}/>
					</View>
					<View style={{flex:5, marginLeft:10}}>
						<Text style={styles.moduleDetails}>
							This module adds location information to your photos.
						</Text>
					</View>
				</View>
				<Picker
					selectedValue={state.dateRange}
					style={{height: 50, width: 180}}
					onValueChange={(itemValue, itemIndex) =>{
						auth.changeRange(itemValue)
					}}
					prompt='Please Select Refresh Range'
				>
					<Picker.Item label="3 days" value="3" />
					<Picker.Item label="30 days" value="30" />
					<Picker.Item label="1 year" value="365" />
					<Picker.Item label="All" value="all" />
				</Picker>
				<Button
					title="Update"
					type="outline"
					raised
					onPress={()=>{auth.updatelocation(state.dateRange)}}
				/>
			</Card>
			<Card>
				<Card.Title>Color Module</Card.Title>
				<Card.Divider/>
				<View style={styles.cardBody}>
					<View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
						<Ionicons name='color-palette-sharp' size={40} color={'#F5B19C'}/>
					</View>
					<View style={{flex:5, marginLeft:10}}>
						<Text style={styles.moduleDetails}>
							This module adds color information to your labels.
						</Text>
					</View>
				</View>
				<View style={{alignItems:'center', marginBottom:20, marginTop:20}}>
					<ToggleSwitch
						isOn={status.colorOnto}
						onColor="#40B93F"
						offColor="grey"
						label="Subscribe"
						labelStyle={{ color: 'black', fontWeight: '900' }}
						size='small'
						onToggle={(isOn) => {
							setColorState(isOn)
						}}
					/>
				</View>
			</Card>
			<Card>
				<Card.Title>People Deduction</Card.Title>
				<Card.Divider/>
				<View style={styles.cardBody}>
					<View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
						<Ionicons name='people-circle-sharp' size={40} color={'#F6C570'}/>
					</View>
					<View style={{flex:5, marginLeft:10}}>
						<Text style={styles.moduleDetails}>
							This module adds people information to your photos.
						</Text>
					</View>
				</View>
				<View style={{alignItems:'center', marginBottom:20, marginTop:20}}>
					<ToggleSwitch
						isOn={status.peopleOnto}
						onColor="#40B93F"
						offColor="grey"
						label="Subscribe"
						labelStyle={{ color: 'black', fontWeight: '900' }}
						size='small'
						onToggle={(isOn) => {
							setPeopleState(isOn)
						}}
					/>
				</View>
			</Card>
			<Card>
				<Card.Title>HELLO WORLD</Card.Title>
				<Card.Divider/>
				{/* <Card.Image source={require('../images/pic2.jpg')} /> */}
				<Text style={{marginBottom: 10}}>
					The idea with React Native Elements is more about component structure than actual design.
				</Text>
				{/* <Button
					icon={<Icon name='code' color='#ffffff' />}
					buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
					title='VIEW NOW' /> */}
			</Card>
		</ScrollView>
	)
}
const styles = StyleSheet.create({
	main:{
		flex:1,
		justifyContent:'flex-start',
		alignItems:'center'
	},
	moduleDetails:{
		fontSize:12
	},
	cardBody:{
		flexDirection:'row',
		width:300,
		justifyContent:'center',
		alignItems:'center',
		marginTop:10,
		marginBottom:5
	}
})

