import React, { useState } from 'react';
import {checkUserExists} from '../Utils';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { REACT_APP_REMOTE_SERVER } from '@env';
import axios from 'axios'; 

  const StopCreation = ({ onClose, tripRouteId, tripId }) => {
    const [streetAddress, setStreetAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');
  
    const handleSubmit = async () => {
      const address = `${streetAddress}, ${city}, ${state} ${zipCode}`;
      const userObj = checkUserExists();
      const userId = userObj.uid;
      const idToken = await userObj.getIdToken(true);
  
    //   console.log("Trip Route ID:", tripRouteId);
    //   console.log("User ID:", userId);
    //   console.log("Adress", address);
  
    // Make endpoint request with address, userId, and tripRouteId using Axios
    try {
        const response = await axios.post(`${REACT_APP_REMOTE_SERVER}/stops`, {
          userId: userId,
          routeId: tripRouteId,
          tripId: tripId,
          stopAddress: address,
        }, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `${idToken}`,
            userid: userId,
            }
        });

        console.log("Response:", response);
  
        if (response.status === 200) {
          console.log('Post created successfully!');
          onClose();
        } else {
          console.error('Failed to submit post:', response.data);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

  const handleCancel = () => {
    onClose();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Pickup Location:</Text>
      <TextInput
        style={styles.input}
        value={streetAddress}
        onChangeText={text => setStreetAddress(text)}
        placeholder="Street Address"
      />
      <TextInput
        style={styles.input}
        value={city}
        onChangeText={text => setCity(text)}
        placeholder="City"
      />
      <TextInput
        style={styles.input}
        value={state}
        onChangeText={text => setState(text)}
        placeholder="State"
      />
      <TextInput
        style={styles.input}
        value={zipCode}
        onChangeText={text => setZipCode(text)}
        placeholder="Zip Code"
      />
      <View style={styles.buttonContainer}>
        <Button title="Cancel" onPress={handleCancel} color="red" />
        <Button title="Submit" onPress={handleSubmit} />
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerText: {
      fontSize: 20,
      marginBottom: 10,
    },
    input: {
      width: '80%',
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 10,
      paddingHorizontal: 10,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      width: '20%',
      marginTop: 20,
    },
  });
export default StopCreation;
