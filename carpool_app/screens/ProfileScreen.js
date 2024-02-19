import React from 'react';
import { View, Text, Button } from 'react-native';

const ProfileScreen = ({ route }) => {
  const { setIsAuthenticated } = route.params;

  const handleLogout = () => {
    setIsAuthenticated(false);
  }

  return (
    <View>
      <Text>This is the profile screen!</Text>
      <Button title="Log out" onPress={handleLogout} /> 
    </View>
  );
};

export default ProfileScreen;