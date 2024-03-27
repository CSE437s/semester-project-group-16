import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Modal, TouchableOpacity, ScrollView} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AddressSearchBar from './AddressSearchBar'
import { REACT_APP_REMOTE_SERVER } from '@env';
import axios from 'axios'; 
import { checkUserExists } from '../Utils';
import ChooseDate from './ChooseDate';
import BackArrow from './BackArrow';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomPicker from './CustomPicker';
import CustomButton from './CustomButton';

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

      //Define function in Utils
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
        <BackArrow onClose={onClose} />

        <View style={{display:'flex', alignItems: 'center', flexDirection:'row', gap:5}}>
          <Icon name={"business-outline"} size={20}/>
          <Text style={styles.headerText}>Starting Address</Text>
        </View>

        <AddressSearchBar handleTextChange={setStartAddress}/>

        <View style={{display:'flex', alignItems: 'center', flexDirection:'row', gap:5}}>
          <Icon name={"flag-outline"} size={20}/>
          <Text style={styles.headerText}>Destination Address</Text>
        </View>
        <AddressSearchBar handleTextChange={setTargetAddress}/>

        <View style={{display:'flex', alignItems: 'center', flexDirection:'row', gap:5}}>
          <Icon name={"alarm-outline"} size={20}/>
          <Text style={styles.headerText}>Time of Arrival</Text>
        </View>

        <ChooseDate date={date} setDate={setDate}/>

        <View style={{display:'flex', alignItems: 'center', flexDirection:'row', gap:5}}>
          <Icon name={"map-outline"} size={20}/>
          <Text style={styles.headerText}>Category</Text>
        </View>
          <CustomPicker category={category} setCategory={setCategory} />
        <CustomButton title="Submit" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop:60,
    margin:20,
    gap:5,
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
    fontFamily:'Poppins-Black',
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
