const express = require("express");
//Database connecton
//db.query('<SQL>'), db.execute('<SQL>') for read, insert
const pool = require("./database");
const cors = require("cors");
const { authenticate } = require("./middleware");
const { FIREBASE_ADMIN } = require("./firebase");
const path = require('path');
const {
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
} = require("./databaseFunctions");
const { getRoutes, getCoordinatesOfAddress } = require("./utils");
const multer = require('multer');
const fs = require('fs');


const app = express();

const imagesFolder = path.join(__dirname, 'images');
const defaultDirectory = __dirname;
const upload = multer({ dest: imagesFolder });

const PORT = 3000;

//Midleware
app.use(express.json());
app.use(cors());

// Check database connection on server startup
// pool
//   .query("SELECT 1")
//   .then(() => {
//     console.log("Connected to the database!");
//   })
//   .catch((err) => {
//     console.error("Failed to connect to the database:", err);
//   });

//Tests connection to db with query to 'test' table
//Expected res: [{"name":"Alice"},{"name":"Bob"}]
app.get("/", async (req, res) => {
  res.json({ message: "Hello world!" });
});

//Setting up api endpoints
app.get("/posts/", authenticate, (req, res) => {
  res.json({ user: "antonryoung02@gmail.com", title: "First Post" });
});

// posts test
app.get("/postsTest", async (req, res) => {
  try {
    const [results, fields] = await pool.query("SELECT * FROM posts");
    res.json(results);
  } catch (error) {
    console.error("Error fetching data from the database:", error);
    res.status(500).json({
      error: "An error occurred while fetching data from the database",
      message: error.message,
    });
  }
});

// test end point for submitting post.
app.post("/submitPost", (req, res) => {
  const postData = req.body;
  console.log("Received data:", postData);
  res.json({ message: "Data received successfully" });
});

//Change this to /users/:userId to get info about specific user
app.post("/users", authenticate, async (req, res) => {
  console.log("INSIDE /USERS");
  const user_id = req.body.userId;
  const email = req.body.email;
  console.log(`Inserting into users user_id ${user_id} and email ${email}`);
  try {
    const query = "INSERT INTO USER (user_id, email) VALUES (?, ?)";
    const [result] = await pool.execute(query, [user_id, email]);
    console.log(result);
    return res.status(200).json({ message: "User successfully inserted" });
  } catch (error) {
    console.error("Error inserting user:", error.message);
    return res.status(500).json({ message: "Failed to insert user" });
  }
});

app.post('/uploadPFPImage', upload.none(), authenticate, async (req, res) => {
  try {

    console.log(imagesFolder);
    const userId = req.body.userId;
    const email = req.body.email;
    const imgData = req.body.base64Img;

    const imageName = `${userId}-${Date.now()}.jpg`;
    const imagePath = path.join(imagesFolder, imageName);

    const imgBuffer = Buffer.from(imgData, 'base64');
    fs.writeFileSync(imagePath, imgBuffer);
    const imageUrl = `/images/${imageName}`;

    const result = await addPFP(userId, imageUrl);
    console.log(result.previousPfpPath);

    // prev
    const previousPfpPath = result.previousPfpPath;
    if (previousPfpPath && previousPfpPath !== "") {
      const previousImagePath = path.join(defaultDirectory, previousPfpPath);
      fs.unlinkSync(previousImagePath);
      console.log(`Previous profile picture ${previousPfpPath} deleted successfully.`);
    }

    res.status(200).send({ message: 'Image uploaded successfully', imageUrl });
  } catch (error) {
    console.error('Error processing data:', error);
    res.status(500).send('Internal server error');
  }
});

app.use('/images', express.static(imagesFolder));

app.post("/users/info", authenticate, async (req, res) => {
  console.log(`Got users/info data ${JSON.stringify(req.body)}`);
  await updateUserDetails(
    req.body.userId,
    req.body.fullName,
    req.body.studentId,
    req.body.dob,
    req.body.phoneNumber,
    req.body.vehicleInfo.make,
    req.body.vehicleInfo.model,
    req.body.vehicleInfo.year,
    req.body.vehicleInfo.licensePlate,
    req.body.vehicleInfo.seatCapacity,
    req.body.homeAddress
  );
  return res.status(200).json({});
});

