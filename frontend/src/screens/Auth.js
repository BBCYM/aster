import * as React from 'react'
import { View, Text } from 'react-native';
export default class AuthScreen extends React.Component{
    render(){
        return(
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>Auth Screen</Text>
            </View>
        )
    }
}