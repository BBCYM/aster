import * as React from 'react'
import { AuthContext } from '../../contexts/AuthContext'
import { StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import { Picker } from '@react-native-picker/picker'





export default function personalScreen(props) {
	const { auth, state } = React.useContext(AuthContext)

	React.useEffect(() => {
		console.log('init_isSync:', state.isSync)
		console.log('init_isFreshing:', state.isFreshing)
		if (state.isFreshing) {
			auth.checkisFreshing((isFreshing, isSync) => {
				console.log('check_isSync:', isSync)
				console.log('check_isFreshing:', isFreshing)
			})
		}
	}, [state.isFreshing])


	return (
		<View style={{flex:1, flexDirection:'column'}}>
			<View>
				<Image style={styles.avatar} source={{ uri: `${state.user.photo}` }} />
			</View>
			<View style={styles.body}>
				<Text style={styles.name}>{state.user.name}</Text>

				<View style={styles.Btncontainer}>
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
					<TouchableOpacity style={styles.Btn} disabled={state.isFreshing} onPress={() => { auth.refresh(state.dateRange) }}>
						<Text>Refresh</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.Btn} onPress={() => { props.navigation.navigate('TPModules') }}>
						<Text>Third Party Module</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.Btn} onPress={() => { props.navigation.navigate('Settings') }}>
						<Text>Settings</Text>
					</TouchableOpacity>
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
		marginTop: 60,
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
