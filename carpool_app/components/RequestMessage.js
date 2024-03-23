import React, { useState, useEffect } from 'react';
import { Button, View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { fetchRideRequests } from '../Utils';
import {checkUserExists, acceptRideRequest, deleteRideRequest } from '../Utils';

const RequestMessage = ({onClose, rideRequest, isYourRequest }) => {

    const onPressAccept = async() => {
        try {
            await acceptRideRequest(rideRequest);
            onClose();
        } catch(error) {
            console.log("Error accepting: ", error);
        }
    }
    const onPressDeny = async() => {
        try {
            await deleteRideRequest(rideRequest);
            onClose();
        } catch(error) {
            console.log("Error deleting: ", error);
        }
    }

  return (
    <View style={styles.container}>
        <Text> User wants to join your ride! </Text>
        <Text>{rideRequest.rideRequestId}</Text>
        {!isYourRequest && <Button title="Accept" onPress={onPressAccept} />}
        <Button title={!isYourRequest ? "Deny": "Cancel"} onPress={onPressDeny} />

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

export default RequestMessage;