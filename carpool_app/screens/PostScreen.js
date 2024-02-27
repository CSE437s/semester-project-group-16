import React from 'react';
import { View, Text, Button, Modal } from 'react-native';
import Post from '../components/Post';
import PostCreation from '../components/PostCreation';
import {useState, useEffect} from 'react';
import { StyleSheet} from 'react-native';
import { getUserRides } from '../Utils';

import axios from 'axios';
//import { BASE_URL} from '@env';
import { REACT_APP_REMOTE_SERVER } from '@env';


const PostScreen = () => {
  const [trips, setTrips] = useState([]);
  const [showPostCreation, setShowPostCreation] = useState(false);

  const dummyTrips = [
    { trip_id: 1, route_id: 1, user_id: 1, timestamp: '2024-02-26', category: 'Campus', completed: false },
    { trip_id: 2, route_id: 2, user_id: 2, timestamp: '2024-02-27', category: 'Groceries', completed: true },
  ];

  const fetchTrips = async () => {
    try {
      const userTrips = await getUserRides('true'); 
      console.log('User Trips:', userTrips); 
  
      // Iterate over each trip and print the origin and destination addresses
      userTrips.forEach(trip => {
        console.log('Origin Address:', trip.addresses.origin_address);
        console.log('Destination Address:', trip.addresses.destination_address);
        console.log('Email:', trip.email);
      });
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

    {/* <Button title="Fetch Data" onPress={fetchData} /> */}

      <View>
        <Button title="Create Post" onPress={openPostCreation} />
        <Modal visible={showPostCreation} animationType="slide">
          <PostCreation onClose={closePostCreation} />
        </Modal>

      </View>

      <div>
      {dummyTrips.map((trip, index) => (
        <div key={index} style={{ marginTop: '10px' }}>
          <Post trip={trip} />
      </div>
      ))}
    </div>

    </View>
  );
  
}


const styles = StyleSheet.create({
  container: {
    display:'flex',
    justifyContent: 'center',
  },
  postContainer: {
      width: '100%',
      display: 'flex',
      alignItems: 'center', 
      justifyContent: 'center',
  }
});

export default PostScreen;
