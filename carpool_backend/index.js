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
//Returns ALL user's scheduled rides/drives
app.get('/rides/:userId', authenticate, (req, res) => {
  //const rideId = req.params.userId;
  //const timestamp = req.params.timestamp;
  res.json({origin:{latitude:38.6488, longitude:-90.3108, name:"WashU"}, destination:{latitude:38.6488, longitude:-90.3108, name:"WashU"}, arrival:"3pm"});
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});