import React from 'react';
import styled from 'styled-components';
import {checkUserExists} from '../Utils';
import StopCreation from './StopCreation';
import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Modal, Picker, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';


const Post = ({ trip }) => {

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const dateString = date.toLocaleDateString();
    const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `${dateString} : ${timeString}`;
  };

  const [showStopCreation, setShowStopCreation] = useState(false);

  const handleApply = () => {
    setShowStopCreation(true); // Show the form when Apply button is pressed
    const userObj = checkUserExists();
    const userId = userObj.uid;

    //console.log(trip.route_id);
    //console.log(userId);
    
  };

  const handleClose = () => {
    setShowStopCreation(false); // Close the form
  };



  return (
    <View style={styles.styledPost}>
      <View style={styles.tripInfo}>
        <Text><Text style={styles.label}>From:</Text> {trip.addresses.origin_address}</Text>
        <Text><Text style={styles.label}>To:</Text> {trip.addresses.destination_address}</Text>
        <Text style={styles.category}>{trip.category}</Text>
      </View>
      <View style={styles.routeInfo}>
        <Text style={styles.email}>{trip.email.email}</Text>
        <Text style={styles.timestamp}>{formatTimestamp(trip.timestamp)}</Text>
        <Text style={styles.completed}>{trip.completed ? 'Completed' : 'Active'}</Text>
      </View>
      <Button title="Apply" onPress={handleApply} color="#007bff" />
      <Modal visible={showStopCreation} animationType="slide">
        <StopCreation onClose={handleClose} tripRouteId={trip.route_id} tripId={trip.trip_id}/>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  styledPost: {
    display: 'flex', // Flex is default
    justifyContent: 'space-between',
    alignItems: 'stretch',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 20,
  },
  tripInfo: {
    flex: 1,
  },
  routeInfo: {
    flex: 1,
    marginLeft: 20,
  },
  label: {
    fontWeight: 'bold',
  },
  // Add other styles here
});


export default Post;

