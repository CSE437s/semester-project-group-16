import React from 'react';
import { View, Text } from 'react-native';
import NavigationBar from '../components/NavigationBar';
import {useEffect} from 'react';
import {FIREBASE_AUTH} from'../components/FirebaseConfig';

//This is a template function that is able to make a get request to
//a protected api endpoint. 
const makeProtectedAPICall = async () => {
  try {
    const user = FIREBASE_AUTH.currentUser;
    if (!user) {
      console.log('User is not logged in');
      return;
    }

    // Get the ID token of the current user
    const idToken = await user.getIdToken(true);
    const apiUrl = `http://localhost:3000/rides/${user.uid}`;

    // Make the API call with the ID token in the Authorization header
    const response = await fetch(apiUrl, {
      method: 'GET', // or 'POST', 'PUT', etc., depending on your endpoint
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${idToken}`, // Include the ID token in the Authorization header
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch from protected endpoint');
    }

    // Process the response from the protected endpoint
    const responseData = await response.json();
    console.log(responseData);
    return responseData;
  } catch (error) {
    console.error('Error making protected API call:', error);
  }
};

const HomeScreen = () => {
  useEffect(() => {
    const fetchData = async () => {
      await makeProtectedAPICall();
    };

    fetchData();
  }, []);

  return (
    <View>
      <Text>This is the logged in screen!</Text>
    </View>
  );
};

export default HomeScreen;