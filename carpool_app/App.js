import React from 'react';
import {useState} from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import NavigationBar from './components/NavigationBar';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <>
    {isAuthenticated ? <NavigationBar /> : <LoginScreen setIsAuthenticated={setIsAuthenticated} />}
    </>
  );
}
