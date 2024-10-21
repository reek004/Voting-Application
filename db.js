const mongoose = require('mongoose');
//----Must use the dotenv config
require('dotenv').config();

//Define the mongoDB connection URL

//Localhost of the database server
const mongoURL = 'mongodb://127.0.0.1:27017/votingApp';


//Db connection with mongoDB atlas cluster 
//const mongoURL = process.env.MONGODB_URL;

//To set up the mongoDB connection
mongoose.connect(mongoURL, {})

//Get the default connection
//MongoDB maintains a default connection object representing the MongoDB connection.
//This is the object
const db = mongoose.connection;

//Define EventListners

db.on('connected',()=>{
    console.log("MongoDB server connected");
})

db.on('error',(err)=>{
    console.log("MongoDB connection error");
})

db.on('disconnected',()=>{
    console.log("MongoDB server disconnected");
})

//export the database connection by exporting the db object

module.exports = db;