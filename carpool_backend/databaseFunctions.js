const { getCoordinatesOfAddress, getRoutes } = require("./utils");
const pool = require("./database");

async function createRoute(
  originAddress,
  destinationAddress,
  routePolyline,
  routeTime,
  userId
) {
  try {
    const originCoordinates = await getCoordinatesOfAddress(originAddress);
    const destinationCoordinates = await getCoordinatesOfAddress(
      destinationAddress
    );
    const googleRouteResponse = await getRoutes(
      originCoordinates,
      destinationCoordinates,
      []
    );
    //THIS CONTAINS ROUTE INFO
    const routeTime = googleRouteResponse.routes[0].duration;
    const routePolyline =
      googleRouteResponse.routes[0].polyline.encodedPolyline;

    const query =
      "INSERT INTO ROUTE (origin_latitude, origin_longitude, destination_latitude, destination_longitude, origin_address, destination_address, route_time, route_polyline) VALUES (?,?,?,?,?,?,?,?)";
    const [result] = await pool.execute(query, [
      originCoordinates.latitude,
      originCoordinates.longitude,
      destinationCoordinates.latitude,
      destinationCoordinates.longitude,
      originAddress,
      destinationAddress,
      routeTime,
      routePolyline,
    ]);
    //console.log(`Insertion was success! Route Polyline: ${routePolyline}`);
    return result; // Access route_id with result.insertId
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function createStop(stopAddress, userId, routeId = null) {
  try {
    const stop_coordinates = await getCoordinatesOfAddress(stopAddress);
    const query = `
            INSERT INTO STOP (latitude, longitude, user_id)
            VALUES (?, ?, ?)
        `;
    const [result] = await pool.execute(query, [
      stop_coordinates.latitude,
      stop_coordinates.longitude,
      userId,
    ]);

    console.log("Insert Result:", result.insertId);
    return result;
  } catch (error) {
    console.error("Error inserting Stop:", error);
    throw error;
  }
}

async function addPFP(userId, path) {
  try {
    // Get the previous pfpPath
    const selectQuery = `
      SELECT pfpPath FROM USER WHERE user_id = '${userId}'
    `;
    const [selectResult] = await pool.execute(selectQuery);
    const previousPfpPath = selectResult[0]?.pfpPath || null;

    // Update the pfpPath
    const updateQuery = `
      UPDATE USER
      SET pfpPath = '${path}'
      WHERE user_id = '${userId}'
    `;
    const [updateResult] = await pool.execute(updateQuery);
    console.log("Query executed successfully.");
    console.log(updateResult);

    // Return the previous pfpPath along with the update result
    return { previousPfpPath, updateResult };
  } catch (error) {
    console.error("Error updating profile picture:", error);
    throw error;
  }
}




async function createTrip(routeId, userId, category, completed, timestamp) {
  try {
    const query = `INSERT INTO TRIP (route_id, user_id, category, completed, timestamp) VALUES (?, ?, ?, ?, ?)`;
    const [result] = await pool.execute(query, [
      routeId,
      userId,
      category,
      completed,
      timestamp,
    ]);

    return result;
  } catch (error) {
    console.error("Error inserting :", error);
    throw error;
  }Trip
}

async function createMessage(requestId, senderUserId, text) {
  try {
    // Prepare the SQL query to insert a new message
    const query = `INSERT INTO MESSAGE (request_id, sender_user_id, text) VALUES (?, ?, ?)`;

    // Execute the query with the provided parameters
    const [result] = await pool.execute(query, [requestId, senderUserId, text]);

    // Return the result of the query execution
    return result;
  } catch (error) {
    console.error("Error inserting Message:", error);
    throw error;
  }
}

async function getMessagesByRequestId(requestId) {
  try {
    // Prepare the SQL query to fetch messages joined with all user information based on request_id
    const query = `
      SELECT 
        M.message_id, M.request_id, M.text, M.timestamp, M.sender_user_id,
        U.*
      FROM MESSAGE M
      JOIN USER U ON M.sender_user_id = U.user_id
      WHERE M.request_id = ?
      ORDER BY M.timestamp ASC;
    `;

    // Execute the query with the provided request_id
    const [rows] = await pool.execute(query, [requestId]);

    // Return the rows from the query result
    return rows;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
}

async function updateUserDetails(
  user_id,
  full_name,
  student_id,
  dob,
  phone_number,
  vehicle_make,
  vehicle_model,
  vehicle_year,
  license_plate,
  seat_capacity,
  home_address
) {
  try {
    const query = `UPDATE USER
        SET 
            full_name = ?,
            student_id = ?,
            dob = STR_TO_DATE(?, '%Y-%m-%dT%T.%fZ'),
            phone_number = ?,
            vehicle_make = ?,
            vehicle_model = ?,
            vehicle_year = ?,
            license_plate = ?,
            seat_capacity = ?,
            home_address = ?
        WHERE user_id = ?;`;

    const [result] = await pool.execute(query, [
      full_name,
      student_id,
      dob,
      phone_number,
      vehicle_make,
      vehicle_model,
      vehicle_year,
      license_plate,
      seat_capacity,
      home_address,
      user_id,
    ]);
    return result;
  } catch (error) {
    console.error(`Error updating user entry: ${error}`);
    throw error;
  }
}

async function getStopsWithTripId(tripId) {
  try {
    const query = `
            SELECT STOP.*, USER.*
            FROM STOP
            JOIN TRIP ON STOP.trip_id = TRIP.trip_id
            JOIN USER ON STOP.user_id = USER.user_id
            WHERE STOP.trip_id = ?
        `;
    const [stops] = await pool.execute(query, [tripId]);
    return stops;
  } catch (error) {
    console.error("Error fetching Stops with tripId:", error);
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
    console.error("Error fetching Routes with routeId:", error);
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

async function getTripsWithTripId(tripId) {
  const query = `
        SELECT * FROM TRIP
        WHERE trip_id = ?
    `;
  const [trip] = await pool.execute(query, [tripId]);
  return trip;
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
    console.log("Trips with User ID:", trips);
    return trips;
  } catch (error) {
    console.error("Error fetching Trips with User ID:", error);
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
    throw error;
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
    console.log("Trips:", trips);
    return trips;
  } catch (error) {
    console.error("Error fetching riding trips with userId:", error);
    throw error;
  }
}

async function getRideRequestsWithUserId(userId) {
  const outgoingQuery = `
    SELECT 
        rr.*,  
        u.full_name AS user_full_name,  
        u.email AS user_email,  
        t.*,  
        rt.*
    FROM 
        RIDEREQUEST rr
    JOIN 
        USER u ON rr.outgoing_user_id = u.user_id  
    JOIN 
        TRIP t ON rr.trip_id = t.trip_id  
    JOIN 
        ROUTE rt ON t.route_id = rt.route_id
    WHERE
        rr.outgoing_user_id = ?;
`;

  const incomingQuery = `
    SELECT 
        rr.*,  
        u.full_name AS user_full_name,   
        u.email AS user_email,  
        t.*,  
        rt.*
    FROM 
        RIDEREQUEST rr
    JOIN 
        USER u ON rr.outgoing_user_id = u.user_id  
    JOIN 
        TRIP t ON rr.trip_id = t.trip_id  
    JOIN 
        ROUTE rt ON t.route_id = rt.route_id
    WHERE
        rr.incoming_user_id = ?;
`;

  try {
    const [outgoingRequests] = await pool.execute(outgoingQuery, [userId]);
    const [incomingRequests] = await pool.execute(incomingQuery, [userId]);
    const result = { outgoingRequests, incomingRequests };
    console.log(`db has result: ${JSON.stringify(result)}`);
    return result;
  } catch (error) {
    console.error("Failed to get ride requests:", error);
    throw error;
  }
}

const createRideRequest = async (
  incomingUserId,
  outgoingUserId,
  tripId,
  stopId
) => {
  const insertQuery =
    "INSERT INTO RIDEREQUEST (incoming_user_id, outgoing_user_id, trip_id, stop_id) VALUES (?, ?, ?, ?)";

  try {
    console.log(
      `incomingUserId: ${incomingUserId}, outgoingUserId: ${outgoingUserId}, tripId: ${tripId}, stopId: ${stopId}`
    );

    const [result] = await pool.execute(insertQuery, [
      incomingUserId,
      outgoingUserId,
      tripId,
      stopId,
    ]);
    return result;
  } catch (error) {
    console.error("Failed to create ride request:", error);
    throw error;
  }
};

const deleteRideRequestsWithRideRequestId = async (rideRequestId) => {
  const deleteQuery = "DELETE FROM RIDEREQUEST WHERE request_id = ?";

  try {
    const [result] = await pool.execute(deleteQuery, [rideRequestId]);
    return result;
  } catch (error) {
    console.error("Failed to delete ride request:", error);
    throw error;
  }
};
const deleteStopWithStopId = async (stopId) => {
  const deleteQuery = "DELETE FROM STOP WHERE stop_id = ?";

  try {
    const [result] = await pool.execute(deleteQuery, [stopId]);
    return result;
  } catch (error) {
    console.error("Failed to delete stop:", error);
    throw error;
  }
};
const updateStopTripId = async (stopId, tripId) => {
  const updateQuery = "UPDATE STOP SET trip_id = ? WHERE stop_id = ?";

  try {
    const [result] = await pool.execute(updateQuery, [tripId, stopId]);
    console.log(`success updating stop! ${result}`);
    return result;
  } catch (error) {
    console.error("Failed to update stop:", error);
    throw error;
  }
};

async function recomputeRoute(routeId, tripId) {
  console.log("Inside recompute route");
  console.log(routeId);
  console.log(tripId);

  let routeQuery = `SELECT * FROM ROUTE WHERE route_id = ?`;
  const [routeResult] = await pool.execute(routeQuery, [routeId]);

  let stopsQuery = `SELECT * FROM STOP WHERE trip_id = ? ORDER BY stop_id ASC`;
  const [stopsResult] = await pool.execute(stopsQuery, [tripId]);

  let route = routeResult[0];
  let route_origin = {
    latitude: route.origin_latitude,
    longitude: route.origin_longitude,
  };
  let route_destination = {
    latitude: route.destination_latitude,
    longitude: route.destination_longitude,
  };

  let stops = stopsResult.map((stop) => ({
    latitude: stop.latitude,
    longitude: stop.longitude,
  }));

  const googleRouteResponse = await getRoutes(
    route_origin,
    route_destination,
    stops
  );
  const newRoutePolyline =
    googleRouteResponse.routes[0].polyline.encodedPolyline;

  const newRouteTime = googleRouteResponse.routes[0].duration;
  console.log(newRouteTime);

  let updateRouteQuery = `UPDATE ROUTE SET route_polyline = ?, route_time = ? WHERE route_id = ?`;
  const [updateResult] = await pool.execute(updateRouteQuery, [
    newRoutePolyline,
    newRouteTime,
    routeId,
  ]);
  console.log("Route updated with new polyline:", updateResult);
  return updateResult;
}

const deleteTripWithTripId = async (tripId) => {
  const deleteQuery = "DELETE FROM TRIP WHERE trip_id = ?";

  try {
    const [result] = await pool.execute(deleteQuery, [tripId]);
    return result;
  } catch (error) {
    console.error("Failed to delete trip:", error);
    throw error;
  }
};
const getTripAndRouteIdByStopId = async (stopId) => {
  console.log(`stop id inside db function: ${stopId}`);
  const query = `
      SELECT 
        S.trip_id, 
        T.route_id 
      FROM STOP S
      JOIN TRIP T ON S.trip_id = T.trip_id
      WHERE S.stop_id = ?
    `;

  try {
    const [rows] = await pool.execute(query, [stopId]);
    console.log("after rows");
    console.log(JSON.stringify(rows));

    if (rows.length > 0) {
      const { trip_id, route_id } = rows[0];
      return { trip_id, route_id };
    } else {
      console.log("Found null");
      return null;
    }
  } catch (error) {
    console.error("Failed to fetch trip_id and route_id for stop:", error);
    throw error;
  }
};

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
  updateUserDetails,
  getRideRequestsWithUserId,
  createRideRequest,
  deleteRideRequestsWithRideRequestId,
  updateStopTripId,
  getTripsWithTripId,
  recomputeRoute,
  deleteStopWithStopId,
  deleteTripWithTripId,
  getTripAndRouteIdByStopId,
  createMessage,
  getMessagesByRequestId,
  addPFP,
};
