import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { FIREBASE_AUTH } from '../components/FirebaseConfig';

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
    getCurrentLocation();
    makeProtectedAPICall();
  }, []);

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentRegion({
          latitude,
          longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
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
          provider={MapView.PROVIDER_GOOGLE} // Remove this line if you're not using Google Maps
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
