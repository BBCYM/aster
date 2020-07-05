import * as React from 'react'
import { View, Text, ActivityIndicator } from 'react-native'
import { AuthContext } from '../../contexts/AuthContext'
export function LoadingScreen(props) {
    const {auth} = React.useContext(AuthContext)

    React.useEffect(() => {
        setTimeout(()=>{
            auth.configure(()=>{
                auth.isSignedIn()
            })
        },300)
    })
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', padding: 10 }}>
            <ActivityIndicator size={78} color='#0000ff' />
        </View>
    )
}