import React from 'react';
import styled from 'styled-components';
import { checkUserExists, timestampToWrittenDate } from '../Utils';
import StopCreation from './StopCreation';
import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Modal,
  Picker,
  TouchableOpacity,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Ionicons';
import ShowPost from './ShowPost';

const Post = ({ trip, fromManageCarpools = false }) => {
  const [showPost, setShowPost] = useState(false);

  const handleApply = () => {
    setShowPost(true);
    const userObj = checkUserExists();
    const userId = userObj.uid;
  };

  const handleClose = () => {
    setShowPost(false);
  };

  const isTripPast = () => {
    const tripDate = new Date(trip.timestamp);
    const currentDate = new Date();
    return tripDate < currentDate;
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handleApply}>
      <Text style={styles.email}>{trip.tripUserEmail}</Text>
      <Text style={styles.timestamp}>
        {timestampToWrittenDate(trip.timestamp)}
      </Text>

      <View style={{ display: 'flex', flexDirection: 'row', gap: 5 }}>
        <Icon name={'business-outline'} size={16} />
        <Text style={styles.address}> {trip.route.originAddress}</Text>
      </View>
      <View style={{ display: 'flex', flexDirection: 'row', gap: 5 }}>
        <Icon name={'flag-outline'} size={16} />
        <Text style={styles.address}> {trip.route.destinationAddress}</Text>
      </View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-around',
          margin: 10,
        }}
      >
        <Text style={styles.category}>{trip.category}</Text>
        <Text style={styles.completed}>
          {isTripPast() ? 'Past' : 'Upcoming'}
        </Text>
      </View>
      <Modal visible={showPost} animationType="slide">
        <ShowPost
          trip={trip}
          onClose={handleClose}
          fromManageCarpools={fromManageCarpools}
        />
      </Modal>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex', 
    justifyContent: 'space-between',
    alignItems: 'stretch',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderColor: 'black',
    borderWidth: 0.5,
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
  email: {
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 10,
  },
  address: {
    fontSize: 14,
    width: '90%',
    //backgroundColor: 'pink'
  },
  timestamp: {
    fontFamily: 'Poppins-Black',
  },
  // Add other styles here
});

export default Post;
