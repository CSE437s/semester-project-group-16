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
  Pressable,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getLocation } from "../components/MapComponent";
import Slider from "@react-native-community/slider";
import { haversineDistance, fetchCoordinatesFromAddress } from "../Utils";
import CustomButton from "./CustomButton";
import AddressSearchBar from "./AddressSearchBar";

function PostFilters({ trips, setFilteredTrips, onClose }) {
  const categories = ["All", "Campus", "Groceries", "Misc"];
  const [selectedCategory, setSelectedCategory] = useState("All");
  const maxDistance = 25; // Replace this with your maximum value
  const stepSize = maxDistance <= 1 ? 0.1 : 1;
  const [userLocation, setUserLocation] = useState(null);
  const [distanceFilter, setDistanceFilter] = useState(10);
  const [dateFilter, setDateFilter] = useState(new Date());

  useEffect(() => {
    (async () => {
      const location = await getLocation();
      setUserLocation(location);
    })();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [selectedCategory, userLocation, distanceFilter, dateFilter, trips]); // Dependencies array includes all filter triggers

  function applyFilters() {
    let filtered = trips;
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

  const onChangeDate = (event, selectedDate) => {
    if (selectedDate) {
      setDateFilter(selectedDate);
    }
  };

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

  async function extractCoordinatesFromAddress(address) {
    const coordinateObject = await fetchCoordinatesFromAddress(address);
    setUserLocation(coordinateObject);
  }

  return (
    <Modal
      visible={true}
      animationType="slide"
      transparent={true} // Ensure this is set to true for styling to work
      onRequestClose={onClose}
    >
      <Pressable
        style={styles.outsideModal}
        onPress={(event) => {
          if (event.target == event.currentTarget) {
            onClose();
          }
        }}
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
              Distance filter: {distanceFilter.toFixed(1)} miles
            </Text>
            <AddressSearchBar
              handleTextChange={extractCoordinatesFromAddress}
            />
            <Slider
              style={{ width: "100%", height: 40 }}
              minimumValue={0}
              maximumValue={maxDistance}
              step={stepSize}
              value={distanceFilter}
              onValueChange={(value) => setDistanceFilter(value)}
              onSlidingComplete={(value) => handleDistanceChange(value)}
              minimumTrackTintColor="#007bff"
              maximumTrackTintColor="#d3d3d3"
              thumbTintColor="#007bff"
            />
            <DateTimePicker
              testID="datePicker"
              value={dateFilter}
              mode="date"
              display="default"
              onChange={onChangeDate}
              style={styles.datePicker}
            />
          </View>
        </View>
      </Pressable>
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
  outsideModal: {
    flex: 1,
  },
});

export default PostFilters;
