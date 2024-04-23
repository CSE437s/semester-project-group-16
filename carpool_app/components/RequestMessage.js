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
  timestampToWrittenDate,
} from "../Utils";
import Icon from "react-native-vector-icons/Ionicons";
import CustomButton from "./CustomButton.js";

const RequestMessage = ({ onClose, rideRequest, isYourRequest }) => {
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
          {rideRequest.userFullName} wants to join your ride!
        </Text>
      )}
      <View
        style={[
          {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            gap: 5,
          },
          styles.addressInfo,
        ]}
      >
        <Icon name={"alarm-outline"} size={16} />
        <Text style={styles.itemText}>
          {timestampToWrittenDate(rideRequest.timestamp)}
        </Text>
      </View>
      <View
        style={[
          {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            gap: 5,
          },
          styles.addressInfo,
        ]}
      >
        <Icon name={"business-outline"} size={16} />
        <Text style={styles.itemText}>{rideRequest.originAddress}</Text>
      </View>
      <View
        style={[
          {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            gap: 5,
            marginBottom: 10,
          },
          styles.addressInfo,
        ]}
      >
        <Icon name={"flag-outline"} size={16} />
        <Text style={styles.itemText}>{rideRequest.destinationAddress}</Text>
      </View>
      <View style={styles.requestButtons}>
        {!isYourRequest && (
          <CustomButton title="Accept" onPress={onPressAccept} />
        )}
        <CustomButton
          title={!isYourRequest ? "Deny Request" : "Cancel Request"}
          onPress={onPressDeny}
          buttonStyle={{ backgroundColor: "#fc5159" }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "fit",
    paddingTop: 20,
    paddingBottom: 20,
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
  },
  messageText: {
    alignSelf: "center",
    fontFamily: "Poppins-SemiBold",
  },
  item: {
    marginVertical: 8,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
    backgroundColor: "white",
  },
  itemText: {
    padding: 4,
    width: "80%",
    alignSelf: "center",
  },
});

export default RequestMessage;
