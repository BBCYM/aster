import * as React from 'react'
import { View, Text, ActivityIndicator, StyleSheet, ImageBackground } from 'react-native'
import { AuthContext } from '../../contexts/AuthContext'
import Ionicon from 'react-native-vector-icons/Ionicons'
export function SplashScreen(props) {
    const { auth } = React.useContext(AuthContext)
    React.useEffect(() => {
        auth.configure(() => {
            auth.checkUser((userInfo)=>{
                
                auth.connectBackend(userInfo)
            })
        })
    })
    return (

        <ImageBackground source={require('../../pic/back.png')} style={styles.back}>
            <View style={styles.main}>
                <Ionicon name='md-shapes-outline' size={100} color='#303960' />
                <Text style={styles.text}>Aster</Text>
            </View>
        </ImageBackground>
    )
}
const styles = StyleSheet.create({
    main: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
    },
    text: {
        fontSize: 70,
        color: '#303960',
        lineHeight:68,
    },
    back: {
        flex:1,
        resizeMode: "cover",
        justifyContent: "center"
    },
})