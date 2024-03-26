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
      const filteredTrips =
        selectedCategory === 'All'
          ? userTrips
          : userTrips.filter((trip) => trip.category === selectedCategory);
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
            color={selectedCategory === category ? 'blue' : 'gray'}
            style={styles.filterButton}
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
    marginTop: 20,
  },
  filterButton:{
    backgroundColor: 'pink',
    fontFamily: 'Poppins-Black',
  },
  newRideContainer: {
    paddingHorizontal: 10,
  },
  newRideButton: {
    marginBottom: 10, 
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap', 
    paddingTop: 3,
    fontFamily: 'Poppins-SemiBold',
  },
  filterTitle: {
    marginRight: 10,
    fontSize: 16, 
    alignSelf: 'center',
    fontFamily: 'Poppins-SemiBold',
  },
  postsContainer: {
    marginTop: 5,
  },
  newRideContainer:{
    marginTop: 10
  }
});

export default PostScreen;
