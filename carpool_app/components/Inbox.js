import React, { useState, useEffect } from 'react';
import { Button, View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import BackArrow from './BackArrow';
import { fetchRideRequests } from '../Utils';
import MessageThread from './MessageThread';
import SegmentedControl from '@react-native-segmented-control/segmented-control';

const Inbox = ({ onClose }) => {
  const [incomingMessages, setIncomingMessages] = useState([]);
  const [outgoingMessages, setOutgoingMessages] = useState([]);
  const [isIncomingSelected, setIsIncomingSelected] = useState(true); 
  const [selectedRequest, setSelectedRequest] = useState({});

  const [numMessages, setNumMessages] = useState(0);

  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const getMessages = async () => {
      const response = await fetchRideRequests();
      console.log(`response: ${response}`);
      setIncomingMessages(response.incomingRequests);
      setOutgoingMessages(response.outgoingRequests);
    };
    getMessages();
  }, []);


  const onCloseMessageThread = () => {
    setSelectedRequest({});
  }

  // Views the conversation
  if(Object.keys(selectedRequest).length !== 0) {
    return <MessageThread onClose={onCloseMessageThread} rideRequest={selectedRequest} />
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => setSelectedRequest(item)}>
      <Text>{item.rideRequestId}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <BackArrow onClose={onClose} />
      <SegmentedControl
        values={['Join Requests', 'My Requests']}
        selectedIndex={selectedIndex}
        onChange={(event) => {
          setSelectedIndex(event.nativeEvent.selectedSegmentIndex);
        }}
      />
      <FlatList
        data={selectedIndex == 0 ? incomingMessages : outgoingMessages}
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
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: 'black', 
    borderRadius: 10, 
    
  },
});

export default Inbox;