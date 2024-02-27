import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity} from 'react-native';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import MapComponent from '../components/MapComponent';
import 'leaflet/dist/leaflet.css';
import {getUserRides} from '../Utils';
//import MapView, { Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import { FIREBASE_AUTH } from '../components/FirebaseConfig';

const HomeScreen = () => {
  const [currentRegion, setCurrentRegion] = useState(null);
  //PLACEHOLDER POLYLINE!!
  const [userRides, setUserRides] = useState([])
  const [mapLoaded, setMapLoaded] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      try {
        getCurrentLocation(); 
        const rides = await getUserRides();
        if (rides) {
          setUserRides(rides);
          console.log(`getUserRides was successful: ${rides}`); // This will log the actual rides data
        }
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchData();
  }, []);

  const getCurrentLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log(`LAT AND LONG ${latitude} ${longitude}`);
          setCurrentRegion({
            latitude,
            longitude,
            latitudeDelta: 0.0922, // Zoom level for latitude
            longitudeDelta: 0.0421, // Zoom level for longitude
          });
          console.log(currentRegion);
        },
        (error) => {
          console.log(error.code, error.message);
          
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  };

  const onDatePress = () => {
    console.log("Date is pressed!");
  }
  const onManageCarpoolsPress = () => {
    console.log("Manage carpools is pressed!");
  }

  return (
    <>
      {userRides && userRides.length > 0 ? (
        <View style={styles.container}>
          <View style={styles.tripInfo}>
            <Text>Upcoming Trip</Text>
            <TouchableOpacity onPress={onDatePress}>
              <Text>{timestampToDate(userRides[0].timestamp)}</Text>
            </TouchableOpacity>
          </View>
          <MapComponent currentRegion={currentRegion} ride={userRides[0]} />
          
          <TouchableOpacity onPress={onManageCarpoolsPress}>
            <Text>Manage Carpools</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ActivityIndicator />
      )}
    </>
  );
};

const timestampToDate = (timestamp) => {
  if (!timestamp) {
    return ""
  }
  const date = new Date(timestamp * 1000);
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
  return formattedDate;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems:'center',
    padding: 10,

  },
  tripInfo: {
   flexDirection: 'row', 
   justifyContent: 'space-around',
   width: '60%'
  }
});

export default HomeScreen;
