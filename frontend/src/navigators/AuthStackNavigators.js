import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import { SigninScreen } from '../screens/Auth/Signin'
import { LoadingScreen } from '../screens/Auth/Loading'
import { AuthContext } from '../contexts/AuthContext'
const AuthStack = createStackNavigator()
export function AuthStackNavigator() {
    return (
        <AuthStack.Navigator
            initialRouteName='Signin'
            screenOptions={{
                headerShown: false,
                animationEnabled: false
            }}
        >
            <AuthStack.Screen name='Signin' component={SigninScreen} />
        </AuthStack.Navigator>
    )
}