import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  PermissionsAndroid
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import { FIREBASE_AUTH } from '../components/FirebaseConfig';

// Your original makeProtectedAPICall function
const makeProtectedAPICall = async () => {
  try {
    const user = FIREBASE_AUTH.currentUser;
    if (!user) {
      console.log('User is not logged in');
      return;
    }

    const idToken = await user.getIdToken(true);
    const apiUrl = `http://localhost:3000/rides/${user.uid}`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${idToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch from protected endpoint');
    }

    const responseData = await response.json();
    console.log(responseData);
    return responseData;
  } catch (error) {
    console.error('Error making protected API call:', error);
  }
};

const HomeScreen = () => {
  const [currentRegion, setCurrentRegion] = useState(null);

  useEffect(() => {
    if (Platform.OS === 'android') {
      requestLocationPermission().then(() => {
        getCurrentLocation();
      });
    } else {
      // No need for permissions on iOS
      getCurrentLocation();
    }

    // Fetch data after getting location to ensure user is logged in
    makeProtectedAPICall();
  }, []);

  async function requestLocationPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs access to your location.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the location');
      } else {
        console.log('Location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  }

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
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
  };

  return (
    <View style={styles.container}>
      <Text>This is the logged in screen!</Text>
      {currentRegion && (
        <MapView
          style={styles.map}
          initialRegion={currentRegion}
          provider={MapView.PROVIDER_GOOGLE}
        >
          <Marker
            coordinate={{
              latitude: currentRegion.latitude,
              longitude: currentRegion.longitude,
            }}
            title={'Your Location'}
          />
        </MapView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

export default HomeScreen;
