import * as React from 'react'
import { Text, View } from 'react-native'
import { AuthContext } from '../../contexts/AuthContext'


export function HomeScreen(props) {
    // const {state} = React.useContext(AuthContext)
    let change = ()=>{
        props.navigation.replace('xxx')
    }
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Home Screen</Text>
        </View>
    )
}