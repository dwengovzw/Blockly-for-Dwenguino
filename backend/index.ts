import * as dotenv from 'dotenv';
import * as path from 'path';
import { Role } from "./models/role.model.js"
let __dirname = path.resolve();
console.log(`dirname: ${__dirname}`);

// Load environment variables
dotenv.config({path: __dirname + '/backend/.env'}); // configure .env location

import { app, port } from "./server.js";
import * as http from 'http';
import mongoose from 'mongoose';
import { mockDatabaseData } from './utils/add_mock_database_data.js';

const httpServer = http.createServer(app);

mongoose.Promise = global.Promise;

let dev_db_url = 'mongodb://localhost/dwenguinoblockly_test_users';
let mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB/*, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}*/).then(async () => {
    if (process.env.ERASE_DATABASE_ON_SYNC){
        dropDb();
    }
    console.log("Successfully connected to the MongoDb database.");
    if (process.env.NODE_ENV == "debug"){
        console.log("Creating mock data in debug mode!");
        await initDb();
    }
    console.log(("Starting web server"));
    launch();
}).catch((err) => {
    console.log(`Error connecting to db: ${err}`);
    console.log(`Quiting...`)
});

let dropDb = () => {
    console.log("DROPPING DATABASE")
    mongoose.connection.dropDatabase();
}

let initDb = async () => {
    await mockDatabaseData()
}

let launch = () => {
    // Launch app to listen to specified port
    httpServer.listen(port, function () {
    console.log("Running HTTP server on port " + port);
});
}

