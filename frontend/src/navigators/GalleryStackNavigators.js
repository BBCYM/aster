import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import Uber from '../utils/uber'
import GalleryDetail from '../utils/GalleryDetail'
import { NormalPanel, ScrollPanel, BottomPanel } from '../utils/SlidingUpPanel'
import ImageView from '../utils/ImageView_old'
import ImageViewing from '../utils_ImageViewing/ImageViewingApp'
import Gallery from '../utils/Gallery'

const GalleryStack = createStackNavigator()

export function GalleryScreen() {
    return (
        <GalleryStack.Navigator>
            <GalleryStack.Screen name='Gallery' component={Gallery} />
            {/* <GalleryStack.Screen name='uber' component={Uber} /> */}
            <GalleryStack.Screen name='GalleryDetail' component={GalleryDetail} />
            <GalleryStack.Screen name='NormalPanel' component={NormalPanel} />
            <GalleryStack.Screen name='ScrollPanel' component={ScrollPanel} />
            <GalleryStack.Screen name='BottomPanel' component={BottomPanel} />
            <GalleryStack.Screen name='ImageView' component={ImageView} />
            <GalleryStack.Screen name='ImageViewing' component={ImageViewing} />
        </GalleryStack.Navigator>
    )
}