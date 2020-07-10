import * as React from 'react'
import {
    Text,
    TouchableWithoutFeedback,
    View,
    TouchableOpacity,
} from 'react-native'
import { AuthContext } from '../../contexts/AuthContext'


export function HomeScreen(props) {
    // const {state} = React.useContext(AuthContext)
    function pressme() {
        console.log('按到我了');
    }
    let ToGallery = () => {
        props.navigation.navigate('Gallery')
    }

    return (
        <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Home Screen</Text>

            <TouchableOpacity activeOpacity={0.2} focusedOpacity={0.5} onPress={ToGallery}>
                <View >
                    <Text >to bobo gallery</Text>
                </View>
            </TouchableOpacity>

        </View >
    )
}
