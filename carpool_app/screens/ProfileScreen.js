import React from 'react';
import { View, Text, Button } from 'react-native';
import {signOut} from 'firebase/auth';
import {FIREBASE_AUTH} from'../components/FirebaseConfig';

const ProfileScreen = () => {

  const logout = () => {
    signOut(FIREBASE_AUTH).then(() => {
      console.log("User signed out successfully");
    }).catch((error) => {
      console.error("Sign out error:", error);
    });
  };

  return (
    <View>
      <Text>This is the profile screen!</Text>
      <Button title="Log out" onPress={logout} /> 
    </View>
  );
};

export default ProfileScreen;