import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator} from '@react-navigation/stack'
import Ionicons from 'react-native-vector-icons/Ionicons'
import HomeScreen from './src/screens/Home'
import AuthScreen from './src/screens/Auth'
import LoadingScreen from './src/screens/Loading'

const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Loading">
        <Stack.Screen name="Loading" component={LoadingScreen} options={{ headerShown:false }} />
      </Stack.Navigator>
      {/* <Tab.Navigator
        initialRouteName='Home'
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Home') {
              iconName = focused ? 'ios-information-circle' : 'ios-information-circle-outline';
            } else if (route.name === 'Auth') {
              iconName = focused ? 'ios-list-box' : 'ios-list';
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: 'tomato',
        }}
      >
        <Tab.Screen
          name='Home'
          component={HomeScreen}
        />
        <Tab.Screen
          name='Auth'
          component={AuthScreen}
        />
      </Tab.Navigator> */}
    </NavigationContainer>
  )
}