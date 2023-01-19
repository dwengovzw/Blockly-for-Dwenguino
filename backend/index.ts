import dotenv from 'dotenv';
import path from 'path';
import { Role } from "./models/role.model.js"
let __dirname = path.resolve();
console.log(`dirname: ${__dirname}`);

// Load environment variables
dotenv.config({path: __dirname + '/backend/.env'}); // configure .env location

import { app, port } from "./server.js";
import http from 'http';
import mongoose from 'mongoose';

const httpServer = http.createServer(app);

mongoose.Promise = global.Promise;

let dev_db_url = 'mongodb://localhost/dwenguinoblockly_test_users';
let mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB/*, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}*/).then(() => {
    if (process.env.ERASE_DATABASE_ON_SYNC){
        dropDb();
    }
    console.log("Successfully connected to the MongoDb database.");
    initDb();
    launch();
}).catch((err) => {
    console.log(`Error connecting to db: ${err}`);
    console.log(`Quiting...`)
});

let dropDb = () => {
    console.log("DROPPING DATABASE")
    mongoose.connection.dropDatabase();
}

let initDb = () => {
    // Add default roles 
    Role.estimatedDocumentCount((err, count) => {
        if (!err && count  === 0) {
            let roleNames = ["student", "teacher", "admin"]
            roleNames.forEach((role) => {
                new Role({
                    name: role
                }).save((err) => {
                    if (err) {
                        console.log("Error", err);
                    } else {
                        console.log(`Added ${role} role`);
                    }
                });
            })
        }
    })
}

let launch = () => {
    // Launch app to listen to specified port
    httpServer.listen(port, function () {
    console.log("Running HTTP server on port " + port);
});
}

