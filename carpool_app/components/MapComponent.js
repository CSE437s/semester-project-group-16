import React, {useState} from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import polyline from '@mapbox/polyline';
import { ActivityIndicator, StyleSheet, View} from 'react-native';

import L from 'leaflet';

const customMarkerIcon = L.icon({
  iconUrl:'../assets/locationMarker.png',
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
  if (!currentRegion || typeof currentRegion.latitude === 'undefined' || typeof currentRegion.longitude === 'undefined') {
    console.log(`currentRegion is undefined or missing attributes: ${currentRegion}`);
    return null;
  }
  if (typeof encodedPolyline === 'undefined') {
    console.log("PolyLine is undefined, check your data?");
    return null;
  }
  const polylinePoints = decodePolyline(encodedPolyline);
 
  return (
    <>
      <View style={styles.map}>
      
        <MapContainer
          center={[currentRegion.latitude, currentRegion.longitude]}
          zoom={13}
          style={{ height: '100vh', width: '100%' }}
          whenCreated={(mapInstance) => {
            mapInstance.on('load', () => setMapLoaded(true));
          }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[currentRegion.latitude, currentRegion.longitude]} icon={customMarkerIcon} />
          <Polyline positions={polylinePoints} color="red" />
        </MapContainer>

    </View>
    </>
  );
};

const styles = StyleSheet.create({
  map: {
    width: '60%',
    height: 300,
    borderColor: 'black',
    borderRadius: 5,
    borderWidth: 5,
  },
});

export default MapComponent;