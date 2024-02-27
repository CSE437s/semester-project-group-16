import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Modal, Picker, TouchableOpacity } from 'react-native';
import { BASE_URL } from '@env';
import axios from 'axios'; 

const PostCreation = ({ onClose }) => {
  const [startStreetAddress, setStartStreetAddress] = useState('');
  const [startCity, setStartCity] = useState('');
  const [startState, setStartState] = useState('');
  const [startZipCode, setStartZipCode] = useState('');
  const [targetStreetAddress, setTargetStreetAddress] = useState('');
  const [targetCity, setTargetCity] = useState('');
  const [targetState, setTargetState] = useState('');
  const [targetZipCode, setTargetZipCode] = useState('');
  const [hour, setHour] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('Campus'); 

  const handleSubmit = async () => {
    try {
      const startAddress = `${startStreetAddress}, ${startCity}, ${startState} ${startZipCode}`;
      const targetAddress = `${targetStreetAddress}, ${targetCity}, ${targetState} ${targetZipCode}`;
      const dateTime = `${date} ${hour}`;
  
      const postData = {
        startAddress,
        targetAddress,
        dateTime,
        category,
      };
  
      console.log('Post Data:', postData);
  
      const response = await axios.post(`${BASE_URL}/submitPost`, postData);
  
      if (response.status === 200) {
        console.log('Post submitted successfully!');
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
      <Text>Starting Destination:</Text>
      <TextInput
        style={styles.input}
        value={startStreetAddress}
        onChangeText={text => setStartStreetAddress(text)}
        placeholder="Street Address"
      />
      <TextInput
        style={styles.input}
        value={startCity}
        onChangeText={text => setStartCity(text)}
        placeholder="City"
      />
      <TextInput
        style={styles.input}
        value={startState}
        onChangeText={text => setStartState(text)}
        placeholder="State"
      />
      <TextInput
        style={styles.input}
        value={startZipCode}
        onChangeText={text => setStartZipCode(text)}
        placeholder="Zip Code"
      />
      <Text>Target Destination:</Text>
      <TextInput
        style={styles.input}
        value={targetStreetAddress}
        onChangeText={text => setTargetStreetAddress(text)}
        placeholder="Street Address"
      />
      <TextInput
        style={styles.input}
        value={targetCity}
        onChangeText={text => setTargetCity(text)}
        placeholder="City"
      />
      <TextInput
        style={styles.input}
        value={targetState}
        onChangeText={text => setTargetState(text)}
        placeholder="State"
      />
      <TextInput
        style={styles.input}
        value={targetZipCode}
        onChangeText={text => setTargetZipCode(text)}
        placeholder="Zip Code"
      />
      <Text>Date:</Text>
      <TextInput
        style={styles.input}
        placeholder="YYYY-MM-DD"
        value={date}
        onChangeText={text => setDate(text)}
      />
      <Text>Hour:</Text>
      <TextInput
        style={styles.input}
        placeholder="HH:MM:SS"
        value={hour}
        onChangeText={text => setHour(text)}
      />
      <Text>Category:</Text>
      <Picker
        selectedValue={category}
        onValueChange={(itemValue) => setCategory(itemValue)}
      >
        <Picker.Item label="Campus" value="Campus" />
        <Picker.Item label="Groceries" value="Groceries" />
        <Picker.Item label="Misc" value="Misc" />
      </Picker>
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  topContainer: {
    position: 'absolute',
    top: 20, 
    right: 20, 
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: '100%',
  },
});

export default PostCreation;

