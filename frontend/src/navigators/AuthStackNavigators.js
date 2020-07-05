import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import { SigninScreen } from '../screens/Auth/Signin'
import { LoadingScreen } from '../screens/Auth/Loading'
import { AuthContext } from '../contexts/AuthContext'
const AuthStack = createStackNavigator()
export function AuthStackNavigator() {
    const { state } = React.useContext(AuthContext)
    return (
        <AuthStack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            {
                // initial true
                state.isLoading ? (
                    <AuthStack.Screen name='Loading' component={LoadingScreen} />
                ) : (
                    <AuthStack.Screen name='Signin' component={SigninScreen} />
                )
            }
        </AuthStack.Navigator>
    )
}