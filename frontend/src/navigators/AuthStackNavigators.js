import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import { SigninScreen } from '../screens/Auth/Signin'
import { LoadingScreen } from '../screens/Auth/Loading'
const AuthStack = createStackNavigator()
export function AuthStackNavigator() {
    return (
        <AuthStack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <AuthStack.Screen name='Loading' component={LoadingScreen} />
            <AuthStack.Screen name='Signin' component={SigninScreen} />
        </AuthStack.Navigator>
    )
}