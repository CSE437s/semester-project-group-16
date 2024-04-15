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

// Categories for filtering
const categories = ["All", "Campus", "Groceries", "Misc"];

const PostScreen = () => {
  useEffect(() => {
    (async () => {
      const userTrips = await getUserRides("true");
      setTrips(userTrips);
    })();
  }, []);

  const [trips, setTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [showPostCreation, setShowPostCreation] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

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
