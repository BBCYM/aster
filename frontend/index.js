/**
 * @format
 */

import 'react-native-gesture-handler'
import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);

const images = {
    pic: {
        camera: require('./src/pic/camera.png'),
        person: require('./src/pic/person.png'),
    },
    accountpeople: require('./src/pic/accountpeople.png'),
};

export default images;