import * as React from 'react'
import { View, Image, Text, StyleSheet } from 'react-native'
import { AuthContext } from '../../contexts/AuthContext'
import { GoogleSigninButton } from '@react-native-community/google-signin'
export function SigninScreen(props) {
	const { auth } = React.useContext(AuthContext)
	let _signIn = async () => {
		await auth.signIn()
	}
	return (
		<View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start' }}>
			<Image source={require('../../pic/blacklogo.png')} style={styles.logo}></Image>
			<View style={{ marginTop: 20, marginBottom: 30, alignItems: 'center' }}>
				<Text style={styles.word}>Recall the Past</Text>
				<Text style={styles.word}>Record Your Memory</Text>
			</View>
			<GoogleSigninButton style={{ width: 240, height: 68 }}
				size={GoogleSigninButton.Size.Wide}
				color={GoogleSigninButton.Color.Dark}
				onPress={() => { _signIn() }}
			/>
		</View>
	)

}

const styles = StyleSheet.create({
	logo: {
		height: 200,
		width: 200,
		marginTop: '30%'
	},
	word: {
		padding: 5,
		fontSize: 15
	},
	back: {
		flex: 1,
		resizeMode: 'cover',
		justifyContent: 'center'
	},
})