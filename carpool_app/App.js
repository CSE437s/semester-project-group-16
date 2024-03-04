import React from 'react';
import {useState, useEffect, useContext} from 'react';
import LoginScreen from './screens/LoginScreen';
import NavigationBar from './components/NavigationBar';
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function App() {
  console.log("Root of App")
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
    {(user && user.emailVerified) ? <NavigationBar /> : <LoginScreen/>}
    </>
  );
}
