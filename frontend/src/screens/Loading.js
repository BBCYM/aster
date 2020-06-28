import * as React from 'react'
import { View, Text, ActivityIndicator } from 'react-native'

export default class LoadingScreen extends React.Component {
    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', padding: 10 }}>
                <ActivityIndicator size={78} color='#0000ff' />
            </View>
        )
    }
}