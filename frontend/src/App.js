import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { AuthStackNavigator } from './navigators/AuthStackNavigators'
import { PagesTabNavigator } from './navigators/PagesTabNavigator'
import { AuthContext } from './contexts/AuthContext'
import { SplashScreen } from './screens/Auth/Splash'
import { useAuth } from './hooks/useAuth'
import { ThemeProvider } from 'react-native-elements'
import {setCustomText} from 'react-native-global-props'
const MainStack = createStackNavigator()


const CustomTextProps = {
	style:{
		fontFamily: 'SegoeUI',
	}
}
setCustomText(CustomTextProps)

export default function App() {
	const { auth, state } = useAuth()
	return (
		<AuthContext.Provider value={{ auth, state }} >
			<ThemeProvider>
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
										console.log('hello user'),
										<MainStack.Screen name='Pages' component={PagesTabNavigator} />

									) : (
											console.log('need auth'),
											<MainStack.Screen name='Auth' component={AuthStackNavigator} />
										)
								)
						}
					</MainStack.Navigator>
				</NavigationContainer>
			</ThemeProvider>
		</AuthContext.Provider>
	)
}