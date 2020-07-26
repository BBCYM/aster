import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack';

// import Uber from '../utils/uber'
// import GalleryDetail from '../utils/GalleryDetail'
// import {NormalPanel, ScrollPanel, BottomPanel} from '../utils/SlidingUpPanel'
// import ImageView from '../utils/ImageView_old'
// import ImageViewing from '../utils_ImageViewing/ImageViewingApp'
import HomePage from '../screens/Home/Home';
//import AllphotoPage from '../screens/Home/Allphoto';


const HomeStack = createStackNavigator()

export function HomeScreen() {
    return (
        <HomeStack.Navigator>
            <HomeStack.Screen name='Home' component={HomePage} />
            {/*<HomeStack.Screen name='Allphoto' component={AllphotoPage}/>
             <HomeStack.Screen name='uber' component={Uber} />
            <HomeStack.Screen name='GalleryDetail' component={GalleryDetail} />
            <HomeStack.Screen name='NormalPanel' component={NormalPanel} />
            <HomeStack.Screen name='ScrollPanel' component={ScrollPanel} />
            <HomeStack.Screen name='BottomPanel' component={BottomPanel} />
            <HomeStack.Screen name='ImageView' component={ImageView} />
            <HomeStack.Screen name='ImageViewing' component={ImageViewing} /> */}
        </HomeStack.Navigator>
    )
}