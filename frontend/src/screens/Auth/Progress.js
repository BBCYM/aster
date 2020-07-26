import * as React from 'react'
import { View, ActivityIndicator } from 'react-native'
import { AuthContext } from '../../contexts/AuthContext'

export default function Progress() {
	const { auth } = React.useContext(AuthContext)
	React.useEffect(() => {
		auth.connectBackend()
	})
	return (
		<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
			<ActivityIndicator size="large" color="#303960" />
		</View>
	)
}