import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { AuthStackNavigator } from './navigators/AuthStackNavigators'
import { PagesTabNavigator } from './navigators/PagesTabNavigator'
import { AuthContext } from './contexts/AuthContext'
import { SplashScreen } from './screens/Auth/Splash'
import { useAuth } from './hooks/useAuth'
import Uber from './utils/uber'
import GalleryDetail from './utils/GalleryDetail'
import { NormalPanel, ScrollPanel, BottomPanel } from './utils/SlidingUpPanel'

const MainStack = createStackNavigator()

export default function () {
  const { auth, state } = useAuth()

  return (
    <AuthContext.Provider value={{ auth, state }} >
      <NavigationContainer>
        <MainStack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          {console.log(state.user)}

          {/* {
            state.isLoading ? (
              <MainStack.Screen name='Splash' component={SplashScreen} />
            ) : (
              state.user ? (
                <MainStack.Screen name='Pages' component={PagesTabNavigator} />
              ) : (
                <MainStack.Screen name='Auth' component={AuthStackNavigator} />
              )
            )
          } */}
          <MainStack.Screen name='Pages' component={PagesTabNavigator} />
          <MainStack.Screen name='uber' component={Uber} />
          <MainStack.Screen name='GalleryDetail' component={GalleryDetail} />
          <MainStack.Screen name='NormalPanel' component={NormalPanel} />
          <MainStack.Screen name='ScrollPanel' component={ScrollPanel} />
          <MainStack.Screen name='BottomPanel' component={BottomPanel} />

        </MainStack.Navigator>
      </NavigationContainer>

    </AuthContext.Provider>
  )
}