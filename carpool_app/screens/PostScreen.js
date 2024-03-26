import React from 'react';
import { View, Text, Button, Modal, ScrollView } from 'react-native';
import Post from '../components/Post';
import PostCreation from '../components/PostCreation';
import {useState, useEffect} from 'react';
import { StyleSheet} from 'react-native';
import { getUserRides } from '../Utils';
import CustomButton from '../components/CustomButton';

import axios from 'axios';
//import { BASE_URL} from '@env';
import { REACT_APP_REMOTE_SERVER } from '@env';


const PostScreen = () => {
  const [trips, setTrips] = useState([]);
  const [showPostCreation, setShowPostCreation] = useState(false);

  const fetchTrips = async () => {
    try {
      const userTrips = await getUserRides('true'); 
      setTrips(userTrips);
  
    } catch (error) {
      console.error('Error fetching user rides:', error);
    }
  };

  const openPostCreation = () => {
    setShowPostCreation(true);
  };

  const closePostCreation = () => {
    setShowPostCreation(false);
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  return (
    <View style={styles.container}>

      <View style={styles.customBtnContainer}>
        <CustomButton title="New Ride" onPress={openPostCreation} style={[{}, styles.customBtn]} />
        <Modal visible={showPostCreation} animationType="slide">
          <PostCreation onClose={closePostCreation} />
        </Modal>
      </View>
  
      <ScrollView style={{ marginTop: 5 }}>
        {trips.map((trip, index) => (
          <Post key={index} trip={trip} />
        ))}
      </ScrollView>



    </View>
  );
  
}


const styles = StyleSheet.create({
  container: {
    marginTop:60,
    display:'flex',
    justifyContent: 'center',
  },
  postContainer: {
      width: '100%',
      display: 'flex',
      alignItems: 'center', 
      justifyContent: 'center',
  },
  customBtnContainer:{
    marginTop: -25,
    //backgroundColor: '#022940',
    height: 'fit'
  },
  customBtn:{
    padding: 30
  },
});

export default PostScreen;
