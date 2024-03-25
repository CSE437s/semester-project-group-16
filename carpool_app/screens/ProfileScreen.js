import React, {useState, useEffect} from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import {signOut} from 'firebase/auth';
import {FIREBASE_AUTH} from'../components/FirebaseConfig';
import CustomButton from '../components/CustomButton';
import {getUserWithUserId, checkUserExists} from '../Utils';
import UserInfoForm from '../components/UserInfoForm';

const ProfileScreen = () => {
  const user = checkUserExists();
  const [userDb, setUserDb] = useState({});

  useEffect(() => {
    const getUserData = async() => {
      const userFromDb = await getUserWithUserId(user.uid);
      setUserDb(userFromDb);
    }

    getUserData();

  }, []);

  const onClose = () => {
    console.log("updated!");
  }



  const logout = () => {
    signOut(FIREBASE_AUTH).then(() => {
      console.log("User signed out successfully");
    }).catch((error) => {
      console.error("Sign out error:", error);
    });
  };

  return (
    <View style={styles.container}>
      <CustomButton title="Log out" onPress={logout} /> 
      <UserInfoForm onClose={onClose}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display:'flex',
    marginTop: 60,
  }
})

export default ProfileScreen;