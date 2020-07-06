import * as React from 'react'
import { View, Text, ActivityIndicator } from 'react-native'
import { AuthContext } from '../../contexts/AuthContext'
import Ionicon from 'react-native-vector-icons/Ionicons'
export function SplashScreen(props) {
    const { auth } = React.useContext(AuthContext)
    React.useEffect(() => {
        auth.configure(()=>{
            auth.checkUser()
        })
    })
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', padding: 10 }}>
            <Ionicon name='md-shapes-outline' size={120} color='#303960' />
        </View>
    )
}