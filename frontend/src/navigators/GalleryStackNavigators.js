import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack';

import GalleryHome from '../screens/Gallery/PhotoGallery'

const GalleryStack = createStackNavigator()

export default function GalleryStackScreen() {
    return (
        <GalleryStack.Navigator initialRouteName='Gallery'>
            <GalleryStack.Screen name='Gallery' component={GalleryHome} />
            {/* <GalleryStack.Screen name='uber' component={Uber} />
            <GalleryStack.Screen name='GalleryDetail' component={GalleryDetail} />
            <GalleryStack.Screen name='NormalPanel' component={NormalPanel} />
            <GalleryStack.Screen name='ScrollPanel' component={ScrollPanel} />
            <GalleryStack.Screen name='BottomPanel' component={BottomPanel} />
            <GalleryStack.Screen name='ImageView' component={ImageView} />
            <GalleryStack.Screen name='ImageViewing' component={ImageViewing} /> */}
        </GalleryStack.Navigator>
    )
}