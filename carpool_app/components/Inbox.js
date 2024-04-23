import React, { useState, useEffect } from "react";
import {
  Button,
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import BackArrow from "./BackArrow";
import { fetchRideRequests } from "../Utils";
import MessageThread from "./MessageThread";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import Icon from "react-native-vector-icons/Ionicons";
import InboxItem from "./InboxItem";
import ViewProfile from "./ViewProfile";

const Inbox = ({ onClose }) => {
  const [incomingMessages, setIncomingMessages] = useState([]);
  const [outgoingMessages, setOutgoingMessages] = useState([]);
  const [isIncomingSelected, setIsIncomingSelected] = useState(true);
  const [profileUserId, setProfileUserId] = useState(null);

  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshCounter, setRefreshCounter] = useState(0);

  useEffect(() => {
    const getMessages = async () => {
      const response = await fetchRideRequests();
      setIncomingMessages(response.incomingRequests);
      setOutgoingMessages(response.outgoingRequests);
    };
    getMessages();
    setRefreshing(false);
  }, [refreshCounter]);

  const onCloseMessageThread = () => {
    setSelectedIndex(-1);
  };
  const onRefresh = () => {
    setRefreshing(true);
    setRefreshCounter((prev) => prev + 1); // Increment counter to trigger useEffect
  };

  const getNumSelectedMessages = () => {
    if (isIncomingSelected) {
      return incomingMessages.length;
    }
    return outgoingMessages.length;
  };

  const showUserProfile = (item_index) => {
    if (isIncomingSelected) {
      const profileUserId = incomingMessages[item_index].outgoingUserId;
      setProfileUserId(profileUserId);
    } else {
      const profileUserId = outgoingMessages[item_index].incomingUserId;
      setProfileUserId(profileUserId);
    }
  };

  const getSelectedRequest = () => {
    if (selectedIndex == -1) {
      return {};
    }
    if (isIncomingSelected) {
      return incomingMessages[selectedIndex];
    } else {
      return outgoingMessages[selectedIndex];
    }
  };

  // Views the conversation
  if (selectedIndex != -1) {
    return (
      <MessageThread
        onClose={onCloseMessageThread}
        rideRequest={getSelectedRequest()}
      />
    );
  }

  if (profileUserId != null) {
    return (
      <ViewProfile
        userId={profileUserId}
        onClose={() => setProfileUserId(null)}
      />
    );
  }

  return (
    <View style={styles.container}>
      <BackArrow onClose={onClose} />
      <SegmentedControl
        values={["Join Requests", "My Requests"]}
        selectedIndex={isIncomingSelected ? 0 : 1}
        onChange={(event) => {
          setIsIncomingSelected(event.nativeEvent.selectedSegmentIndex === 0);
        }}
      />
      {getNumSelectedMessages() === 0 && (
        <Text style={styles.noMessagesText}>No Messages Found!</Text>
      )}
      <FlatList
        data={isIncomingSelected ? incomingMessages : outgoingMessages}
        renderItem={({ item, index }) => (
          <InboxItem
            item={item}
            index={index}
            setSelectedIndex={setSelectedIndex}
            showUserProfile={showUserProfile}
          />
        )}
        keyExtractor={(item) => item.rideRequestId.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
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
  noMessagesText: {
    fontFamily: "Poppins-SemiBold",
    height: "fit",
    marginTop: 20,
    alignSelf: "center",
    color: "gray",
  },
});

export default Inbox;
