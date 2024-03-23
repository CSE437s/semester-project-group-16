import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import BackArrow from './BackArrow';
import { fetchRideRequests } from '../Utils';

const Inbox = ({ onClose }) => {
  const [incomingMessages, setIncomingMessages] = useState([]);
  const [outgoingMessages, setOutgoingMessages] = useState([]);
  const [isIncomingSelected, setIsIncomingSelected] = useState(true); // true for Incoming, false for Outgoing

  useEffect(() => {
    const getMessages = async () => {
      const response = await fetchRideRequests();
      console.log(`response: ${response}`);
      setIncomingMessages(response.incomingRequests);
      setOutgoingMessages(response.outgoingRequests);
    };
    getMessages();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text>{item.rideRequestId}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <BackArrow onClose={onClose} />
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => setIsIncomingSelected(!isIncomingSelected)}
      >
        <Text>{isIncomingSelected ? "Show Outgoing" : "Show Incoming"}</Text>
      </TouchableOpacity>
      <FlatList
        data={isIncomingSelected ? incomingMessages : outgoingMessages}
        renderItem={renderItem}
        keyExtractor={(item) => item.rideRequestId.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  toggleButton: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10,
    marginVertical: 20,
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: "#f9c2ff",
  },
});

export default Inbox;