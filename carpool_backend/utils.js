const dotenv = require('dotenv');
dotenv.config();
const fetch = require('node-fetch');


async function getCoordinatesOfAddress(address) {
    const key = process.env.GEOCODING_API_KEY;
    const queryString = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${key}`;
    try {
        const response = await fetch(queryString);
        const data = await response.json()
        const latitude = data.results[0].geometry.location.lat;
        const longitude = data.results[0].geometry.location.lng; 
        const placeId = data.results[0].place_id;
        return {latitude, longitude};
    } catch (error) {
        console.log("error: ", error)
        return null;
    }
}

//Expecting origin.latitude, origin.longitude, ... stops.latitude, stops.longitude
async function getRoutes(origin, destination, stops) {

    console.log("google routes API is being called");
    const url = 'https://routes.googleapis.com/directions/v2:computeRoutes';
    const body = generateRouteWaypoints(origin, destination, stops);
    const key = process.env.ROUTES_API_KEY;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': key,
          'X-Goog-FieldMask': 'routes.distanceMeters,routes.duration,routes.polyline.encodedPolyline,routes.optimizedIntermediateWaypointIndex',
  
        },
        body: JSON.stringify(body)
      });
      const data = await response.json();
      console.log(`GETROUTES returns: ${JSON.stringify(data)}`);
      return data;
    } catch (error) {
      console.error('getRoutes call failed: ', error);
      return null;
    }
  }
  
  
  
  function generateRouteWaypoints(origin, destination, stops) {
      const originObj = {
        origin: {
          location: {
            latLng: {
              latitude: origin.latitude,
              longitude: origin.longitude
            }
          },
          sideOfRoad: true
        }
      };
      const destinationObj = {
        destination: {
          location: {
            latLng: {
              latitude: destination.latitude,
              longitude: destination.longitude
            }
          }
        }
      };
      const intermediates = stops.map(stop => ({
        location: {
          latLng: {
            latitude: stop.latitude,
            longitude: stop.longitude
          }
        }
      }));
      const routeWaypoints = {
        ...originObj,
        ...destinationObj,
        intermediates: intermediates,
        travelMode: "DRIVE",
        optimizeWaypointOrder: "true",
      };
    
      return routeWaypoints;
    }
  
  module.exports = {getRoutes, getCoordinatesOfAddress}