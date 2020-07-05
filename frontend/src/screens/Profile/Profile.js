import * as React from 'react'
import { Text, View } from 'react-native'
import {Button} from 'react-native-elements'
import {AuthContext} from '../../contexts/AuthContext'
export function ProfileScreen() {
    const {auth} = React.useContext(AuthContext)
    let _signOut = ()=>{
        auth.configure(()=>{
            auth.signOut()
        })
    }
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Profile Screen</Text>
            <Button title='Signout' raised={true} type='outline' onPress={()=>{_signOut()}}/>
        </View>
    )
}