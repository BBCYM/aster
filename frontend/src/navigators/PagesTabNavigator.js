import * as React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { ChatbotScreen } from '../screens/Chatbot/Chatbot'
import { HomeScreen } from '../screens/Home/Home'
import { ProfileScreen } from '../screens/Profile/Profile'
import Ionicons from 'react-native-vector-icons/Ionicons'
import {useAuth} from '../hooks/useAuth'
const PagesTab = createBottomTabNavigator()

export function PagesTabNavigator() {
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
                    tabBarLabel:'Albums',
                    // focused: boolean; color: string; size: number;
                    tabBarIcon: (props) => {
                        return <Ionicons name='md-images' color={props.color} size={props.size} />
                    }
                }}
            />
            <PagesTab.Screen
                name='Chatbot'
                component={ChatbotScreen}
                options={{
                    tabBarLabel:'Search',
                    tabBarIcon: (props) => {
                        return <Ionicons name='md-chatboxes' color={props.color} size={props.size} />
                    }
                }}
            />
            <PagesTab.Screen 
                name='Profile'
                component={ProfileScreen}
                options={{
                    tabBarLabel:'Profile',
                    tabBarIcon: (props) => {
                        return <Ionicons name='md-person' color={props.color} size={props.size} />
                    }
                }}    
            />
        </PagesTab.Navigator>
    )
}