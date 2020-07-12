<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> yojin
import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import ChatbotScreen from '../screens/Chatbot/ChatBot';
import {HomeScreen} from '../screens/Home/Home';
import ProfileScreen from '../screens/Profile/Profile';
import gallery from '../utils/galary';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useAuth} from '../hooks/useAuth';
<<<<<<< HEAD
=======
=======
import * as React from 'react'
import { View, TouchableOpacity, StyleSheet, Image, Text } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack'
import ChatbotScreen from '../screens/Chatbot/Chatbot'
import HomeScreen from '../screens/Home/Home'
import ProfileScreen from '../screens/Profile/Profile'
import gallery from '../utils/galary'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useAuth } from '../hooks/useAuth'
>>>>>>> master
>>>>>>> yojin
const PagesTab = createBottomTabNavigator()
const PagesStack = createStackNavigator()


<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> yojin
export function PagesTabNavigator() {
  return (
    <PagesTab.Navigator
      initialRouteName="Home"
      tabBarOptions={{
        activeTintColor: '#F27B50',
        inactiveTintColor: '#F2BD1D',
      }}>
      <PagesTab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Albums',
          // focused: boolean; color: string; size: number;
          // tabBarIcon: (props) => {
          //     return <Ionicons name='ios-images' color={props.color} size={props.size} />
          // }
        }}
      />
      <PagesTab.Screen
        name="Chatbot"
        component={ChatbotScreen}
        options={{
          tabBarLabel: 'Search',
          // tabBarIcon: (props) => {
          //     return <Ionicons name='md-chatboxes' color={props.color} size={props.size} />
          // }
        }}
      />
      <PagesTab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          // tabBarIcon: (props) => {
          //     return <Ionicons name='ios-person' color={props.color} size={props.size} />
          // }
        }}
      />
      <PagesTab.Screen
        name="Gallary"
        component={gallery}
        options={{
          tabBarLabel: 'Gallary',
          // tabBarIcon: (props) => {
          //     return <Ionicons name='ios-person' color={props.color} size={props.size} />
          // }
        }}
      />
    </PagesTab.Navigator>
  );
<<<<<<< HEAD
}
=======
}
=======
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
                    name='Gallary'
                    component={gallery}
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
                    horizontal: 200
                },
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                headerShown: false,
            }}
        >
            <PagesStack.Screen name='index' component={index}/>
            <PagesStack.Screen name='Chatbot' component={ChatbotScreen} options={{
                headerShown: true,
                headerTitle: null,
                headerRight: () => (
                    <View style={styles.block}>
                        <TouchableOpacity onPress={()=>{props.navigation.navigate('Home')}}>
                            <Image style={styles.photo} source={require('../pic/photo.png')} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{props.navigation.navigate('Profile')}}>
                            <Image style={styles.person} source={require('../pic/person.png')} />
                        </TouchableOpacity>
                    </View>
                ),
            }} />
        </PagesStack.Navigator>
    )
}
const styles = StyleSheet.create({
    block: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginRight:15,
    },
    person:{
        marginLeft:10
    },
    photo:{
        marginRight:10
    }
})
>>>>>>> master
>>>>>>> yojin
