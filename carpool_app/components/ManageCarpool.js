import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { timestampToDate } from '../Utils';
import Post from './Post';

const ManageCarpool = ({ userRides, onClose }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today's date to remove the time part

    const newMarkedDates = userRides.reduce((acc, ride) => {
      const dateKey = timestampToDate(ride.timestamp);
      const rideDate = new Date(ride.timestamp);
      rideDate.setHours(0, 0, 0, 0); // Normalize ride's date to remove the time part

      if (rideDate < today) {
        // Mark past dates with grey
        acc[dateKey] = {
          marked: true,
          dotColor: '#d3d3d3',
          selectedColor: '#d3d3d3',
        };
      } else {
        // Future dates get the blue color
        acc[dateKey] = {
          marked: true,
          selected: true,
          selectedColor: '#022940',
        };
      }
      return acc;
    }, {});
    setMarkedDates(newMarkedDates);
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
        <Text style={styles.headerText}>My Carpools</Text>
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
      <Text style={styles.infoText}>
        {formattedSelectedDate(selectedDate)}{' '}
      </Text>
      <ScrollView>
        {getRidesForSelectedDate().length == 0 && (
          <Text style={styles.infoText}>You have no trips on this date!</Text>
        )}
        {selectedDate &&
          getRidesForSelectedDate().map((ride, index) => (
            <Post key={index} trip={ride} fromManageCarpools={true} />
          ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  headerText: {
    textAlign: 'center',
    fontFamily: 'Poppins-Black',
    fontSize: 24,
  },
  topView: {
    marginTop: 30, // Move marginTop from container to here for better spacing control
    marginBottom: 10,
  },
  infoText: {
    alignSelf: 'center',
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
  },
  container: {
    backgroundColor: 'white',
    marginTop: 10,
    flex: 1,
  },
  calendarContainer: {
    width: '80%',
    alignSelf: 'center',
    marginBottom: 30,
  },
});
export default ManageCarpool;
