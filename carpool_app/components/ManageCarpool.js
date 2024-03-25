import React, { useEffect, useState , useCallback} from 'react';
import {Modal,View,Text,StyleSheet,ActivityIndicator,TouchableOpacity,ScrollView} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import CustomButton from './CustomButton';
import { Calendar } from 'react-native-calendars';
import {timestampToDate} from '../Utils';
import BackArrow from './BackArrow';
import Post from './Post';

const ManageCarpool = ({ userRides, onClose }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const newMarkedDates = userRides.reduce((acc, ride) => {
      const dateKey = timestampToDate(ride.timestamp);
      acc[dateKey] = { selected: true, marked: true, selectedColor: '#022940'};
      return acc;
    }, {});

    setMarkedDates(newMarkedDates);
    setModalVisible(true);
  }, [userRides]);

  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
  };
  const getRidesForSelectedDate = () => {
    return userRides.filter((ride) => {
      const rideDate = timestampToDate(ride.timestamp);
      return rideDate === selectedDate;
    });
  };
  const formattedSelectedDate = (selectedDate) => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + 1); // Add one day to fix calendar one-off error
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric', 
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.topView}>
      <BackArrow onClose={onClose} />
      <Text style={styles.headerText}>Manage My Carpools</Text>
      </View>
      <View style={styles.calendarContainer}>
        <Calendar

          theme={{
            backgroundColor: '#ffffff',
            calendarBackground: '#ffffff',
            textSectionTitleColor: '#b6c1cd',
            selectedDayBackgroundColor: '#00adf5',
            selectedDayTextColor: '#ffffff',
            todayTextColor: '#00adf5',
            dayTextColor: '#2d4150',
          }}
        

          markedDates={markedDates}
          onDayPress={onDayPress}
        />
        </View>
        <Text style={styles.infoText }>{formattedSelectedDate(selectedDate)} </Text>
        <ScrollView>
        {getRidesForSelectedDate().length == 0 && <Text style={styles.infoText }>You have no trips on this date!</Text>}
        {selectedDate && getRidesForSelectedDate().map((ride, index) => (
          <Post key={index} trip={ride} fromManageCarpools={true} />
        ))}
        </ScrollView>
    </View>
  );
};
 
const styles = StyleSheet.create({
  headerText: {
    alignSelf:'center',
    fontFamily:'Poppins-Black',
    fontSize:24,
  },
  topView: {
    display:'flex',
    flexDirection:'row',
    gap:15,
  },
  infoText: {
    alignSelf:'center',
    fontSize:18,
    fontFamily:'Poppins-SemiBold'
  },
  container: {  
    backgroundColor:'white',
    marginTop:60,
    flex:1,
  },
  calendarContainer: {
    width:'80%',
    alignSelf:'center',
  },

});
export default ManageCarpool;