import * as React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack'
import ChatbotScreen from '../screens/Chatbot/Chatbot'
import { HomeScreen } from '../navigators/HomeStackNavigators'
// import { GalleryStackScreen } from '../navigators/GalleryStackNavigators'
import ProfileScreen from '../screens/Profile/Profile'
import GalleryStackScreen from '../navigators/GalleryStackNavigators'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { View, TouchableOpacity, StyleSheet, Image, Text } from 'react-native'
// import temp from '../utils_ImageViewing/ImageViewingApp-copy'
const PagesTab = createBottomTabNavigator()
const PagesStack = createStackNavigator()

export function PagesTabNavigator(props) {
	function index() {
		return (
			<PagesTab.Navigator
				initialRouteName='Home'
				tabBarOptions={{
					activeTintColor: '#F27B50',
					inactiveTintColor: '#F2BD1D',
				}}
			>
				<PagesTab.Screen
					name='Home'
					component={HomeScreen}
					options={{
						tabBarLabel: 'Albums',
						// focused: boolean; color: string; size: number;
						tabBarIcon: (props) => {
							return <Ionicons name='images-outline' color={props.color} size={props.size} />
						}
					}}
				/>
				<PagesTab.Screen
					name='switchChat'
					component={ChatbotScreen}
					listeners={() => ({
						tabPress: e => {
							e.preventDefault()
							props.navigation.navigate('Chatbot')
						}
					})}
					options={{
						tabBarLabel: 'Search',
						tabBarIcon: (props) => {
							return <Ionicons name='chatbox-ellipses-outline' color={props.color} size={props.size} />
						}
					}}
				/>
				<PagesTab.Screen
					name='Profile'
					component={ProfileScreen}
					options={{
						tabBarLabel: 'Profile',
						tabBarIcon: (props) => {
							return <Ionicons name='person-outline' color={props.color} size={props.size} />
						}
					}}
				/>
				<PagesTab.Screen
					name='Gallery'
					component={GalleryStackScreen}
					// listeners={() => ({
					//     tabPress: e => {
					//         e.preventDefault()
					//         props.navigation.navigate('Gallery')
					//     }
					// })}
					options={{
						tabBarLabel: 'Gallary',
						tabBarIcon: (props) => {
							return <Ionicons name='ios-image-outline' color={props.color} size={props.size} />
						}
					}}
				/>
			</PagesTab.Navigator>
		)
	}
	return (
		<PagesStack.Navigator
			initialRouteName='index'
			screenOptions={{
				gestureEnabled: true,
				gestureDirection: 'horizontal',
				gestureResponseDistance: {
					// the larger, the easier
					horizontal: 100
				},
				cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
				headerShown: false,
			}}
		>
			<PagesStack.Screen name='index' component={index} />
			<PagesStack.Screen name='Chatbot' component={ChatbotScreen} options={{
				headerShown: true,
				headerTitle: null,
			}} />
			{/* <PagesStack.Screen name='Gallery' component={temp} options={{
                headerShown: true,
                headerTitle: null,
            }}
            /> */}
		</PagesStack.Navigator>
	)
}


