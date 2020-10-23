import * as React from 'react'
import { View, StyleSheet, Image } from 'react-native'
import { AuthContext } from '../../contexts/AuthContext'
export function SplashScreen(props) {
	const { auth } = React.useContext(AuthContext)
	React.useEffect(() => {
		auth.configure(() => {
			auth.checkUser()
		})
	})
	return (
		<View style={styles.main}>
			<Image source={require('../../pic/blacklogo.png')} style={styles.logo}></Image>
		</View>
	)
}
const styles = StyleSheet.create({
	main: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'column',
	},
	text: {
		fontSize: 70,
		color: '#303960',
		lineHeight: 68,
	},
	back: {
		flex: 1,
		resizeMode: 'cover',
		justifyContent: 'center'
	},
	logo: {
		height: 150,
		width: 150
	},
})