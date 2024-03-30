import React from "react";
import styled from "styled-components";
import { checkUserExists, timestampToWrittenDate } from "../Utils";
import StopCreation from "./StopCreation";
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Modal,
  Picker,
  TouchableOpacity,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/Ionicons";
import ShowPost from "./ShowPost";

const Post = ({ trip, fromManageCarpools = false }) => {
  const [showPost, setShowPost] = useState(false);

  const handleApply = () => {
    setShowPost(true);
    const userObj = checkUserExists();
    const userId = userObj.uid;
  };

  const handleClose = () => {
    setShowPost(false);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handleApply}>
      <View style={styles.headerContainer}>
        <Text style={styles.category}>{trip.category}</Text>
        <Text style={styles.email}> - {trip.tripUserEmail}</Text>
      </View>

      <View style={styles.dateContainer}>
        <Text style={styles.timestamp}>
          {timestampToWrittenDate(trip.timestamp)}
        </Text>
        <Text style={styles.completed}>
          - {trip.isPast() ? "Past" : "Upcoming"}
        </Text>
      </View>

      <View
        style={[
          { display: "flex", flexDirection: "row", gap: 5 },
          (style = styles.addressContainer),
        ]}
      >
        <Icon name={"business-outline"} size={16} />
        <Text style={styles.address}> {trip.route.originAddress}</Text>
      </View>
      <View
        style={[
          { display: "flex", flexDirection: "row", gap: 5 },
          (style = styles.addressContainer),
        ]}
      >
        <Icon name={"flag-outline"} size={16} />
        <Text style={styles.address}> {trip.route.destinationAddress}</Text>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          margin: 10,
        }}
      ></View>
      <Modal visible={showPost} animationType="slide">
        <ShowPost
          trip={trip}
          onClose={handleClose}
          fromManageCarpools={fromManageCarpools}
        />
      </Modal>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "stretch",
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: "#FFFFFF",
    borderColor: "black",
    borderWidth: 0.5,
  },
  tripInfo: {
    flex: 1,
    backgroundColor: "pink",
  },
  routeInfo: {
    flex: 1,
    marginLeft: 20,
    backgroundColor: "pink",
  },
  label: {
    fontWeight: "bold",
    backgroundColor: "pink",
  },
  email: {
    fontFamily: "Poppins-SemiBold",
    height: "fit",
    marginTop: 3,
    color: "gray",
    marginLeft: 5,
  },
  completed: {
    fontFamily: "Poppins-SemiBold",
    height: "fit",
    marginTop: 0,
    color: "gray",
    marginLeft: 5,
  },
  address: {
    fontSize: 14,
    width: "90%",
    color: "gray",
  },
  addressContainer: {
    marginBottom: 6,
  },
  timestamp: {
    fontFamily: "Poppins-SemiBold",
  },
  category: {
    fontFamily: "Poppins-Black",
    color: "black",
    fontSize: 18,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 3,
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 10,
  },
});

export default Post;
