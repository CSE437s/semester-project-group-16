import React, { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, View, Text, TextInput, TouchableOpacity, Button, StyleSheet, Platform } from 'react-native';
import {FIREBASE_AUTH} from'../components/FirebaseConfig';
import {signInWithEmailAndPassword, createUserWithEmailAndPassword} from 'firebase/auth';

//TODO validate user input. 

const LoginScreen = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, username, password);
      console.log("Login successful:", response);
      navigateToHome();
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        console.log("User not found");
      } else if (error.code === "auth/wrong-password") {
        console.log("Incorrect password");
      } else {
        console.log("Other login error:", error.code, error.message);
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleSignup = async () => {
    setLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(auth, username, password);
      console.log("Signup successful:", response);
      navigateToHome();
    } catch (error) {
      console.error("Signup error:", error.code, error.message);
    } finally {
      setLoading(false);
    }
  };

  const navigateToHome = () => {
    setIsAuthenticated(true);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
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
        {loading ? <ActivityIndicator size="large" /> 
        : <> 
        <Button title="Login" onPress={handleLogin} />
        <Button title="Sign Up" onPress={handleSignup} />
        </> 
        }

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: 20,
    gap: 5,
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
