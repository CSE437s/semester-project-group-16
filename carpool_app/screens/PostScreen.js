import React, { useState, useEffect } from "react";
import {
  View,
  Modal,
  ScrollView,
  Button,
  StyleSheet,
  Text,
  RefreshControl,
} from "react-native";
import Post from "../components/Post";
import PostCreation from "../components/PostCreation";
import CustomButton from "../components/CustomButton";
import { getUserRides, haversineDistance } from "../Utils";
import { getLocation } from "../components/MapComponent";
import PostFilters from "../components/PostFilters";

const PostScreen = () => {
  useEffect(() => {
    (async () => {
      const userTrips = await getUserRides("true");
      setTrips(userTrips);
      console.log("da useeffect");
      const location = await getLocation();
      setUserLocation(location);
    })();
  }, []);

  const [userLocation, setUserLocation] = useState(null);

  const [trips, setTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [showPostCreation, setShowPostCreation] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [distanceFilterAddress, setDistanceFilterAddress] = useState("");
  const categories = ["All", "Campus", "Groceries", "Misc"];

  const [filters, setFilters] = useState({
    selectedCategory: "All",
    distanceFilter: 10,
    dateFilter: null,
    distanceFilterAddress,
  });

  useEffect(() => {
    applyFilters();
  }, [
    filters.selectedCategory,
    userLocation,
    filters.distanceFilter,
    filters.dateFilter,
    trips,
    userLocation,
  ]); // Dependencies array includes all filter triggers

  function applyFilters() {
    let filtered = trips;
    const selectedCategory = filters.selectedCategory;
    const distanceFilter = filters.distanceFilter;
    const dateFilter = filters.dateFilter;
    console.log(`coordinates are  ${JSON.stringify(userLocation)}`);
    console.log(`address is ${filters.distanceFilterAddress}`);
    if (selectedCategory !== "All") {
      filtered = filterByCategory(filtered, selectedCategory);
    }
    if (userLocation && distanceFilter) {
      filtered = filterByDistance(filtered, userLocation, distanceFilter);
    }
    if (dateFilter) {
      filtered = filterByDate(filtered, dateFilter);
    }
    filtered = filterByHasPast(filtered);
    setFilteredTrips(filtered);
  }

  function filterByCategory(trips, category) {
    return trips.filter((trip) => trip.category === category);
  }

  function filterByHasPast(trips) {
    return trips.filter((trip) => !trip.isPast());
  }

  function filterByDate(trips, dateFilter) {
    return trips.filter((trip) => {
      const tripDate = new Date(trip.timestamp);

      return (
        tripDate.getFullYear() === dateFilter.getFullYear() &&
        tripDate.getMonth() === dateFilter.getMonth() &&
        tripDate.getDate() === dateFilter.getDate()
      );
    });
  }

  function filterByDistance(trips, coordinate, distance) {
    return trips.filter(
      (trip) =>
        haversineDistance(
          trip.route.destinationCoordinates,
          coordinate,
          true
        ) <= distance
    );
  }

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      const userTrips = await getUserRides("true");
      setTrips(userTrips);

      setRefreshing(false);
    } catch (error) {
      console.error("Error fetching user rides:", error);
      setRefreshing(false);
    }
  };

  // useEffect(() => {
  //   fetchTrips();
  // }, [selectedCategory, userLocation, distanceFilter]);

  return (
    <View style={styles.container}>
      <View style={styles.newRideContainer}>
        <CustomButton
          title="New Ride"
          onPress={() => setShowPostCreation(true)}
          style={styles.newRideButton}
        />
      </View>

      <ScrollView
        style={styles.postsContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredTrips.map((trip, index) => (
          <Post key={index} trip={trip} />
        ))}
        <View style={{ height: 30 }}></View>
      </ScrollView>

      <Modal visible={showPostCreation} animationType="slide">
        <PostCreation onClose={() => setShowPostCreation(false)} />
      </Modal>
      {showFilters ? (
        <PostFilters
          onClose={() => setShowFilters(false)}
          trips={trips}
          setFilteredTrips={setFilteredTrips}
          filters={filters}
          setFilters={setFilters}
          userLocation={userLocation}
          setUserLocation={setUserLocation}
        />
      ) : (
        <CustomButton title="Filter" onPress={() => setShowFilters(true)} />
      )}
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
    marginBottom: 10,
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
