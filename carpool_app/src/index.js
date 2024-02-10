import { AppRegistry } from 'react-native';
import App from './App'; // Import your main App component
import appConfig from './app.json';

const appName = appConfig.name;
// Register the app
AppRegistry.registerComponent(appName, () => App);

// AppRegistry.runApplication is what actually starts your app
AppRegistry.runApplication(appName, {
  initialProps: {},
  rootTag: document.getElementById('app-root'),
});
