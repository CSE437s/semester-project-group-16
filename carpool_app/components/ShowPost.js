import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Button, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MapComponent  from './MapComponent';
import StopCreation from './StopCreation';
import BackArrow from './BackArrow';
import {timestampToWrittenDate, checkUserExists} from '../Utils';
import CustomButton from './CustomButton'; 

  const formatRouteTime = (routeTimeInSeconds) => {
    const minutes = Math.floor(parseInt(routeTimeInSeconds, 10) / 60);
    return `${minutes} minute`;
  };
  const didUserCreatePost = async (trip) => {
    const user = await checkUserExists();
    return user.uid == trip.userId;
  }
  
  const ShowPost = ({ trip, onClose }) => {
    console.log(JSON.stringify(trip));
    const [showApply, setShowApply] = useState(false);
    const [isYourPost, setIsYourPost] = useState(false);

    useEffect(() => {
        const checkIfUserCreatedPost = async () => {
          const result = await didUserCreatePost(trip);
          setIsYourPost(result);
        };
        checkIfUserCreatedPost();
      }, [])
  
    const handleClose = () => {
      setShowApply(false);
    };

    //TODO IMPLEMENT COMPONENT. might be unnecessary. Posts implemented to only show those that aren't yours.
    const handleEditPost = () => {
        console.log("Post creator wants to edit.");
    }
  
    const routeTimeFormatted = formatRouteTime(trip.route.routeTime);
  
    return (
      <View style={styles.container}>
        <BackArrow onClose={onClose} />
        <Text style={styles.email}>{trip.tripUserEmail}'s Trip</Text>
  
        <MapComponent ride={trip} mapHeight={200} />
  
        <View style={styles.tripDetails}>
        <Text style={styles.timestamp}>{timestampToWrittenDate(trip.timestamp)}</Text>
        <View style={{display:'flex', flexDirection:'row', gap:5}}>
        <Icon name={"business-outline"} size={16}/>
        <Text style={styles.address}> {trip.route.originAddress}</Text>
      </View>
      <View style={{display:'flex', flexDirection:'row', gap:5}}>
        <Icon name={"flag-outline"} size={16}/>
        <Text style={styles.address}> {trip.route.destinationAddress}</Text>
      </View>
        <View style={{display:'flex', flexDirection:'row', justifyContent:'space-around', alignItems:'center', margin: 10}}>
          <Text style={styles.detailText}>{routeTimeFormatted} trip</Text>
          <Text style={styles.detailText}>{trip.category}</Text>
          <Text style={styles.detailText}>{trip.stops.length} Passengers</Text>
        </View>
        </View>
  
        {isYourPost ? (
            <CustomButton onPress={() => handleEditPost} title="Edit" />
        ) : (
            <CustomButton onPress={() => setShowApply(true)} title="Apply" />
        )}
  
        <Modal visible={showApply} animationType="slide">
          <StopCreation onClose={handleClose} tripRouteId={trip.route.routeId} tripId={trip.tripId} /> 
        </Modal>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      marginTop: 60,
      flex: 1,
      padding: 20,
    },
    tripDetails: {
      marginBottom: 20,
    },
    detailText: {
      fontSize: 16,
      marginBottom: 5,
    },
    applyButton: {
      backgroundColor: '#007bff',
      padding: 10,
      alignItems: 'center',
      borderRadius: 5,
    },
    email: {
        fontSize:18,
        fontFamily:'Poppins-SemiBold',
        margin:8,
    },
    timestamp: {
        fontSize:22,
        fontFamily:'Poppins-Black',
        padding:16,
    },
    address: {
        margin:5,
    }
  });
  
  export default ShowPost;