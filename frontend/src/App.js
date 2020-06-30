import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { AuthStackNavigator } from './navigators/AuthStackNavigators'
import {PagesTabNavigator} from './navigators/PagesTabNavigator'
import { AuthContext } from './contexts/AuthContext'
import { useAuth } from './hooks/useAuth'

const MainStack = createStackNavigator()

export default function () {
  const { auth, state } = useAuth()
  return (
    <AuthContext.Provider value={auth}>
      <NavigationContainer>
        <MainStack.Navigator
          screenOptions={{
            headerShown: false,
          }}
          initialRouteName='Auth'
        >
          <MainStack.Screen name='Auth' component={AuthStackNavigator} />
          <MainStack.Screen name='Pages' component={PagesTabNavigator} />
        </MainStack.Navigator>
      </NavigationContainer>

    </AuthContext.Provider>
  )
}