const {getCoordinatesOfAddress, getRoutes} = require("./utils");
const pool = require('./database');

async function createRoute(originAddress, destinationAddress, routePolyline, routeTime, userId) {
    try {
        const originCoordinates = await getCoordinatesOfAddress(originAddress);
        const destinationCoordinates = await getCoordinatesOfAddress(destinationAddress);
        const googleRouteResponse = await getRoutes(originCoordinates, destinationCoordinates, [])
        //THIS CONTAINS ROUTE INFO
        const routeTime = googleRouteResponse.routes[0].duration;
        const routePolyline = googleRouteResponse.routes[0].polyline.encodedPolyline;

        const query = "INSERT INTO ROUTE (origin_latitude, origin_longitude, destination_latitude, destination_longitude, origin_address, destination_address, route_time, route_polyline) VALUES (?,?,?,?,?,?,?,?)";
        const [result] = await pool.execute(query, [originCoordinates.latitude, originCoordinates.longitude, destinationCoordinates.latitude, destinationCoordinates.longitude, originAddress, destinationAddress, routeTime, routePolyline]);
        //console.log(`Insertion was success! Route Polyline: ${routePolyline}`);
        return result; // Access route_id with result.insertId
    } catch (error) {
        console.error(error);
        throw error;
    }
}


async function createStop(stopAddress, userId, tripId, routeId=null) {
    try {
        const stop_coordinates = await getCoordinatesOfAddress(stopAddress);
        const query = `
            INSERT INTO STOP (latitude, longitude, trip_id, user_id)
            VALUES (?, ?, ?, ?)
        `;
        const [result] = await pool.execute(query, [stop_coordinates.latitude, stop_coordinates.longitude, tripId, userId]);
        //After we create the stop, fetch the entire route from the db and recompute route.
        if (routeId) {
            let routeQuery = `SELECT * FROM ROUTE WHERE route_id = ?`;
            const [routeResult] = await pool.execute(routeQuery, [routeId]);
            console.log('Route:', routeResult);

            let stopsQuery = `SELECT * FROM STOP WHERE trip_id = ? ORDER BY stop_id ASC`;
            const [stopsResult] = await pool.execute(stopsQuery, [tripId]);
            console.log('Stops for Route:', stopsResult);

            let route = routeResult[0];
            let route_origin = {latitude: route.origin_latitude, longitude: route.origin_longitude};
            let route_destination = {latitude: route.destination_latitude, longitude: route.destination_longitude};

            let stops = stopsResult.map(stop => ({
                latitude: stop.latitude,
                longitude: stop.longitude
            }));

            const googleRouteResponse = await getRoutes(route_origin, route_destination, stops);
            const newRoutePolyline = googleRouteResponse.routes[0].polyline.encodedPolyline;

            const newRouteTime = googleRouteResponse.routes[0].duration;
            console.log(newRouteTime);

            let updateRouteQuery = `UPDATE ROUTE SET route_polyline = ?, route_time = ? WHERE route_id = ?`;
            const [updateResult] = await pool.execute(updateRouteQuery, [newRoutePolyline, newRouteTime, routeId]);
            console.log('Route updated with new polyline:', updateResult);
        }
        console.log('Insert Result:', result);
        return result;
    } catch (error) {
        console.error('Error inserting Stop:', error);
        throw error;
    }
}

async function createTrip(routeId, userId, category, completed, timestamp) {
    try {
        const query = `INSERT INTO TRIP (route_id, user_id, category, completed, timestamp) VALUES (?, ?, ?, ?, ?)`;
        const [result] = await pool.execute(query, [routeId, userId, category, completed, timestamp]);

        return result;
    } catch (error) {
        console.error('Error inserting Trip:', error);
        throw error;
    }
}

async function getStopsWithTripId(tripId) {
    try {
        const query = `
            SELECT STOP.*, USER.*
            FROM STOP
            JOIN TRIP ON STOP.trip_id = TRIP.trip_id
            JOIN USER ON TRIP.user_id = USER.user_id
            WHERE STOP.trip_id = ?
        `;
        const [stops] = await pool.execute(query, [tripId]);
        return stops;
    } catch (error) {
        console.error('Error fetching Stops with tripId:', error);
        throw error;
    }
}
async function getRoutesWithRouteId(routeId) {
    try {
        const query = `
            SELECT * FROM ROUTE
            WHERE route_id = ?
        `;
        // Destructuring to get the first element (rows) from the result.
        const [routes] = await pool.execute(query, [routeId]);
        return routes;
    } catch (error) {
        console.error('Error fetching Routes with routeId:', error);
        throw error;
    }
}

async function getTripsWithRouteId(routeId) {
    
    const query = `
        SELECT * FROM TRIP
        WHERE route_id = ?
    `;
    const [trips] = await pool.execute(query, [routeId]);
    return trips;
}


async function getDrivingTripsWithUserId(userId, findAll) {
    try {
        let query = "";
        let params = [userId];
        if (findAll == "true") {
            query = `SELECT * FROM TRIP where user_id != ?`;
        } else {
            query = `SELECT * FROM TRIP WHERE user_id = ?`;
        }
        const [trips] = await pool.execute(query, params);
        console.log('Trips with User ID:', trips);
        return trips;
    } catch (error) {
        console.error('Error fetching Trips with User ID:', error);
        throw error;
    }
}

async function getEmailFromUserId(userId) {
    try {
        query = `SELECT email FROM USER where user_id = ?`; 
        let params = [userId];
        const [email] = await pool.execute(query, params);
        return email;
    } catch (error) {
        console.error("Error getting email from user id");
        throw(error);
    }
}

async function getRidingTripsWithUserId(userId, findAll) {
    if (findAll == false) {
        return [];
    }
    try {
        // This query assumes that `STOP.route_id` links to `ROUTE.route_id`
        // and `ROUTE.trip_id` links to `TRIP.trip_id`.
        let query = `
            SELECT DISTINCT TRIP.*
            FROM TRIP
            INNER JOIN STOP ON TRIP.trip_id = STOP.trip_id
            WHERE STOP.user_id = ?
        `;
        const [trips] = await pool.execute(query, [userId]);
        console.log('Trips:', trips);
        return trips;
    } catch (error) {
        console.error('Error fetching riding trips with userId:', error);
        throw error;
    }
}

module.exports = {
    createRoute,
    createStop,
    createTrip,
    getStopsWithTripId,
    getTripsWithRouteId,
    getDrivingTripsWithUserId,
    getRidingTripsWithUserId,
    getRoutesWithRouteId,
    getEmailFromUserId,
  };