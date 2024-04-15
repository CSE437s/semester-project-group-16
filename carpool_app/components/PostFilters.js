import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { getLocation } from "../components/MapComponent";
import Slider from "@react-native-community/slider";
import { haversineDistance } from "../Utils";
import CustomButton from "./CustomButton";

function PostFilters({ trips, setFilteredTrips, onClose }) {
  const categories = ["All", "Campus", "Groceries", "Misc"];
  const [selectedCategory, setSelectedCategory] = useState("All");
  const maxDistance = 50;
  const [userLocation, setUserLocation] = useState(null);
  const [distanceFilter, setDistanceFilter] = useState(10);

  useEffect(() => {
    (async () => {
      const location = await getLocation();
      setUserLocation(location);
    })();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [selectedCategory, userLocation, distanceFilter, trips]); // Dependencies array includes all filter triggers

  function applyFilters() {
    let filtered = trips;
    if (selectedCategory !== "All") {
      filtered = filterByCategory(filtered, selectedCategory);
    }
    if (userLocation && distanceFilter) {
      filtered = filterByDistance(filtered, userLocation, distanceFilter);
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

  // Handler functions can just update state
  function handleDistanceChange(distance) {
    setDistanceFilter(distance);
  }

  function handleCategoryChange(category) {
    setSelectedCategory(category);
  }

  /*
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
          (selectedCategory === "All" || trip.category === selectedCategory) &&
          distance <= distanceFilter
        );
      });
  */
  return (
    <Modal
      visible={true}
      animationType="slide"
      transparent={true} // Ensure this is set to true for styling to work
      onRequestClose={onClose}
    >
      <View style={styles.modalView}>
        <View style={styles.filterContainer}>
          <Text style={styles.filterTitle}>Filter by:</Text>
          {categories.map((category) => (
            <Button
              key={category}
              title={category}
              onPress={() => setSelectedCategory(category)}
              color={selectedCategory === category ? "blue" : "gray"}
              style={styles.filterButton}
            />
          ))}
        </View>

        <View style={styles.filterContainer}>
          <Text style={styles.filterLabel}>
            Distance filter: {Math.round(distanceFilter)} miles
          </Text>
          <Slider
            style={{ width: "100%", height: 40 }}
            minimumValue={1}
            maximumValue={maxDistance}
            value={distanceFilter}
            onValueChange={(value) => setDistanceFilter(value)}
            onSlidingComplete={(value) => handleDistanceChange(value)}
            minimumTrackTintColor="#007bff"
            maximumTrackTintColor="#d3d3d3"
            thumbTintColor="#007bff"
          />
          <Button title="Hide filters" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalView: {
    position: "absolute",
    width: "100%",
    height: "50%",
    bottom: 0,
    backgroundColor: "white",
    borderColor: "black",
    borderTopWidth: 3,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    paddingTop: 3,
    fontFamily: "Poppins-SemiBold",
    marginLeft: 20,
    marginRight: 20,
  },
  filterTitle: {
    marginRight: 10,
    fontSize: 16,
    alignSelf: "center",
    fontFamily: "Poppins-SemiBold",
  },
  filterButton: {
    backgroundColor: "pink",
    fontFamily: "Poppins-Black",
  },
});

export default PostFilters;
