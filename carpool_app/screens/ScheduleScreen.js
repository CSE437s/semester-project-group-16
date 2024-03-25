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

const ScheduleScreen = () => {
  const [scheduledRides, setScheduledRides] = useState([]);
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const fetchAndMarkRides = async () => {
      try {
        const rides = await getUserRides(true); // Or false depending on your needs
        const newMarkedDates = {};

        rides.forEach((ride) => {
          const dateStr = timestampToDate(ride.timestamp);
          if (dateStr) {
            newMarkedDates[dateStr] = {
              marked: true,
              dots: [{ color: 'blue' }],
            };
          }
        });

        setMarkedDates(newMarkedDates);
        setScheduledRides(rides);
      } catch (error) {
        console.error('Failed to fetch and mark scheduled rides:', error);
      }
    };

    fetchAndMarkRides();
  }, []);

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    setIsModalVisible(true);
  };

  const renderRideItem = ({ item }) => (
    <View style={styles.rideItem}>
      <Text>Ride to {item.destinationAddress}</Text>
      <Text>Time: {item.time}</Text>
      {/* Render additional details as required */}
    </View>
  );

  // Filter rides for the selected date
  const ridesForSelectedDate = scheduledRides.filter(
    (ride) => timestampToDate(ride.timestamp) === selectedDate
  );

  return (
    <View style={styles.container}>
      <Calendar onDayPress={handleDayPress} markedDates={markedDates} />

      <Modal
        animationType="slide"
        transparent={false}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Rides for {selectedDate}</Text>
          <FlatList
            data={ridesForSelectedDate}
            keyExtractor={(item, index) =>
              item.id ? item.id.toString() : index.toString()
            }
            renderItem={renderRideItem}
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setIsModalVisible(false)}
          >
            <Text>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  modalView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: 'lightgrey',
    padding: 10,
    margin: 20,
  },
  rideItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  // Define other styles as needed
});

export default ScheduleScreen;
