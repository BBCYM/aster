import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack'
import { AuthStackNavigator } from './navigators/AuthStackNavigators'
import { PagesTabNavigator } from './navigators/PagesTabNavigator'
import { AuthContext } from './contexts/AuthContext'
import { SplashScreen } from './screens/Auth/Splash'
import { useAuth } from './hooks/useAuth'
import Uber from './utils/uber'
import GalleryDetail from './utils/GalleryDetail'
import { NormalPanel, ScrollPanel, BottomPanel } from './utils/SlidingUpPanel'
import ImageView from './utils/ImageView_old'
//import ImageViewing from './utils/ImageViewing'
import ImageViewing from './utils_ImageViewing/ImageViewingApp' //暫時改成這樣 應該是要用上面的
const MainStack = createStackNavigator()

export default function () {
  const { auth, state } = useAuth()


  return (
    <AuthContext.Provider value={{ auth, state }} >
      <NavigationContainer>
        <MainStack.Navigator
          screenOptions={{
            headerShown: false,
            animationEnabled: false
          }}
        >
          {
            state.splash ? (
              <MainStack.Screen name='Splash' component={SplashScreen} />
            ) : (
                state.user ? (
                  console.log("hello user"),
                  <MainStack.Screen name='Pages' component={PagesTabNavigator} />
                ) : (
                    console.log('need auth'),
                    <MainStack.Screen name='Auth' component={AuthStackNavigator} />
                  )
              )
          }
          {
            <MainStack.Screen name='Pages' component={PagesTabNavigator} />
            <MainStack.Screen name='uber' component={Uber} />
            <MainStack.Screen name='GalleryDetail' component={GalleryDetail} />
            <MainStack.Screen name='NormalPanel' component={NormalPanel} />
            <MainStack.Screen name='ScrollPanel' component={ScrollPanel} />
            <MainStack.Screen name='BottomPanel' component={BottomPanel} />
            <MainStack.Screen name='ImageView' component={ImageView} />
            <MainStack.Screen name='ImageViewing' component={ImageViewing} />
          }
        </MainStack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  )
}