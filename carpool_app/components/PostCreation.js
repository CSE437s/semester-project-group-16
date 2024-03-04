import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Modal, TouchableOpacity, ScrollView} from 'react-native';
//import {Picker } from 'react-native-picker';
import { Picker } from '@react-native-picker/picker';
import AddressSearchBar from './AddressSearchBar'
import { REACT_APP_REMOTE_SERVER } from '@env';
import axios from 'axios'; 
import { checkUserExists } from '../Utils';
import ChooseDate from './ChooseDate';

const PostCreation = ({ onClose }) => {
  // Simplified state hooks for addresses
  const [startAddress, setStartAddress] = useState('');
  const [targetAddress, setTargetAddress] = useState('');
  const [date, setDate] = useState(new Date());
  const [category, setCategory] = useState('Campus');
  const [isPickerVisible, setIsPickerVisible] = useState(false);

  const togglePickerVisibility = () => {
    setIsPickerVisible(!isPickerVisible);
  };

  const handleSubmit = async () => {
    try {
      const user = checkUserExists();
      
      const timestamp = date.toISOString().slice(0, 19).replace('T', ' '); //Correct format for db entry
      const idToken = await user.getIdToken(true);
  
      const postData = {
        userId: user.uid,
        originAddress: startAddress,
        destinationAddress: targetAddress,
        timestamp: timestamp,
        category: category,
        completed: false,
      };
  
      const response = await axios.post(`${REACT_APP_REMOTE_SERVER}/trips`, postData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: idToken,
          userid: user.uid,
        },
      });
  
      if (response.status === 200) {
        console.log('Post created successfully!');
        onClose();
      } else {
        console.error('Failed to submit post:', response.data);
      }
    } catch (error) {
      console.error('Error submitting post:', error);
    }
  };

  return (
    <View style={styles.container}>
        <View style={styles.topContainer}>
          <Button title="Exit" onPress={onClose} />
        </View>
        <Text style={styles.headerText}>Starting Address:</Text>
        <AddressSearchBar handleTextChange={setStartAddress}/>

        <Text style={styles.headerText}>Destination Address:</Text>
        <AddressSearchBar handleTextChange={setTargetAddress}/>

        <Text style={styles.headerText}>When are you getting there?</Text>
        <ChooseDate setSelectedDate={setDate} />

        <Text style={styles.headerText}>Ride category:</Text>
        <TouchableOpacity onPress={togglePickerVisibility}>
          <Text style={styles.selectedValueText}>{category}</Text>
        </TouchableOpacity>
        {isPickerVisible && (
        <Picker
          selectedValue={category}
          onValueChange={(itemValue) => {
            setCategory(itemValue);
            togglePickerVisibility();
          }}
          style={styles.pickerStyle}
        >
          <Picker.Item label="Campus" value="Campus" />
          <Picker.Item label="Groceries" value="Groceries" />
          <Picker.Item label="Misc" value="Misc" />
        </Picker>
      )}
        <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0', 
  },
  scrollViewContainer: {
    padding: 60, 
  },
  topContainer: {
    flexDirection: 'row', 
    justifyContent: 'flex-end',
    paddingTop: 10, 
  },
  headerText: {
    fontSize: 18, 
    fontWeight: 'bold',
    color: '#333333',
    paddingTop: 10,
  },
  input: {
    borderWidth: 1, 
    borderColor: '#CCCCCC', 
    borderRadius: 5, 
    padding: 10, 
    fontSize: 16, 
    backgroundColor: '#FFFFFF', 
    marginBottom: 20, 
  },
  pickerStyle: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
  },
  buttonStyle: {
    backgroundColor: '#007BFF', 
    color: '#FFFFFF', 
    padding: 10,
    borderRadius: 5,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20, 
  },
});
export default PostCreation;
