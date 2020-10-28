import * as React from 'react'
import { AuthContext } from '../../contexts/AuthContext'
import { StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import ToggleSwitch from 'toggle-switch-react-native'
// import Ionicons from 'react-native-vector-icons/Ionicons'





export default function personalScreen(props) {
	const { auth, state } = React.useContext(AuthContext)


	React.useEffect(() => {
		// auth.checkNetwork(state, function(canload){
		// 	console.log(canload)
		// })
		console.log('init_isSync:', state.isSync)
		console.log('init_isFreshing:', state.isFreshing)
		// console.log('userId:', state.user.id)

		if (state.isFreshing) {
			auth.checkisFreshing((isFreshing, isSync) => {
				console.log('check_isSync:', isSync)
				console.log('check_isFreshing:', isFreshing)
			})
		}


		// GET isSync isFreshing status first
		// var status = auth.checkisFreshing()
		// console.log(status)

	}, [state.isFreshing])


	return (
		<View style={{flex:1, flexDirection:'column'}}>
			<View>
				<Image style={styles.avatar} source={{ uri: `${state.user.photo}` }} />
			</View>
			<View style={styles.body}>
				<Text style={styles.name}>{state.user.name}</Text>

				<View style={styles.Btncontainer}>
					<TouchableOpacity style={styles.Btn} disabled={state.isFreshing} onPress={() => { auth.refresh() }}>
						<Text>Refresh</Text>
					</TouchableOpacity>
					
					<TouchableOpacity style={styles.Btn} onPress={() => { console.log('Third party') }}>
						<Text>Third Party Module</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.Btn} onPress={() => { auth.signOut() }}>
						<Text>Logout</Text>
					</TouchableOpacity>
					
				</View>
				<View>
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
				{/* refresh loading animation */}
				<View style={[styles.container, { opacity: state.isFreshing ? 100 : 0 }]}>

					<ActivityIndicator style={styles.loding} size="large" color="#FF6130" />
					<Text style={styles.textREFRESH}>REFRESHING</Text>

				</View>
			</View>
		</View>


	)

}

const styles = StyleSheet.create({

	avatar: {
		width: 130,
		height: 130,
		borderRadius: 63,
		borderWidth: 4,
		alignSelf: 'center',
		marginTop: 20,
		borderColor:'#303960'
	},
	body:{
		flex: 1,
		alignItems: 'center',

	},
	name: {
		marginTop: 25,
		marginBottom:25,
		fontSize: 30,
		fontWeight: '600',
		color:'#303960'
	},
	description: {
		fontSize: 16,
		color: '#696969',
		marginTop: 20,
		textAlign: 'center'

	},
	Btn: {
		height: 35,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 30,
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
	heartBtn: {
		marginTop: 100,
		width: 50,
		height: 50,

		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 0,
		},
		shadowRadius: 5.46,
	},
	container: {
		marginTop: 170,
		justifyContent: 'center'
	},
	textREFRESH: {
		justifyContent: 'center',
		textAlign: 'center',
		color: '#FF6130',
		fontSize: 15,
		marginTop: 30,
	}
})
