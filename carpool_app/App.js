import React from 'react';
import {useState, useEffect, useContext} from 'react';
import LoginScreen from './screens/LoginScreen';
import NavigationBar from './components/NavigationBar';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useFonts } from 'expo-font';

export default function App() {
  let [fontsLoaded] = useFonts({
    'Poppins-SemiBold': require('./assets/Poppins/Poppins-SemiBold.ttf'),
    'Poppins-Black': require('./assets/Poppins/Poppins-Black.ttf'),
  });

  const [user, setUser] = useState(null);
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
    setUser(currentUser); // Sets user to null if not logged in
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
    {(user && user.emailVerified) ? <NavigationBar /> : <LoginScreen setUser={setUser}/>}
    </>
  );
}
