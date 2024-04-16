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
import { getUserRides, haversineDistance } from '../Utils';
import Slider from '@react-native-community/slider';
import { getLocation } from '../components/MapComponent';

// Categories for filtering
const categories = ['All', 'Campus', 'Groceries', 'Misc'];

const PostScreen = () => {
  const maxDistance = 50;
  const [userLocation, setUserLocation] = useState(null);
  const [distanceFilter, setDistanceFilter] = useState(10);
  const [trips, setTrips] = useState([]);
  const [showPostCreation, setShowPostCreation] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All'); // State for selected category

  useEffect(() => {
    (async () => {
      const location = await getLocation();
      setUserLocation(location);
    })();
  }, []);

  const fetchTrips = async () => {
    try {
      const userTrips = await getUserRides('true');
      const now = new Date();

      // Filter based on selected category, distance, and whether the trip is in the past
      const filteredTrips = userTrips.filter((trip) => {
        const isFutureTrip = !trip.isPast();
        // Calculate the distance from the user's location to the trip's destination
        const distance =
          userLocation && trip.route.destinationCoordinates
            ? haversineDistance(
                userLocation,
                trip.route.destinationCoordinates,
                true
              )
            : Infinity;

        return (
          isFutureTrip &&
          (selectedCategory === 'All' || trip.category === selectedCategory) &&
          distance <= distanceFilter
        );
      });

      setTrips(filteredTrips);
    } catch (error) {
      console.error('Error fetching user rides:', error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTrips();
    }, 500);
    return () => clearTimeout(timer);
  }, [selectedCategory, userLocation, distanceFilter]);

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

      <View style={styles.filterContainer}>
        <Text
          style={{
            fontFamily: 'Poppins-SemiBold',
            fontSize: 16,
            alignSelf: 'center',
          }}
        >
          Distance filter: {Math.round(distanceFilter)} miles
        </Text>
        <Slider
          style={{ width: '100%', height: 40 }}
          minimumValue={1}
          maximumValue={maxDistance}
          value={distanceFilter}
          onValueChange={(value) => setDistanceFilter(value)}
          minimumTrackTintColor="#007bff"
          maximumTrackTintColor="#d3d3d3"
          thumbTintColor="#007bff"
        />
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
  filterButton: {
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
    marginLeft: 20,
    marginRight: 20,
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
  newRideContainer: {
    marginTop: 10,
    marginLeft: 15,
    marginRight: 15,
  },
});

export default PostScreen;
