import React, { useEffect, useState , useCallback} from 'react';
import {Modal,View,Text,StyleSheet,ActivityIndicator,TouchableOpacity} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { Calendar } from 'react-native-calendars';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import MapComponent from '../components/MapComponent';
import 'leaflet/dist/leaflet.css';
import { getUserRides } from '../Utils';
//import MapView, { Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import { FIREBASE_AUTH } from '../components/FirebaseConfig';

const HomeScreen = () => {
  const [currentRegion, setCurrentRegion] = useState(null);
  //PLACEHOLDER POLYLINE!!
  const [userRides, setUserRides] = useState([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [markedDates, setMarkedDates] = useState({});

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          getCurrentLocation();
          const rides = await getUserRides('false');
          if (rides) {
            setUserRides(rides);
            console.log(`getUserRides was successful: ${JSON.stringify(rides)}`);
          }
        } catch (error) {
          console.error(error);
        }
      };
      fetchData();

    }, []) 
  );

  const getCurrentLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log(`LAT AND LONG ${latitude} ${longitude}`);
          setCurrentRegion({
            latitude,
            longitude,
            latitudeDelta: 1, // Zoom level for latitude
            longitudeDelta: 1, // Zoom level for longitude
          });
        },
        (error) => {
          console.log(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    } else {
      console.log('Geolocation is not supported by this browser.');
    }
  };

  const onDatePress = () => {
    console.log('Date is pressed!');
  };
  const onManageCarpoolsPress = () => {
    console.log('Manage carpools is pressed!');
    const newMarkedDates = userRides.reduce((acc, ride) => {
      const dateKey = timestampToDate(ride.timestamp); // Convert each timestamp to date key
      acc[dateKey] = {
        selected: true,
        marked: true,
        selectedColor: 'blue',
      };
      return acc;
    }, {});

    setMarkedDates(newMarkedDates);
    setModalVisible(true);
  };

  return (
    <>
      {userRides && userRides.length > 0 ? (
        <View style={styles.container}>
          <View style={styles.tripInfo}>
            <Text style={styles.tripInfoText}>Your Next Trip</Text>
            <TouchableOpacity onPress={onDatePress}>
              <Text style={styles.tripInfoText}>{timestampToDate(userRides[0].timestamp)}</Text>
            </TouchableOpacity>
          </View>
          <MapComponent currentRegion={currentRegion} ride={userRides[0]} />

          <TouchableOpacity
            onPress={onManageCarpoolsPress}
            style={styles.buttonStyle}
          >
            <Text style={styles.buttonTextStyle}>Manage Carpools</Text>
          </TouchableOpacity>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Manage Carpools</Text>
                <Calendar
                  markedDates={markedDates}
                />
                <TouchableOpacity
                  style={styles.buttonStyle}
                  onPress={() => {
                    setModalVisible(!modalVisible);
                  }}
                >
                  <Text style={styles.buttonTextStyle}>Hide Calendar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      ) : (
        <ActivityIndicator />
      )}
    </>
  );
};

const timestampToDate = (timestamp) => {
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    '0'
  )}-${String(date.getDate()).padStart(2, '0')}`;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around', // Distribute space evenly
    padding: 20,
    backgroundColor: '#F5F5F5', // Soft background color
  },
  tripInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '70%', // Increase width for better spacing
    padding: 10,
    backgroundColor: '#FFFFFF', // Light background to highlight this section
    borderRadius: 10, // Rounded corners
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: '#022940', // More appealing button color
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: 'bold', // Make modal text bold
    fontSize: 18, // Increase font size for readability
  },
  buttonStyle: {
    backgroundColor: '#022940', // Primary button color
    padding: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop: 20, // Add some margin at the top
  },
  buttonTextStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tripInfoText: {
    fontSize: 40,
  }
});

export default HomeScreen;
