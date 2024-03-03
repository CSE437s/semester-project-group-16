import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import polyline from '@mapbox/polyline';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import L from 'leaflet';

const customMarkerIcon = L.icon({
  iconUrl: '../assets/locationMarker.png',
  iconSize: [40, 40],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const decodePolyline = (encodedPolyline) => {
  return polyline.decode(encodedPolyline);
};

const MapComponent = ({ currentRegion, ride }) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  let encodedPolyline = ride.route.routes[0].polyline.encodedPolyline;
  if (
    !currentRegion ||
    typeof currentRegion.latitude === 'undefined' ||
    typeof currentRegion.longitude === 'undefined'
  ) {
    console.log(
      `currentRegion is undefined or missing attributes: ${currentRegion}`
    );

  }
  if (typeof encodedPolyline === 'undefined') {
    console.log('PolyLine is undefined, check your data?');
    return null;
  }
  const polylinePoints = decodePolyline(encodedPolyline);

  return (
    <>
      <View style={styles.map}>
        <MapContainer
          center={[38.648987, -90.312553]}
          zoom={13}
          style={{ height: '100vh', width: '100%' }}
          whenCreated={(mapInstance) => {
            mapInstance.on('load', () => setMapLoaded(true));
          }}
        >
          <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
 />
          {currentRegion && <Marker
            position={[currentRegion.latitude, currentRegion.longitude]}
            icon={customMarkerIcon} 
          /> }
          <Polyline positions={polylinePoints} color="#022940" />
        </MapContainer>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  map: {
    width: '90%',
    height: 460,
    borderColor: '#606060', // A medium gray for the border
    borderRadius: 5,
    borderWidth: 5,
    boxShadow: '0px 0px 8px 2px rgba(0,0,0,0.2)', // Adds a shadow for depth
  },
});

export default MapComponent;
