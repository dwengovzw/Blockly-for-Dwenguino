import { app, port, sslPort, options } from "./server.js";
import http from 'http';
import https from 'https';
import mongoose from 'mongoose';


const httpServer = http.createServer(app);


let dev_db_url = 'mongodb://localhost/dwenguinoblockly';
let mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
var db = mongoose.connection;

if (!db) {
    console.log("Error connecting to db");
} else {
    console.log("db connection succesfull");
}



// Launch app to listen to specified port
httpServer.listen(port, function () {
    console.log("Running HTTP server on port " + port);
});


