import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import Profile from '../screens/Profile/Profile'
import EditPage from '../screens/Profile/editPage'

const ProfileStack = createStackNavigator()

export function ProfileStackScreen() {
    return (
        <ProfileStack.Navigator>
            <ProfileStack.Screen name='Profile' component={Profile} />
            <ProfileStack.Screen name='EditPage' component={EditPage} />
        </ProfileStack.Navigator>
    )
}