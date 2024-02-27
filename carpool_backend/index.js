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
  getStopsWithRouteId,
  getStopsWithUserId,
  getTripsWithRouteId,
  getDrivingTripsWithUserId,
  getRidingTripsWithUserId,
  getRoutesWithRouteId
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
  const user_id = req.body.userId;
  const email = req.body.email;
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

  if (!stopAddress || !userId) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
      const result = await createStop(stopAddress, userId, routeId);
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
    console.log(route_id);
    console.log('route_id:', route_id);
    console.log('user_id:', user_id);
    console.log('category:', category);
    console.log('completed:', completed);
    console.log('timestamp:', timestamp);
    const result = await createTrip(route_id, user_id, category, completed, timestamp);
    return res.status(200).json({message: "New Trip successfully inserted"}); 
  } catch (error) {
    console.error('Error inserting Trip:', error.message);
    return res.status(500).json({message: "Failed to insert Trip"});
  }
});

//SHOULD BE trips/:userId
//Gets all trips of userId (driving AND riding) and returns them
app.get('/rides/:userId?', authenticate, async(req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      userId = null;
    }
    let driving_trips = await getDrivingTripsWithUserId(userId);
    let riding_trips = await getRidingTripsWithUserId(userId);
    let trips = [...driving_trips, ...riding_trips];

    trips.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    let allUserTrips = [];

    for (let trip of trips) {
      console.log(trip.route_id);
      let trip_route = await getRoutesWithRouteId(trip.route_id); // Assuming getTripsWithUserId includes route details

      const origin = {latitude: trip_route[0].origin_latitude, longitude: trip_route[0].origin_longitude};
      const destination = {latitude: trip_route[0].destination_latitude, longitude: trip_route[0].destination_longitude};
      const timestamp = trip.timestamp;
      
      let trip_stops = await getStopsWithRouteId(trip.route_id);
      let route = await getRoutes(origin, destination, trip_stops);
      
      const stops = trip_stops;
      
      allUserTrips.push({route: route, stops: stops, timestamp: timestamp});
    };
    console.log(`Number of trips returned: ${allUserTrips.length}`);
    res.status(200).json(allUserTrips);
  } catch (error) {
    console.error('Error fetching user rides:', error);
    res.status(500).json({message: 'Failed to fetch user rides'});
  }

  //HARDCODED FOR NOW
  //const route = {"distanceMeters":13105,"duration":"1709s","polyline":{"encodedPolyline":"el}jFr}hfPg@dKoB|WxD^nPpATLtIt@\\GrJv@nCJpALd@x@FTCzASrEa@lMaAG`AF`@mMTeGPsFd@uJVcH\\aCXcAb@_Af@y@h@u@Rm@HmAdCkj@xAw[T[f@UdH|@v@mQ`@kI_AaASKkDYyAQwAr[g@p@kGq@uPyBuLeA{@Si@OyAQmGi@wBUeCrh@uBGsADyATiInBuAL}AAcFe@q@De@Pi@^c@f@rB{c@eAGw@Bi@JaCjAiAZaABk`@kDg_@}CeDc@_ASyEg@sCWxHr@r@J~@RlEh@db@jDjW|B~KaTLYXs@Ny@Fk@JWPkDVmGCW`@qIp@IHG^FhAJNHzPvAPNxLjAVKdBPfAwTB_A"},"optimizedIntermediateWaypointIndex":[2,1,3,0]};
  //const stops = {origin:{latitude:38.6583662, longitude:-90.3267726, name:"anton@wustl.edu"}, destination:{latitude:38.6557666, longitude:-90.30495909999999, name:"Blueberry Hill"}};
  //const timestamp = "1709020800";
  //res.json([{route: route, stops: stops, timestamp: timestamp}]);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});