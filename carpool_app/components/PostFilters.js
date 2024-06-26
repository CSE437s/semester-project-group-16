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
import Icon from "react-native-vector-icons/Ionicons";

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

  const maxDistance = 10;
  const stepSize = 0.25;
  const categories = ["All", "Campus", "Groceries", "Misc"];
  const [showDistanceFilter, setShowDistanceFilter] = useState(false);
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [displayDistance, setDisplayDistance] = useState(distanceFilter);

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
    setShowDateFilter(false);
    setShowDistanceFilter(false);
    setDistanceFilter(5);
    setSelectedCategory("All");
    setDateFilter(null);
    setUserLocation(actualLocation);
    setDistanceFilterAddress("");
    setFilters({
      selectedCategory: "All",
      distanceFilter: 5,
      dateFilter: null,
      distanceFilterAddress: "",
      userLocation: actualLocation,
    });
  }

  // Handler functions can just update state
  function handleDistanceChange(distance) {
    setDisplayDistance(distance);
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
            <TouchableOpacity
              style={styles.filterOpacity}
              onPress={() => setShowDistanceFilter(!showDistanceFilter)}
            >
              <Text style={styles.filterTitle}>Filter by destination</Text>
              {!showDistanceFilter ? (
                <Icon name="chevron-down-outline" size={24} color="gray" />
              ) : (
                <Icon name="chevron-up-outline" size={24} color="gray" />
              )}
            </TouchableOpacity>
            {showDistanceFilter && (
              <View style={styles.distanceFilterContent}>
                <AddressSearchBar
                  handleTextChange={extractCoordinatesFromAddress}
                  defaultText={distanceFilterAddress}
                />
                <Slider
                  style={{ width: "100%", height: 40 }}
                  minimumValue={0.25}
                  maximumValue={maxDistance}
                  step={stepSize}
                  value={distanceFilter}
                  onValueChange={(value) => handleDistanceChange(value)}
                  onSlidingComplete={(value) => setDistanceFilter(value)}
                  minimumTrackTintColor="#007bff"
                  maximumTrackTintColor="#d3d3d3"
                  thumbTintColor="#007bff"
                />
                <Text style={styles.filterLabel}>
                  {displayDistance.toFixed(2)} miles from{" "}
                  {(() =>
                    distanceFilterAddress == ""
                      ? "current location"
                      : "custom location")()}
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.filterOpacity}
              onPress={() => setShowDateFilter(!showDateFilter)}
            >
              <Text style={styles.filterTitle}>Filter by date</Text>
              {!showDateFilter ? (
                <Icon name="chevron-down-outline" size={24} color="gray" />
              ) : (
                <Icon name="chevron-up-outline" size={24} color="gray" />
              )}
            </TouchableOpacity>
            {showDateFilter && (
              <DateTimePicker
                testID="datePicker"
                value={dateFilter ? dateFilter : new Date()}
                mode="date"
                display="default"
                onChange={onChangeDate}
                style={styles.datePicker}
              />
            )}
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
  distanceFilterContent: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  filterOpacity: {
    width: "100%",
    height: 40,
    backgroundColor: "#D3D3D3",
    borderRadius: 8,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    margin: 10,
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
