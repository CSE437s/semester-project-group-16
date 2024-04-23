import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import axios from 'axios';
import { REACT_APP_REMOTE_SERVER } from '@env';
import AddressSearchBar from './AddressSearchBar';
import BackArrow from './BackArrow';
import CustomButton from './CustomButton';
import MapForStop from './MapForStop';
import {
  checkUserExists,
  reverseGeocode,
  fetchCoordinatesFromAddress,
} from '../Utils';
import { REACT_APP_MAPBOX_API_KEY } from '@env';

const StopCreation = ({ onClose, trip }) => {
  const [address, setAddress] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);

  const onLocationSelected = async (coordinate) => {
    setSelectedLocation(coordinate);
    const fetchedAddress = await reverseGeocode(
      coordinate.latitude,
      coordinate.longitude
    );
    setAddress(fetchedAddress || 'Address not found');
  };

  const handleSubmit = async () => {
    const userObj = checkUserExists();
    const userId = userObj.uid;
    const idToken = await userObj.getIdToken(true);

    if (!selectedLocation && !address) {
      Alert.alert(
        'Validation Error',
        'Please provide either an address or select a location on the map.'
      );
      return;
    }

    const postData = {
      userId: userId,
      routeId: trip.route.RouteId,
      tripId: trip.tripId,
      stopAddress: address,
      stopCoordinates: selectedLocation
        ? {
            latitude: selectedLocation.latitude,
            longitude: selectedLocation.longitude,
          }
        : undefined, // Use undefined to avoid sending null values
      incomingUserId: trip.tripUserId,
    };

    // Log the data being sent for debugging
    console.log('Sending data:', postData);

    try {
      const response = await axios.post(
        `${REACT_APP_REMOTE_SERVER}/stops`,
        postData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${idToken}`,
            userid: userId,
          },
        }
      );

      if (response.status === 200) {
        console.log('Stop created successfully!');
        onClose();
      } else {
        console.error('Failed to create stop:', response.data);
      }
    } catch (error) {
      console.error('Error during stop creation:', error);
      Alert.alert('Error', 'Failed to create stop.');
    }
  };

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container}>
      <BackArrow onClose={onClose} />
      <Text style={styles.headerText}>Pickup Location</Text>
      <MapForStop
        ride={trip}
        onLocationSelected={onLocationSelected}
        mapHeight={500}
      />

      <View style={styles.addressBarContainer}>
        <AddressSearchBar
          handleTextChange={setAddress}
          placeholder="Type in address..."
        />
      </View>
      <CustomButton
        title="Submit"
        onPress={handleSubmit}
        style={styles.submitButton}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 10,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  addressBarContainer: {
    width: '100%',
    marginTop: 20,
  },
  submitButton: {
    width: '100%',
  },
});

export default StopCreation;
