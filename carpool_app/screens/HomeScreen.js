import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        getCurrentLocation();
        const rides = await getUserRides();
        if (rides) {
          setUserRides(rides);
          console.log(`getUserRides was successful: ${JSON.stringify(rides)}`); // This will log the actual rides data
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
            <Text>Upcoming Trip</Text>
            <TouchableOpacity onPress={onDatePress}>
              <Text>{timestampToDate(userRides[0].timestamp)}</Text>
            </TouchableOpacity>
          </View>
          <MapComponent currentRegion={currentRegion} ride={userRides[0]} />

          <TouchableOpacity onPress={onManageCarpoolsPress}>
            <Text>Manage Carpools</Text>
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
                  // ... add your other calendar properties
                  markedDates={markedDates}
                />
                <TouchableOpacity
                  style={{ ...styles.openButton, backgroundColor: '#2196F3' }}
                  onPress={() => {
                    setModalVisible(!modalVisible);
                  }}
                >
                  <Text style={styles.textStyle}>Hide Calendar</Text>
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
    padding: 10,
  },
  tripInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '60%',
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
    backgroundColor: '#F194FF',
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
  },
});

export default HomeScreen;