app.get("/users/:userId", authenticate, async (req, res) => {
  const userId = req.params.userId;

  try {
    const [rows, fields] = await pool.execute(
      "SELECT * FROM USER WHERE user_id = ?",
      [userId]
    );
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).send("User not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred");
  }
});

app.post("/routes", authenticate, async (req, res) => {
  // const user_id = req.body.userId;
  // const originAddress = req.body.originAddress;
  // const destinationAddress = req.body.destinationAddress;
  // try {
  //   const result = await createRoute(originAddress, destinationAddress, user_id);
  //   console.log(result);
  //   return res.status(200).json({message: "New Route successfully inserted"});
  // } catch (error) {
  //   console.error('Error inserting Route:', error.message);
  //   return res.status(500).json({message: "Failed to insert Route"});
  // }
  console.log(
    "This endpoint likely isn't necessary... Only need to create a trip or a stop"
  );
});

app.post("/messages", authenticate, async (req, res) => {
  const { text, senderUserId, requestId } = req.body;
  console.log(
    `MESSAGES/POST: text: ${text}, senderUserId:${senderUserId}, requestId:${requestId}`
  );

  try {
    // Insert the new message into the database
    const result = await createMessage(requestId, senderUserId, text);

    // Respond with success and the inserted message ID
    res
      .status(201)
      .json({ message: "Message created successfully", id: result.insertId });
  } catch (error) {
    // Handle any errors that occurred during the message creation
    console.error("Failed to create message:", error);
    res.status(500).json({ error: "Failed to create message" });
  }
});

app.get("/messages/:requestId", authenticate, async (req, res) => {
  const { requestId } = req.params;

  try {
    // Retrieve messages and their sender's details by request_id
    const messages = await getMessagesByRequestId(requestId);

    // Respond with the fetched messages
    res.status(200).json({ messages });
  } catch (error) {
    // Handle any errors that occurred during fetching the messages
    console.error("Failed to retrieve messages:", error);
    res.status(500).json({ error: "Failed to retrieve messages" });
  }
});

