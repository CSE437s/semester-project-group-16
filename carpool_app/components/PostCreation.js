import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Modal, TouchableOpacity, ScrollView} from 'react-native';
//import {Picker } from 'react-native-picker';
import { Picker } from '@react-native-picker/picker';

import { REACT_APP_REMOTE_SERVER } from '@env';
import axios from 'axios'; 
import { checkUserExists } from '../Utils';

const PostCreation = ({ onClose }) => {
  // Simplified state hooks for addresses
  const [startAddress, setStartAddress] = useState('');
  const [targetAddress, setTargetAddress] = useState('');
  const [hour, setHour] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('Campus');

  const handleSubmit = async () => {
    try {
      const user = checkUserExists();
      console.log("URL: " + REACT_APP_REMOTE_SERVER);
      
      // Use the simplified address fields directly
      const dateTime = `${date} ${hour}`;
      const idToken = await user.getIdToken(true);
  
      const postData = {
        userId: user.uid,
        originAddress: startAddress,
        destinationAddress: targetAddress,
        timestamp: dateTime,
        category: category,
        completed: false,
      };
  
      console.log('Post Data:', postData);
  
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
  
  // Example styles for your components
  const styles = StyleSheet.create({
    container: {},
    scrollViewContainer: {},
    topContainer: {},
    headerText: {},
    input: {},
    pickerStyle: {},
  });

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.topContainer}>
          <Button title="Exit" onPress={onClose} />
        </View>
        <Text style={styles.headerText}>Starting Address:</Text>
        <TextInput
          style={styles.input}
          value={startAddress}
          onChangeText={text => setStartAddress(text)}
          placeholder="Full address"
        />
        <Text style={styles.headerText}>Target Address:</Text>
        <TextInput
          style={styles.input}
          value={targetAddress}
          onChangeText={text => setTargetAddress(text)}
          placeholder="Full address"
        />
        {/* Other inputs remain unchanged */}
        <Text style={styles.headerText}>Date:</Text>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          value={date}
          onChangeText={text => setDate(text)}
        />
        <Text style={styles.headerText}>Hour:</Text>
        <TextInput
          style={styles.input}
          placeholder="HH:MM:SS"
          value={hour}
          onChangeText={text => setHour(text)}
        />
        <Text style={styles.headerText}>Category:</Text>
        <Picker
          selectedValue={category}
          onValueChange={(itemValue) => setCategory(itemValue)}
          style={styles.pickerStyle}
        >
          <Picker.Item label="Campus" value="Campus" />
          <Picker.Item label="Groceries" value="Groceries" />
          <Picker.Item label="Misc" value="Misc" />
        </Picker>
        <Button title="Submit" onPress={handleSubmit} />
      </ScrollView>
    </View>
  );
};

export default PostCreation;