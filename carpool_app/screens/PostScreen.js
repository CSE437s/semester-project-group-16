import React, { useState, useEffect } from 'react';
import {
  View,
  Modal,
  ScrollView,
  Button,
  StyleSheet,
  Text,
} from 'react-native';
import Post from '../components/Post';
import PostCreation from '../components/PostCreation';
import CustomButton from '../components/CustomButton';
import { getUserRides } from '../Utils';

// Categories for filtering
const categories = ['All', 'Campus', 'Groceries', 'Misc'];

const PostScreen = () => {
  const [trips, setTrips] = useState([]);
  const [showPostCreation, setShowPostCreation] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All'); // State for selected category

  const fetchTrips = async () => {
    try {
      const userTrips = await getUserRides('true');
      // Filter trips based on selected category
      const upcomingTrips = userTrips.filter(trip => !trip.isPast());
      const filteredTrips =
        selectedCategory === 'All'
          ? upcomingTrips
          : upcomingTrips.filter((trip) => trip.category === selectedCategory);
      setTrips(filteredTrips);
    } catch (error) {
      console.error('Error fetching user rides:', error);
    }
  };

  useEffect(() => {
    fetchTrips(); // Fetch trips whenever the selected category changes
  }, [selectedCategory]);

  return (
    <View style={styles.container}>
      {/* "New Ride" Button */}
      <View style={styles.newRideContainer}>
        <CustomButton
          title="New Ride"
          onPress={() => setShowPostCreation(true)}
          style={styles.newRideButton}
        />
      </View>

      {/* Filter UI */}
      <View style={styles.filterContainer}>
        <Text style={styles.filterTitle}>Filter by:</Text>
        {categories.map((category) => (
          <Button
            key={category}
            title={category}
            onPress={() => setSelectedCategory(category)}
            color={selectedCategory === category ? 'blue' : 'gray'} // Highlight the selected category
          />
        ))}
      </View>

      <ScrollView style={styles.postsContainer}>
        {trips.map((trip, index) => (
          <Post key={index} trip={trip} />
        ))}
        <View style={{ height: 30 }}></View>
      </ScrollView>

      <Modal visible={showPostCreation} animationType="slide">
        <PostCreation onClose={() => setShowPostCreation(false)} />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 60,
  },
  newRideContainer: {
    paddingHorizontal: 10,
  },
  newRideButton: {
    marginBottom: 10, // Adjust as needed
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
    flexWrap: 'wrap', // Ensure filters wrap if screen width is too narrow
  },
  filterTitle: {
    marginRight: 10, // Adjust as needed
    fontSize: 16, // Adjust as needed
    alignSelf: 'center',
  },
  postsContainer: {
    marginTop: 5,
  },
});

export default PostScreen;
