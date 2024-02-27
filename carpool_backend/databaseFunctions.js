const {getCoordinatesOfAddress} = require("./utils");
const pool = require('./database');

async function createRoute(originAddress, destinationAddress, userId) {
    try {
        const originCoordinates = await getCoordinatesOfAddress(originAddress);
        const destinationCoordinates = await getCoordinatesOfAddress(destinationAddress);
        const query = "INSERT INTO ROUTE (origin_latitude, origin_longitude, destination_latitude, destination_longitude, origin_address, destination_address) VALUES (?,?,?,?,?,?)";
        const [result] = await pool.execute(query, [originCoordinates.latitude, originCoordinates.longitude, destinationCoordinates.latitude, destinationCoordinates.longitude, originAddress, destinationAddress]);
        return result; // Access route_id with result.insertId
    } catch (error) {
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

async function getStopsWithUserId(userId, findAll) {
    try {
        let query = "";
        let params = [userId];
        if (findAll == "true") {
            query = `SELECT * FROM TRIP WHERE user_id != ?`;
        } else {
            query = `SELECT * FROM TRIP WHERE user_id = ?`;
        }
        const [stops] = await pool.execute(query, params);
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
        query = `SELECT email FROM USER where user_id != ?`; 
        let params = [userId];
        const [email] = await pool.execute(query, params);
        return email;
    } catch (error) {
        console.error("Error getting email from user id");
        throw(error);
    }
}

async function getRidingTripsWithUserId(userId, findAll) {
    try {
        const stops = await getStopsWithUserId(userId, findAll);
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
    getEmailFromUserId,
  };