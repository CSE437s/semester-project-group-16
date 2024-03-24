import React, { useEffect, useState , useCallback} from 'react';
import {Modal,View,Text,StyleSheet,ActivityIndicator,TouchableOpacity} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import CustomButton from './CustomButton';
import { Calendar } from 'react-native-calendars';
import {timestampToDate} from '../Utils';

function ManageCarpool({userRides}) {
    const [modalVisible, setModalVisible] = useState(false);
    const [markedDates, setMarkedDates] = useState({});


    const onManageCarpoolsPress = () => {
      const newMarkedDates = userRides.reduce((acc, ride) => {
        const dateKey = timestampToDate(ride.timestamp);
        acc[dateKey] = { selected: true, marked: true, selectedColor: 'blue'};
        return acc;
      }, {});
    
      setMarkedDates(newMarkedDates);
      setModalVisible(true);
    };
    console.log(`Carpools in manage carpool: ${JSON.stringify(userRides)}`);
    console.log(`Marked dates: ${JSON.stringify(markedDates)}`);

    return (
    <>
    <CustomButton onPress={onManageCarpoolsPress} title={"My Carpools"} iconName={"car-outline"}/>

    <Modal animationType="slide" transparent={true} visible={modalVisible}
    onRequestClose={() => setModalVisible(!modalVisible)}>
        <View style={styles.centeredView}>
            <View style={styles.modalView}>
            <Text style={styles.modalText}>Manage Carpools</Text>
            <Calendar markedDates={markedDates} />

            <CustomButton onPress={() => setModalVisible(false)} title={"Close"} />

            </View>
        </View>
    </Modal>
    </>
    );

}
 
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: 'bold', 
    fontSize: 20, 
  },
  buttonStyle: {
    backgroundColor: '#022940', 
    padding: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop: 20, 
  },
  buttonTextStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
export default ManageCarpool;