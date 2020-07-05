import * as React from 'react'
import {
    Text,
    TouchableWithoutFeedback,
    View,
    TouchableOpacity,
} from 'react-native'
import { AuthContext } from '../../contexts/AuthContext'


export function HomeScreen() {
    // const {state} = React.useContext(AuthContext)
    function ToGallery() {
        console.log('按到我了');
    }
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Home Screen</Text>

            <TouchableOpacity activeOpacity={0.2} focusedOpacity={0.5} onPress={ToGallery}>
                <View >
                    <Text >to bobo gallery</Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}
