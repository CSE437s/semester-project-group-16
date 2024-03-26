import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { getUserRides, timestampToDate } from '../Utils'; // Ensure this is correctly imported
import ManageCarpool from '../components/ManageCarpool';

const ScheduleScreen = () => {
  const [scheduledRides, setScheduledRides] = useState([]);
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const fetchAndMarkRides = async () => {
      try {
        const rides = await getUserRides(false);
        const newMarkedDates = {};

        rides.forEach((ride) => {
          const dateStr = timestampToDate(ride.timestamp);
          if (dateStr) {
            newMarkedDates[dateStr] = {
              marked: true,
              dots: [{ color: 'blue' }],
            };
          }
          console.log(ride);
        });

        setMarkedDates(newMarkedDates);
        setScheduledRides(rides);
      } catch (error) {
        console.error('Failed to fetch and mark scheduled rides:', error);
      }
    };

    fetchAndMarkRides();
  }, []);
  return <ManageCarpool userRides={scheduledRides} />;
};

export default ScheduleScreen;
