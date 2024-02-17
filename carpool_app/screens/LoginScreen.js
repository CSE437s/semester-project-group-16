import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
console.log("something loaded")

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log('Login credentials', { username, password });
  };

  const handleUsernameChanged = (newUsername) => {
    setUsername(newUsername);
  }

  const handlePasswordChanged = (newPassword) => {
    setPassword(newPassword);
  }
  const navigateToRegister = () => {
    console.log("Button was pressed!");
    navigation.navigate('Register');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button title="Login" onPress={handleLogin} />

      <Button
        title="Go to Register"
        onPress={navigateToRegister}
        color="#1c1c1e" // Adjust the color to match your design
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 5,
  },
});

export default LoginScreen;
