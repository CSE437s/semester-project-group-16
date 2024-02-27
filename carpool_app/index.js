import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
console.log("Before registering")
AppRegistry.registerComponent(appName, () => App);
console.log("After registering")