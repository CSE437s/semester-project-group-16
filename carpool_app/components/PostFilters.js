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

function PostFilters({
  trips,
  setFilteredTrips,
  filters,
  setFilters,
  onClose,
  userLocation,
  setUserLocation,
}) {
  const [selectedCategory, setSelectedCategory] = useState(
    filters.selectedCategory
  );
  const [actualLocation, setActualLocation] = useState(null);
  const [distanceFilter, setDistanceFilter] = useState(filters.distanceFilter);
  const [dateFilter, setDateFilter] = useState(filters.dateFilter);
  const [distanceFilterAddress, setDistanceFilterAddress] = useState(
    filters.distanceFilterAddress
  );

  const maxDistance = 25;
  const stepSize = maxDistance <= 1 ? 0.1 : 1;
  const categories = ["All", "Campus", "Groceries", "Misc"];

  useEffect(() => {
    handleFiltersChange();
  }, [
    selectedCategory,
    distanceFilter,
    dateFilter,
    distanceFilterAddress,
    userLocation,
  ]);
  useEffect(() => {
    (async () => {
      const location = await getLocation();
      setActualLocation(location);
    })();
  }, []);

  const onChangeDate = (event, selectedDate) => {
    if (selectedDate) {
      setDateFilter(selectedDate);
    }
  };

  function handleFiltersChange() {
    setFilters({
      selectedCategory,
      distanceFilter,
      dateFilter,
      distanceFilterAddress,
      userLocation,
    });
  }

  function handleClearFilters() {
    setDistanceFilter(10);
    setSelectedCategory("All");
    setDateFilter(null);
    setUserLocation(actualLocation);
    setDistanceFilterAddress("");
    setFilters({
      selectedCategory: "All",
      distanceFilter: 10,
      dateFilter: null,
      distanceFilterAddress: "",
      userLocation: actualLocation,
    });
  }

  // Handler functions can just update state
  function handleDistanceChange(distance) {
    setDistanceFilter(distance);
  }

  function handleCategoryChange(category) {
    setSelectedCategory(category);
  }

  async function extractCoordinatesFromAddress(address) {
    setDistanceFilterAddress(address);
    const coordinateObject = await fetchCoordinatesFromAddress(address);
    setUserLocation(coordinateObject);
    console.log("address  + coords should be changed");
  }

  return (
    <Modal
      visible={true}
      animationType="slide"
      transparent={true}
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
              defaultText={distanceFilterAddress}
            />
            <Slider
              style={{ width: "100%", height: 40 }}
              minimumValue={1}
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
              value={dateFilter ? dateFilter : new Date()}
              mode="date"
              display="default"
              onChange={onChangeDate}
              style={styles.datePicker}
            />
          </View>
          <CustomButton title="Clear Filters" onPress={handleClearFilters} />
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
