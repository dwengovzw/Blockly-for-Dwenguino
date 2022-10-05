import http from 'http'
import { app, port } from "../../backend/server.js"
import mongoose from 'mongoose';

const httpServer = http.createServer(app);
let db = null;

let startServer = () =>
{
    return new Promise((resolve, reject) => {
        setupDatabaseConnection();
        // Launch app to listen to specified port
        try {
            httpServer.listen(port, function () {
                console.log("Running HTTP server on port " + port);
                resolve();
            });
        }catch(err){
            reject();
        }
    })
}

let setupDatabaseConnection = () => {
    let dev_db_url = 'mongodb://localhost/dwenguinoblockly_test_db';
    let mongoDB = process.env.TEST_DATABASE_URL || dev_db_url;
    mongoose.connect(mongoDB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    db = mongoose.connection;
    if (!db) {
        console.log("Error connecting to db");
    } else {
        console.log("db connection succesfull");
    }
}

let endServer = () =>
{
    return new Promise(function (resolve) {
        httpServer.close((err) => {
            db.close(); // close database connection
            if (err){
                reject();
            }else{
                resolve();
            }
        })
    });
}

export { startServer, endServer }