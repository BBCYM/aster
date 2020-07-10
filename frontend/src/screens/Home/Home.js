import * as React from 'react'
import {
    Text,
    TouchableWithoutFeedback,
    View,
    TouchableOpacity,
} from 'react-native'
import { AuthContext } from '../../contexts/AuthContext'
//import Gallery from '../../utils/Gallery'
//import uber from '../../utils/uber'

export function HomeScreen(props) {
    // const {state} = React.useContext(AuthContext)
    function pressme() {
        console.log('按到我了');
    }
    let ToGallery = () => {
        props.navigation.navigate('Gallery')
    }
    let ToUber = () => {
        props.navigation.navigate('uber')
    }
    return (
        <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Home Screen</Text>

            <TouchableOpacity activeOpacity={0.2} focusedOpacity={0.5} onPress={ToGallery}>
                <View >
                    <Text >to bobo gallery</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={{ fontsize: 30, padding: 30 }} activeOpacity={0.2} focusedOpacity={0.5} onPress={ToUber}>
                <View >
                    <Text >to uber box</Text>
                </View>
            </TouchableOpacity>
        </View >
    )
}
