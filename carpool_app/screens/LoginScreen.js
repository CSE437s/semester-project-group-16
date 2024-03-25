import React, { useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, View, Text, TextInput, TouchableOpacity, Button, StyleSheet, Platform, Image} from 'react-native';
import {FIREBASE_AUTH} from'../components/FirebaseConfig';
import {signInWithEmailAndPassword, createUserWithEmailAndPassword,sendEmailVerification} from 'firebase/auth';
import CustomAlert from '../components/CustomAlert';
import {createNewUser} from '../Utils';

const LoginScreen = ({setUser}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const auth = FIREBASE_AUTH;

  const showAlert = (message) => {
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const validateSignupInput = () => {
    const eduEmailRegex = /^[^@\s]+@[^@\s]+\.(edu)$/i;
    if (!eduEmailRegex.test(username)) {
      //throw new Error("Username must be a .edu email address.");
    }
    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters.");
    }
  };


  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, username, password);
      await response.user.reload();
      const updatedUser = auth.currentUser;

      if (updatedUser && !updatedUser.emailVerified) {
        showAlert("Please verify your email before logging in.");
      } else {
        console.log("Login successful, user email is verified.");
        setUser(updatedUser);
      }
    } catch (error) {
      showAlert(`Login Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    setLoading(true);
    try {
      validateSignupInput();
      
      const response = await createUserWithEmailAndPassword(auth, username, password);
      await sendEmailVerification(response.user);
      await createNewUser();
  
      showAlert("Please verify your email. Check your inbox for the verification link.");
    } catch (error) {
      showAlert(`Signup Error: ${error.message}`);
      console.error("Signup Error:", error); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ride Along</Text>
      <View>
        <Image
          source={require('../assets/RALogo.png')}
          style={{ width: 200, height: 200 }}
        />
      </View>
      <CustomAlert
        visible={alertVisible}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none" 
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          //autoCapitalize="none" 
          secureTextEntry
        />
        {loading ? <ActivityIndicator size="large" /> 
        : <> 
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
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
    paddingTop: 160,
    gap: 5,
  },
  title: {
    fontSize: 40,
  },
  button: {
    padding: 10,
    backgroundColor: '#022940',
    borderRadius: 5,
    width: 100,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  input: {
    width: '50%',
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    textAlign: 'center',
    borderColor: '#cccccc',
    borderRadius: 5,
  },
});

export default LoginScreen;
