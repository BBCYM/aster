import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import HomePage from '../screens/Home/Home'

const HomeStack = createStackNavigator()

export function HomeScreen() {
    return (
        <HomeStack.Navigator>
            <HomeStack.Screen name='Home' component={HomePage} />
        </HomeStack.Navigator>
    )
}