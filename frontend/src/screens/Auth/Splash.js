import * as React from 'react'
import { View, StyleSheet, ImageBackground, Image } from 'react-native'
import { AuthContext } from '../../contexts/AuthContext'
export function SplashScreen(props) {
	const { auth } = React.useContext(AuthContext)
	React.useEffect(() => {
		auth.configure(() => {
			auth.checkUser()
		})
	})
	return (

		<ImageBackground source={require('../../pic/white.png')} style={styles.back}>
			<View style={styles.main}>
				{/* <Ionicon name='md-shapes-outline' size={100} color='#303960' />
				<Text style={styles.text}>Aster</Text> */}
				<Image source={require('../../pic/blacklogo.png')} style={styles.logo}></Image>
			</View>
		</ImageBackground>
	)
}
const styles = StyleSheet.create({
	main: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'column',
		// resizeMode: 'cover',
	},
	text: {
		fontSize: 70,
		color: '#303960',
		lineHeight:68,
	},
	back: {
		flex:1,
		resizeMode: 'cover',
		justifyContent: 'center'
	},
	logo: {
        height: 150,
        width: 150
	},
})