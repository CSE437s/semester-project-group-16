const express = require('express');
//Database connecton
//db.query('<SQL>'), db.execute('<SQL>') for read, insert 
const pool = require('./database');
const cors = require('cors');
const {authenticate} = require("./middleware");
const { FIREBASE_ADMIN } = require("./firebase");
const {
  createRoute,
  createStop,
  createTrip,
  getStopsWithTripId,
  getTripsWithRouteId,
  getDrivingTripsWithUserId,
  getRidingTripsWithUserId,
  getRoutesWithRouteId,
  getEmailFromUserId
} = require("./databaseFunctions");
const {getRoutes, getCoordinatesOfAddress} = require('./utils');
const app = express();

const PORT = 3000;

//Midleware
app.use(express.json());
app.use(cors());

// Check database connection on server startup
pool.query('SELECT 1')
  .then(() => {
    console.log('Connected to the database!');
  })
  .catch((err) => {
    console.error('Failed to connect to the database:', err);
  });

//Tests connection to db with query to 'test' table
//Expected res: [{"name":"Alice"},{"name":"Bob"}]
app.get('/', async (req, res) => {
  res.json({message:"Hello world!"})
});

//Setting up api endpoints
app.get('/posts/', authenticate, (req, res) => {
  res.json({user: "antonryoung02@gmail.com", title:"First Post"});
});

// posts test
app.get('/postsTest', async (req, res) => {
  try {
    const [results, fields] = await pool.query('SELECT * FROM posts');
    res.json(results);
  } catch (error) {
    console.error('Error fetching data from the database:', error);
    res.status(500).json({ error: 'An error occurred while fetching data from the database', message: error.message });
  }
});

// test end point for submitting post. 
app.post('/submitPost', (req, res) => {
  const postData = req.body;
  console.log('Received data:', postData);
  res.json({ message: 'Data received successfully' });
});


//Change this to /users/:userId to get info about specific user
app.post('/users', authenticate, async(req, res) => {
  console.log("INSIDE /USERS");
  const user_id = req.body.userId;
  const email = req.body.email;
  console.log(`Inserting into users user_id ${user_id} and email ${email}`);
  try {
    const query = "INSERT INTO USER (user_id, email) VALUES (?, ?)";
    const [result] = await pool.execute(query, [user_id, email]);
    console.log(result);
    return res.status(200).json({message: "User successfully inserted"});
  } catch (error) {
    console.error('Error inserting user:', error.message);
    return res.status(500).json({message: "Failed to insert user"});
  }
});

app.post('/routes', authenticate, async(req, res) => {
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
  console.log("This endpoint likely isn't necessary... Only need to create a trip or a stop")
});

app.post('/stops', authenticate, async(req, res) => {
  const stopAddress = req.body.stopAddress;
  const userId = req.body.userId;
  const routeId = req.body.routeId;
  const tripId = req.body.tripId;

  //console.log(req.body);

  if (!stopAddress || !userId) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
      const result = await createStop(stopAddress, userId, tripId, routeId);
      res.status(200).json({ message: "Stop created successfully", stopId: result.insertId });
  } catch (error) {
      console.error('Error creating Stop:', error);
      res.status(500).json({ error: "Internal server error" });
  }
});

app.post('/trips', authenticate, async(req, res) => {
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
    const result = await createTrip(route_id, user_id, category, completed, timestamp);
    return res.status(200).json({message: "New Trip successfully inserted"}); 
  } catch (error) {
    console.error('Error inserting Trip:', error.message);
    return res.status(500).json({message: "Failed to insert Trip"});
  }
});

//SHOULD BE trips/:userId
//Gets all trips of userId (driving AND riding) and returns them
app.get('/rides/:userId/:findAll', authenticate, async(req, res) => {
  try {
    const userId = req.params.userId;
    const findAll = req.params.findAll;

    let driving_trips = await getDrivingTripsWithUserId(userId, findAll);
    let riding_trips = await getRidingTripsWithUserId(userId, findAll);
    let combinedTrips = [...driving_trips, ...riding_trips];
    //Filter out duplicates just in case.
    let trips = combinedTrips.filter((trip, index, self) =>
    index === self.findIndex((t) => (
        t.trip_id === trip.trip_id
    ))
);

    trips.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    let allUserTrips = [];

    for (let trip of trips) {
      console.log(trips.length);
      console.log(trip.route_id);
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
        destination_address: trip_route[0].destination_address
    }
      const timestamp = trip.timestamp;
      const created_user = trip.user_id;
      const created_user_email = await getEmailFromUserId(created_user);
      const category = trip.category;
      
      let trip_stops = await getStopsWithTripId(trip.trip_id);

      allUserTrips.push({route_polyline: trip_route[0].route_polyline, route_time: trip_route[0].route_time, stops: trip_stops, timestamp: timestamp, email: created_user_email[0], category:category, addresses: addresses, route_id: trip.route_id, trip_id: trip.trip_id});
    };
    console.log(`Number of trips returned: ${allUserTrips.length}`);
    res.status(200).json(allUserTrips);
  } catch (error) {
    console.error('Error fetching user rides:', error);
    res.status(500).json({message: 'Failed to fetch user rides'});
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});