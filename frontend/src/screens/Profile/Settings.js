import * as React from 'react'
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity
} from 'react-native'
import { AuthContext } from '../../contexts/AuthContext'
import { Picker } from '@react-native-picker/picker'
import ToggleSwitch from 'toggle-switch-react-native'


export function SettingsSreeen() {
	const { auth, state } = React.useContext(AuthContext)
	return (
		<View style={styles.main}>
			<View style={{alignItems:'center', marginBottom:20}}>
				<Text>
					Currently Logined as:
				</Text>
				<Text style={{color:'#FF6130'}}>
					{state.user.email}
				</Text>
				<TouchableOpacity style={styles.Btn} onPress={() => { auth.signOut() }}>
					<Text>Logout</Text>
				</TouchableOpacity>
			</View>
			<View style={{alignItems:'center', marginBottom:20, marginTop:40}}>
				<Text>
					Language Preference
				</Text>
				<Picker
					selectedValue={state.language}
					style={{height: 50, width: 180}}
					onValueChange={(itemValue, itemIndex) =>
						console.log(itemValue, itemIndex)
					}
					prompt='Please Select Language'
				>
					<Picker.Item label="Traditional Chinese" value="zh-tw" />
					<Picker.Item label="English" value="en" />
				</Picker>
			</View>
			<View style={{alignItems:'center', marginBottom:20, marginTop:40}}>
				<Text style={{marginBottom:20}}>
					Load Data Through:
				</Text>
				<ToggleSwitch
					isOn={state.useWifi}
					onColor="green"
					offColor="grey"
					label="Wifi only"
					labelStyle={{ color: 'black', fontWeight: '900' }}
					size="large"
					onToggle={isOn => auth.changeWifi(isOn)}
				/>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	main:{
		flex:1,
		justifyContent:'center',
		alignItems:'center'
	},
	Btn: {
		height: 35,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		marginTop:15,
		width: 180,
		borderRadius: 30,
		backgroundColor: 'white',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 0,
		},
		shadowRadius: 5.46,
		elevation: 7,
	},
})

