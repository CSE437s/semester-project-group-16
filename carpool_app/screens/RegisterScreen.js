import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const RegisterScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text>Register Screen</Text>
      <Button title="Back to Login" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default RegisterScreen;
