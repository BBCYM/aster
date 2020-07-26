import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { SigninScreen } from '../screens/Auth/Signin'
import { AuthContext } from '../contexts/AuthContext'
const AuthStack = createStackNavigator()
export function AuthStackNavigator() {
	return (
		<AuthStack.Navigator
			initialRouteName='Signin'
			screenOptions={{
				headerShown: false,
				animationEnabled: true
			}}
		>
			{
				<AuthStack.Screen name='Signin' component={SigninScreen} />
			}
		</AuthStack.Navigator>
	)
}