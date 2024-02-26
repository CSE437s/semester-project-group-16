const express = require('express');
//Database connecton
//db.query('<SQL>'), db.execute('<SQL>') for read, insert 
const db = require('./database');
const cors = require('cors');
const {authenticate} = require("./middleware");
const { FIREBASE_ADMIN } = require("./firebase");
const app = express();

const PORT = 3000;

//Midleware
app.use(express.json());
app.use(cors());

//Tests connection to db with query to 'test' table
//Expected res: [{"name":"Alice"},{"name":"Bob"}]
app.get('/', async (req, res) => {
  res.json({message:"Hello world!"})
  // try {
  //   const [rows, fields] = await db.query("SELECT * FROM test");
  //   res.send(rows);
  // } catch (error) {
  //   console.error(error);
  // }
});

//Setting up api endpoints
app.get('/posts/', authenticate, (req, res) => {
  res.json({user: "antonryoung02@gmail.com", title:"First Post"});
});

//Change this to /users/:userId to get info about specific user
app.get('/users', authenticate, (req, res) => {
  //const userId = req.params.userId;
  res.json({user: "antonryoung02@gmail.com", name:"Anton", year:"Senior"});
});

//Maybe like a /rides/:userId/:timestamp?
//Res kind of like this
app.get('/rides/:userId', authenticate, (req, res) => {
  //const rideId = req.params.userId;
  //const timestamp = req.params.timestamp;

  //HARDCODED FOR NOW
  const route = {"distanceMeters":13105,"duration":"1709s","polyline":{"encodedPolyline":"el}jFr}hfPg@dKoB|WxD^nPpATLtIt@\\GrJv@nCJpALd@x@FTCzASrEa@lMaAG`AF`@mMTeGPsFd@uJVcH\\aCXcAb@_Af@y@h@u@Rm@HmAdCkj@xAw[T[f@UdH|@v@mQ`@kI_AaASKkDYyAQwAr[g@p@kGq@uPyBuLeA{@Si@OyAQmGi@wBUeCrh@uBGsADyATiInBuAL}AAcFe@q@De@Pi@^c@f@rB{c@eAGw@Bi@JaCjAiAZaABk`@kDg_@}CeDc@_ASyEg@sCWxHr@r@J~@RlEh@db@jDjW|B~KaTLYXs@Ny@Fk@JWPkDVmGCW`@qIp@IHG^FhAJNHzPvAPNxLjAVKdBPfAwTB_A"},"optimizedIntermediateWaypointIndex":[2,1,3,0]};
  const stops = {origin:{latitude:38.6583662, longitude:-90.3267726, name:"anton@wustl.edu"}, destination:{latitude:38.6557666, longitude:-90.30495909999999, name:"Blueberry Hill"}};
  const timestamp = "1709020800";
  res.json([{route: route, stops: stops, timestamp: timestamp}]);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});