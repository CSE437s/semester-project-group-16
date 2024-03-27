import React, { useState, useEffect } from "react";
import {
  Button,
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { fetchRideRequests } from "../Utils";
import {
  checkUserExists,
  acceptRideRequest,
  deleteRideRequest,
} from "../Utils";
import CustomButton from "./CustomButton.js";

const RequestMessage = ({ onClose, rideRequest, isYourRequest }) => {
  console.log(JSON.stringify(rideRequest));

  const onPressAccept = async () => {
    try {
      await acceptRideRequest(rideRequest);
      onClose();
    } catch (error) {
      console.log("Error accepting: ", error);
    }
  };
  const onPressDeny = async () => {
    try {
      await deleteRideRequest(rideRequest);
      onClose();
    } catch (error) {
      console.log("Error deleting: ", error);
    }
  };

  return (
    <View style={styles.container}>
      {isYourRequest ? (
        <Text style={styles.messageText}> You want to join this ride! </Text>
      ) : (
        <Text style={styles.messageText}>
          {" "}
          {rideRequest.userFullName} wants to join your ride!{" "}
        </Text>
      )}
      <View style={styles.requestButtons}>
        {!isYourRequest && (
          <CustomButton title="Accept" onPress={onPressAccept} />
        )}
        <CustomButton
          title={!isYourRequest ? "Deny Request" : "Cancel Request"}
          onPress={onPressDeny}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 60,
    padding: 20,
    width: "80%",
    height: "fit",
    borderColor: "black",
    borderRadius: 10,
    borderWidth: 1,
    alignSelf: "center",
    backgroundColor: "white",
  },
  requestButtons: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: "auto",
    gap: 20,
  },
  messageText: {
    fontFamily: "Poppins-SemiBold",
  },
});

export default RequestMessage;
