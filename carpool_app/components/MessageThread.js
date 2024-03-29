import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import BackArrow from "./BackArrow";
import { fetchRideRequests, checkUserExists } from "../Utils";
import RequestMessage from "./RequestMessage";

const MessageThread = ({ onClose, rideRequest }) => {
  const user = checkUserExists();
  console.log(`messagethread: ${JSON.stringify(rideRequest)}`);

  return (
    <View style={styles.container}>
      <BackArrow onClose={onClose} />
      <RequestMessage
        onClose={onClose}
        rideRequest={rideRequest}
        isYourRequest={rideRequest.outgoingUserId == user.uid}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 60,
    flex: 1,
    padding: 20,
  },
});

export default MessageThread;
