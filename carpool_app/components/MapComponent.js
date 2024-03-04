import React, { useState } from 'react';
import { StyleSheet, View, Button } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import polyline from '@mapbox/polyline';

const decodePolyline = (encodedPolyline) => {
  return polyline.decode(encodedPolyline).map(array => ({
    latitude: array[0],
    longitude: array[1],
  }));
};

const MapComponent = ({ currentRegion, ride }) => {
  let encodedPolyline = ride.route_polyline;
  const [region, setRegion] = useState({
    latitude: currentRegion.latitude,
    longitude: currentRegion.longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  console.log(region);

  const zoomIn = () => {
    setRegion({
      ...region,
      latitudeDelta: region.latitudeDelta / 2,
      longitudeDelta: region.longitudeDelta / 2,
    });
  };
  const zoomOut = () => {
    setRegion({
      ...region,
      latitudeDelta: region.latitudeDelta * 2,
      longitudeDelta: region.longitudeDelta * 2,
    });
  };
  
  if (
    !currentRegion ||
    typeof currentRegion.latitude === 'undefined' ||
    typeof currentRegion.longitude === 'undefined'
  ) {
    console.log(
      `currentRegion is undefined or missing attributes: ${currentRegion}`
    );
    return null;
  }
  if (typeof encodedPolyline === 'undefined') {
    console.log('PolyLine is undefined, check your data?');
    return null;
  }
  const polylinePoints = decodePolyline(encodedPolyline);

  return (
    <View style={styles.map}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={region}
        region={region} // Use the state-managed region
        onRegionChangeComplete={setRegion} // Optional: update the region when the user drags/zooms the map
      >
        <Polyline
          coordinates={polylinePoints}
          strokeColor="#022940"
          strokeWidth={6}
        />
      </MapView>
      <View style={styles.zoomControls}>
        <Button title="Zoom In" onPress={zoomIn} />
        <Button title="Zoom Out" onPress={zoomOut} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: 500,
  },
  zoomControls: {
    position: 'absolute', // Position your zoom controls over the map
    bottom: 10,
    right: 10,
    flexDirection: 'row',
  },
});

export default MapComponent;