app.post("/stops", authenticate, async (req, res) => {
  const stopAddress = req.body.stopAddress;
  const outgoingUserId = req.body.userId;
  const routeId = req.body.routeId;
  const tripId = req.body.tripId;
  const incomingUserId = req.body.incomingUserId;
  console.log("Here");

  //console.log(req.body);

  if (!stopAddress || !outgoingUserId) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    const result = await createStop(
      stopAddress,
      outgoingUserId,
      tripId,
      routeId
    );
    const stopId = result.insertId;

    const requestResult = await createRideRequest(
      incomingUserId,
      outgoingUserId,
      tripId,
      stopId
    );
    res
      .status(200)
      .json({ message: "Stop created successfully", stopId: result.insertId });
  } catch (error) {
    console.error("Error creating Stop or ride request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/trips", authenticate, async (req, res) => {
  const user_id = req.body.userId;
  const originAddress = req.body.originAddress;
  const destinationAddress = req.body.destinationAddress;
  const category = req.body.category;
  const completed = req.body.completed;
  const timestamp = req.body.timestamp;

  console.log("Initialized params");

  try {
    const route = await createRoute(originAddress, destinationAddress, user_id);
    const route_id = route.insertId;
    const result = await createTrip(
      route_id,
      user_id,
      category,
      completed,
      timestamp
    );
    return res.status(200).json({ message: "New Trip successfully inserted" });
  } catch (error) {
    console.error("Error inserting Trip:", error.message);
    return res.status(500).json({ message: "Failed to insert Trip" });
  }
});

//SHOULD BE trips/:userId
//Gets all trips of userId (driving AND riding) and returns them
app.get("/rides/:userId/:findAll", authenticate, async (req, res) => {
  try {
    const userId = req.params.userId;
    const findAll = req.params.findAll;

    let driving_trips = await getDrivingTripsWithUserId(userId, findAll);
    let riding_trips = await getRidingTripsWithUserId(userId, findAll);
    let combinedTrips = [...driving_trips, ...riding_trips];
    //Filter out duplicates just in case.
    let trips = combinedTrips.filter(
      (trip, index, self) =>
        index === self.findIndex((t) => t.trip_id === trip.trip_id)
    );

    trips.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    let allUserTrips = [];

    for (let trip of trips) {
      // const tripDate = new Date(trip.timestamp);
      // console.log(tripDate);

      // if (tripDate <= new Date()) {
      //     continue;
      // }
      let trip_route = await getRoutesWithRouteId(trip.route_id); // Assuming getTripsWithUserId includes route details

      const origin = {
        latitude: trip_route[0].origin_latitude,
        longitude: trip_route[0].origin_longitude,
      };
      const destination = {
        latitude: trip_route[0].destination_latitude,
        longitude: trip_route[0].destination_longitude,
      };

      const addresses = {
        origin_address: trip_route[0].origin_address,
        destination_address: trip_route[0].destination_address,
      };
      const created_user_email = await getEmailFromUserId(trip.user_id);

      let trip_stops = await getStopsWithTripId(trip.trip_id);

      allUserTrips.push({
        route: trip_route[0],
        stops: trip_stops,
        email: created_user_email[0].email,
        trip: trip,
      });
    }
    res.status(200).json(allUserTrips);
  } catch (error) {
    console.error("Error fetching user rides:", error);
    res.status(500).json({ message: "Failed to fetch user rides" });
  }
});

/* We want this to return profile, and trip information. 

Return user of the outgoing_user_id because they are making the request

Join on trip, so that you can see extra info.
*/
app.get("/riderequests/:userId", authenticate, async (req, res) => {
  const user_id = req.params.userId;
  console.log("Making get riderequests request");

  try {
    const { outgoingRequests, incomingRequests } =
      await getRideRequestsWithUserId(user_id);
    res.json({
      outgoingRequests,
      incomingRequests,
    });
  } catch (error) {
    console.log(`error: ${error}`);
    res.status(500).send({ message: "Error fetching ride requests" });
  }
});

app.delete("/riderequests/:rideRequestId", authenticate, async (req, res) => {
  const rideRequestId = req.params.rideRequestId;
  console.log("Making delete rideRequests request");

  try {
    const result = await deleteRideRequestsWithRideRequestId(rideRequestId);

    if (result.affectedRows > 0) {
      res.send({ message: "Ride request deleted successfully" });
    } else {
      console.log("No request found");
      res
        .status(404)
        .send({ message: "No ride request found for the provided ID" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error deleting ride request" });
  }
});

app.patch("/riderequests", authenticate, async (req, res) => {
  const { rideRequestId, stopId, tripId } = req.body;

  try {
    console.log(`stopId: ${stopId} tripId: ${tripId}`);
    const updateResult = await updateStopTripId(stopId, tripId);

    const deleteResult = await deleteRideRequestsWithRideRequestId(
      rideRequestId
    );

    const trip = await getTripsWithTripId(tripId);
    const routeId = trip[0].route_id;

    const result = await recomputeRoute(routeId, tripId);

    if (deleteResult.affectedRows > 0) {
      res.send({ message: "Ride request accepted and deleted successfully" });
    } else {
      res
        .status(404)
        .send({ message: "No ride requests found for the provided ID" });
    }
  } catch (error) {
    console.error("Error processing the request:", error);
    res.status(500).send({ message: "Error accepting ride request" });
  }
});

app.delete("/stops/:stopId", authenticate, async (req, res) => {
  const { stopId } = req.params; // Extracting stopId from the route parameters
  console.log(`stopId: ${stopId}`);

  try {
    const { trip_id, route_id } = await getTripAndRouteIdByStopId(stopId);
    const result = await deleteStopWithStopId(stopId);

    await recomputeRoute(trip_id, route_id);

    console.log("After recompute route");

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Stop not found" });
    }
    res.status(200).json({ message: "Stop deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: `Failed to delete the stop: ${error}` });
  }
});

app.delete("/trips/:tripId", authenticate, async (req, res) => {
  const { tripId } = req.params;

  try {
    const result = await deleteTripWithTripId(tripId);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Trip not found" });
    }

    res.status(200).json({ message: "Trip deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete the trip" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
