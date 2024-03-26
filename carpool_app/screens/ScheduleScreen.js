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
        const rides = await getUserRides(false); // Or false depending on your needs
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
  return (<ManageCarpool userRides={scheduledRides} />);

  const renderRideItem = ({ item }) => (
    <View style={styles.rideItem}>
      <Text>
        Ride from {item.route.originAddress} to {item.route.destinationAddress}
      </Text>
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
    marginTop: 60,
    flex: 1,
    padding: 20,
  },
  modalView: {
    marginTop: '20%',
    marginBottom: '20%',
    marginHorizontal: '5%',
    backgroundColor: 'white', // Assuming you want a white background for the modal
    borderRadius: 20, // If you want rounded corners for the modal
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontFamily: 'Poppins-Black', // Assuming you're using the same font family
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#007bff',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    margin: 20,
  },
  rideItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 20,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 5,
  },
  email: {
    // This style might not be used in ScheduleScreen, but included for consistency
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    margin: 8,
  },
  timestamp: {
    fontSize: 22,
    fontFamily: 'Poppins-Black',
    padding: 16,
  },
  address: {
    fontSize: 16, // Adjusted to match detailText size for consistency
    margin: 5,
  },
  // Add any other styles from ShowPost you want to include
});

export default ScheduleScreen;
