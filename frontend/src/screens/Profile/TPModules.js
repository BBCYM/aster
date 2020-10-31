import * as React from 'react'
import {
	View,
	Text,
	StyleSheet,
} from 'react-native'
import {Card, Button} from 'react-native-elements'
import Ionicons from 'react-native-vector-icons/Ionicons'
export function TPModuleSreeen() {
	return (
		<View style={styles.main}>
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
				<Button
					title="Update"
					type="outline"
					raised
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
				<Button
					title="Update"
					type="outline"
					raised
				/>
			</Card>
		</View>
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
		marginBottom:20
	}
})

