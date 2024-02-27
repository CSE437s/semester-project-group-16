import React from 'react';
import styled from 'styled-components';
import {checkUserExists} from '../Utils';
import StopCreation from './StopCreation';
import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Modal, Picker, TouchableOpacity } from 'react-native';


const StyledPost = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-items: stretch;
  padding: 20px;
  background-color: #FFFFFF;
  border-radius: 10px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  font: 14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  .category {
    color: grey; // Example styling for category
  }

  .timestamp {
    color: grey; // Example styling for timestamp
  }

  .email {
    color: grey; // Example styling for email
  }

  .completed {
    color: grey; // Example styling for completed status
  }
`;


const TripInfo = styled.div`
  flex: 1;
  font: 14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
`;

const RouteInfo = styled.div`
  flex: 1;
  margin-left: 20px;
  font: 14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
`;

const Label = styled.span`
  font-weight: bold;
  font:  -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
`;

const ApplyButton = styled.button`
  font-size: 16px;
  padding: 10px 20px;
  background-color: #007bff;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    background-color: #0056b3;
    color: #ffffff;
  }
`;

const Post = ({ trip }) => {

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const dateString = date.toLocaleDateString();
    const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `${dateString} : ${timeString}`;
  };

  const [showStopCreation, setShowStopCreation] = useState(false);

  const handleApply = () => {
    setShowStopCreation(true); // Show the form when Apply button is pressed
    const userObj = checkUserExists();
    const userId = userObj.uid;

    //console.log(trip.route_id);
    //console.log(userId);
    
  };

  const handleClose = () => {
    setShowStopCreation(false); // Close the form
  };



  return (
    <StyledPost>
      <TripInfo>
        <div>
          <Label>From:</Label> {trip.addresses.origin_address}
        </div>
        <div>
          <Label>To:</Label> {trip.addresses.destination_address}
        </div>
        <div className="category">
          {trip.category}
        </div>
      </TripInfo>
      <RouteInfo>
        <div className="email">
          {trip.email.email}
        </div>
        <div className="timestamp">
          {formatTimestamp(trip.timestamp)}
        </div>
        <div className="completed">
          {trip.completed ? 'Completed' : 'Active'}
        </div>
      </RouteInfo>
      <View>
        <ApplyButton onClick={handleApply}>Apply</ApplyButton>
        <Modal visible={showStopCreation} animationType="slide">
        <StopCreation onClose={handleClose} tripRouteId={trip.route_id} />
        </Modal>
      </View>
    </StyledPost>
  );
};

const styles = StyleSheet.create({
  button: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#007bff',
    color: '#ffffff',
    borderRadius: 5,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
});


export default Post;

