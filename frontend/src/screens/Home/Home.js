import * as React from 'react'
import { Text, View } from 'react-native'
import { AuthContext } from '../../contexts/AuthContext'


export function HomeScreen() {
    const {state} = React.useContext(AuthContext)
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Home Screen</Text>
            {console.log(state)}
        </View>
    )
}