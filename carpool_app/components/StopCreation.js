import React, { useState } from 'react';
import {checkUserExists} from '../Utils';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { REACT_APP_REMOTE_SERVER } from '@env';
import axios from 'axios'; 
import AddressSearchBar from './AddressSearchBar';

  const StopCreation = ({ onClose, tripRouteId, tripId }) => {
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');
  
    const handleSubmit = async () => {
      const userObj = checkUserExists();
      const userId = userObj.uid;
      const idToken = await userObj.getIdToken(true);
  
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
      <AddressSearchBar handleTextChange={setAddress} />

      <View style={styles.buttonContainer}>
        <Button title="Cancel" onPress={handleCancel} color="red" />
        <Button title="Submit" onPress={handleSubmit} />
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
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
    container: {
      marginTop:120,
      height:200,
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      width: '80%',
      marginTop: 20,
    },
  });
export default StopCreation;
