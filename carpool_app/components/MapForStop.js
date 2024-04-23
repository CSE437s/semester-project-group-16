import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Location from 'expo-location';
import { CoordinateClass } from '../ApiDataClasses';

const MapForStop = ({ ride, onLocationSelected, mapHeight = 565 }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchLocation = async () => {
      setIsLoaded(false);
      const location = await getLocation();
      if (!location) {
        Alert.alert('Error', 'Could not fetch location.');
        return;
      }
      const initialRegion = {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
      setCurrentLocation(initialRegion);
      setIsLoaded(true);
    };
    fetchLocation();
  }, []);

  const handleMapPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    const coordinate = new CoordinateClass(latitude, longitude);
    setSelectedLocation({ latitude, longitude });
    onLocationSelected(coordinate);
  };

  if (!isLoaded) {
    return (
      <View style={[styles.map, { height: mapHeight }]}>
        <Text>Loading map...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.map, { height: mapHeight }]}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={currentLocation}
        onPress={handleMapPress}
        showsUserLocation={true}
      >
        {selectedLocation && (
          <Marker coordinate={selectedLocation} title="Selected Location">
            <Icon name="location" size={30} color="#D00000" />
          </Marker>
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    width: '100%',
    alignSelf: 'center',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: 'light-gray',
    borderBottomColor: 'light-gray',
  },
});

export async function getLocation() {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert(
      'Permission Denied',
      'Permission to access location was denied'
    );
    return null; // Ensure to handle null in your calling component
  }
  const location = await Location.getCurrentPositionAsync({});
  return location.coords;
}

export default MapForStop;
