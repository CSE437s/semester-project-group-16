const {getCoordinatesOfAddress} = require("./utils");
const pool = require('./database');

async function createRoute(originAddress, destinationAddress, userId){
    try {
        const origin_coordinates = await getCoordinatesOfAddress(originAddress);
        const destination_coordinates = await getCoordinatesOfAddress(destinationAddress);
        const query = "INSERT INTO ROUTE (origin_latitude, origin_longitude, destination_latitude, destination_longitude) VALUES (?,?,?,?)"
        const [result] = await pool.execute(query, [origin_coordinates.latitude, origin_coordinates.longitude, destination_coordinates.latitude, destination_coordinates.longitude]);
        return result; //Access route_id with result.insertId
    } catch(error) {
        console.error(error);
        throw error;
    }
}

async function createStop(stopAddress, userId, routeId=null) {
    try {
        const stop_coordinates = await getCoordinatesOfAddress(stopAddress);
        const query = `
            INSERT INTO STOP (latitude, longitude, route_id, user_id)
            VALUES (?, ?, ?, ?)
        `;
        const [result] = await pool.execute(query, [latitude, longitude, routeId, userId]);
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

        console.log('Insert Result:', result);
        return result;
    } catch (error) {
        console.error('Error inserting Trip:', error);
        throw error;
    }
}

async function getStopsWithRouteId(routeId) {
    try {
        const query = `
            SELECT * FROM STOP
            WHERE route_id = ?
        `;
        const [stops] = await pool.execute(query, [routeId]);
        console.log('Stops:', stops);
        return stops;
    } catch (error) {
        console.error('Error fetching Stops with routeId:', error);
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
        console.log(`routes: ${JSON.stringify(routes)}`);
        return routes;
    } catch (error) {
        console.error('Error fetching Routes with routeId:', error);
        throw error;
    }
}
async function getStopsWithUserId(userId) {
    try {
        const query = `
            SELECT * FROM STOP
            WHERE user_id = ?
        `;
        const [stops] = await pool.execute(query, [userId]);
        console.log('Stops:', stops);
        return stops;
    } catch (error) {
        console.error('Error fetching Stops with userId:', error);
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


async function getDrivingTripsWithUserId(userId) {
    try {
        const [trips] = await pool.execute(`
            SELECT * FROM TRIP
            WHERE user_id = ?
        `, [userId]);
        console.log('Trips with User ID:', trips);
        return trips;
    } catch (error) {
        console.error('Error fetching Trips with User ID:', error);
        throw error;
    }
}

async function getRidingTripsWithUserId(userId) {
    try {
        const stops = await getStopsWithUserId(userId);
        let trips = [];

        for (let stop of stops) {
            if (stop.route_id !== null) {
                const matchingTrips = await getTripsWithRouteId(stop.route_id);
                trips = [...trips, ...matchingTrips];
            }
        }

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
    getStopsWithRouteId,
    getStopsWithUserId,
    getTripsWithRouteId,
    getDrivingTripsWithUserId,
    getRidingTripsWithUserId,
    getRoutesWithRouteId,
  };