import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Button, Text } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import polyline from '@mapbox/polyline';
import {checkUserExists} from '../Utils';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Location from 'expo-location';


const MapComponent = ({ ride, mapHeight=500 }) => {

  const [currentLocation, setCurrentLocation] = useState({});
  useEffect(() => {
    const fetchLocation = async () => {
      const location = await getLocation();
      const initialRegion = {
        ...getMidpointCoordinate(ride),
        ...getZoomDeltas(ride)
      };
      setCurrentLocation(initialRegion);
    };
    fetchLocation();
  }, []);


  const styles = StyleSheet.create({
    map: {
      width: '100%',
      height: mapHeight,
    },
  });

  if (!ride) {
    return (
      <View style={styles.map}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={currentLocation}
        region={currentLocation} // Use the state-managed region
        followsUserLocation={true}
        showsUserLocation={true}
        onRegionChangeComplete={setCurrentLocation} // Optional: update the region when the user drags/zooms the map
      />
      </View>
    ) 
  }
  if (!currentLocation || typeof currentLocation.latitude === 'undefined' || typeof currentLocation.longitude === 'undefined') {
    return null;
  }
  const encodedPolyline = ride.route.route_polyline;
  if (typeof encodedPolyline === 'undefined') {
    console.log('PolyLine is undefined, check your data?');
    return null;
  }
  const polylinePoints = decodePolyline(encodedPolyline);

  return (
    <View style={[styles.map, { height: mapHeight }]}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={currentLocation}
        region={currentLocation}
        followsUserLocation={true}
        showsUserLocation={true}
        onRegionChangeComplete={setCurrentLocation}
      >
        {ride.stops.map((stop, index) => (
        <Marker
          key={index}
          coordinate={{ latitude: stop.latitude, longitude: stop.longitude }}
          title={`Stop ${index + 1}`}
          description={stop.email}
          anchor={{ x: 0.5, y: 1 }} 
        >
          <Icon name="location" size={30} color="#D00000" />
        </Marker>
        ))}

        <Polyline
          coordinates={polylinePoints} 
          strokeColor="#022940"
          strokeWidth={6}
        />
      </MapView>
    </View>
  );
};

async function getLocation() {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    alert('Permission to access location was denied');
    return {latitude: 0, longitude: 0};
  }
  const location = await Location.getCurrentPositionAsync({});
  return location.coords;
}

const isYourStop = async (stop) => {
  const user = await checkUserExists();
  return stop.user_id == user.uid;
}

//Centers map display.
function getMidpointCoordinate(ride) {
  if (!ride) {
    return {}
  }
  console.log(`user ride: ${ride}`)
  const allCoordinatesList = [
    ...ride.stops,
    { latitude: ride.route.origin_latitude, longitude: ride.route.origin_longitude },
    { latitude: ride.route.destination_latitude, longitude: ride.route.destination_longitude }
  ];
  const total = allCoordinatesList.reduce((acc, curr) => {
    acc.latitude += curr.latitude;
    acc.longitude += curr.longitude;
    return acc;
  }, { latitude: 0, longitude: 0 });

  const averageLatitude = total.latitude / allCoordinatesList.length;
  const averageLongitude = total.longitude / allCoordinatesList.length;

  return { latitude: averageLatitude, longitude: averageLongitude };
}

//Finds zoomDeltas to fit entire map on load.
function getZoomDeltas(ride) {
  if (!ride) {
    return {}
  }
  const allCoordinatesList = [
    ...ride.stops,
    { latitude: ride.route.origin_latitude, longitude: ride.route.origin_longitude },
    { latitude: ride.route.destination_latitude, longitude: ride.route.destination_longitude }
  ];
  let maxLat = -Infinity, minLat = Infinity, maxLng = -Infinity, minLng = Infinity;

  allCoordinatesList.forEach(coord => {
    if (coord.latitude > maxLat) maxLat = coord.latitude;
    if (coord.latitude < minLat) minLat = coord.latitude;
    if (coord.longitude > maxLng) maxLng = coord.longitude;
    if (coord.longitude < minLng) minLng = coord.longitude;
  });

  const latitudeDelta = maxLat - minLat;
  const longitudeDelta = maxLng - minLng;

  const margin = 0.08; 
  return {
    latitudeDelta: latitudeDelta + 10*margin*latitudeDelta,
    longitudeDelta: longitudeDelta + 10*margin*longitudeDelta,
  };
}

const decodePolyline = (encodedPolyline) => {
  return polyline.decode(encodedPolyline).map(array => ({
    latitude: array[0],
    longitude: array[1],
  }));
};



export default MapComponent;
