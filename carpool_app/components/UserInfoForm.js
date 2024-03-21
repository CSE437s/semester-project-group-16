/*
What data to collect for new users
-----------------------------------

Full name

Age, DOB

Student ID

Phone number

Profile photo?
--would have to have path to image on EC2

Vehicle Make, Model, year
Seat capacity/preference (shouldn't display posts if ride is full)

Home address


*/
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Switch, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import BackArrow from './BackArrow';
import AddressSearchBar from './AddressSearchBar';
import CarInfoForm from './CarInfoForm';
import CustomButton from './CustomButton';
import {checkUserExists, getUserWithUserId} from '../Utils';
import {REACT_APP_REMOTE_SERVER} from '@env';
const NewUserForm = ({onClose}) => {
    const [fullName, setFullName] = useState('');
    const [studentId, setStudentId] = useState('');
    const [dob, setDob] = useState(new Date());
    const [phoneNumber, setPhoneNumber] = useState('');

    const [vehicleMake, setVehicleMake] = useState('');
    const [vehicleModel, setVehicleModel] = useState('');
    const [vehicleYear, setVehicleYear] = useState('');
    const [licensePlate, setLicensePlate] = useState('');
    const [seatCapacity, setSeatCapacity] = useState('');
    const [homeAddress, setHomeAddress] = useState('');

    const [vehicleInfoVisible, setVehicleInfoVisible] = useState(false);

    useEffect(() => {
        async function getUserInfo() {
            const user = checkUserExists();
            const userObj = await getUserWithUserId(user.uid);

            setFullName(userObj.full_name || '');
            setStudentId(userObj.student_id || '');
            setDob(userObj.dob ? new Date(userObj.dob) : new Date());
            setPhoneNumber(userObj.phone_number || '');
            
            setVehicleMake(userObj.vehicle_make || '');
            setVehicleModel(userObj.vehicle_model || '');
            setVehicleYear(userObj.vehicle_year || '');
            setLicensePlate(userObj.license_plate || '');
            setSeatCapacity(userObj.seat_capacity || '');
            setHomeAddress(userObj.home_address || '');
        }

        getUserInfo();

    }, []);

    function handleSubmit() {
        submitUserData();
    }

    function handleVehicleInfoChange(make, model, year, lp, seats) {
        setLicensePlate(lp);
        setVehicleMake(make);
        setVehicleModel(model);
        setVehicleYear(year);
        setSeatCapacity(seats);
    }
    const submitUserData = async () => {
        const user = checkUserExists();
        const userData = {
          userId:user.uid,
          fullName,
          studentId,
          dob: dob.toISOString(), 
          phoneNumber,
          vehicleInfo: {
            make: vehicleMake,
            model: vehicleModel,
            year: vehicleYear,
            licensePlate,
            seatCapacity,
          },
          homeAddress,
        };
        await updateUserInfo(userData, user, onClose);
    }

    const onChangeDate = (event, selectedDate) => {
        setDob(selectedDate);
    }
  
    return (
      <View style={styles.container}>
        <ScrollView style={{paddingBottom:200, marginBottom:100}}>
        <TextInput
          placeholder="Full Name"
          value={fullName}
          onChangeText={setFullName}
          style={styles.textInput}
        />
        <TextInput
          placeholder="Student ID"
          value={studentId}
          onChangeText={setStudentId}
          keyboardType="phone-pad"
          style={styles.textInput}
        />
        <View style={{display:'flex', alignItems: 'center', flexDirection:'row', gap:5}}>
        <Text style={styles.headerText}>Date of Birth</Text>
        <DateTimePicker
            testID="datePicker"
            value={dob}
            mode="date"
            display="default"
            onChange={onChangeDate}
            style={styles.datePicker}
        />
        </View>
        <TextInput
          placeholder="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="numeric"
          style={styles.textInput}
        />

        <Text style={styles.headerText}> Home Address </Text>
        <AddressSearchBar handleTextChange={setHomeAddress} defaultText={homeAddress}/>
        <View style={{display:'flex', alignItems: 'center', flexDirection:'row', gap:5}}>
            <Text style={styles.headerText}>{vehicleInfoVisible ? "I have a car" : "I do not have a car"}</Text>
            <Switch
            value={vehicleInfoVisible}
            onValueChange={(newValue) => setVehicleInfoVisible(newValue)}
            style={styles.switch}
            />
        </View>
        {vehicleInfoVisible && <CarInfoForm onVehicleInfoChange={handleVehicleInfoChange} make={vehicleMake} model={vehicleModel} year={vehicleYear} license={licensePlate} seat={seatCapacity}/>}
        <CustomButton title="Submit" onPress={handleSubmit} />
        </ScrollView>
        
      </View>
    );
  };

  async function updateUserInfo(userData, user, onClose) {
    const idToken = await user.getIdToken(true);
    const apiUrl = `${REACT_APP_REMOTE_SERVER}/users/info`;
    try {

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${idToken}`,
            userid: userData.userId,
          },
          body: JSON.stringify(userData), 
        });
    
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
    
        const jsonResponse = await response.json();
        console.log('Success:', jsonResponse);
        onClose();
      } catch (error) {
        console.error('Error:', error);
      }
    };

  
  const styles = StyleSheet.create({
    container: {
      justifyContent: 'center',
      padding: 20,
      gap:10,
    },
    input: {
      height: 40,
      marginVertical: 10,
      borderWidth: 1,
      padding: 10,
    },
    headerText: {
        fontSize: 18, 
        fontFamily:'Poppins-Black',
        paddingTop: 10,
      },
      textInput: {
        fontSize: 16, 
        padding: 10, 
        borderWidth: 1, 
        borderColor: '#ccc', 
        borderRadius: 5, 
        backgroundColor: '#fff', 
        marginBottom: 10, 
      },
  });
  
  export default NewUserForm;
