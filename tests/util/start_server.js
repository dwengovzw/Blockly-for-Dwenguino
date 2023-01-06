import http from 'http'
import { app, port } from "../../backend/server.js"
import mongoose from 'mongoose';

const httpServer = http.createServer(app);
let db = null;

let startServer = () =>
{
    return new Promise(async (resolve, reject) => {
        await mongoose.disconnect()
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

let endServer = async () =>
{
    try {
        // Drop the test database is being dropped.
        await mongoose.connection.dropDatabase();
        // Connection to Mongo killed.
        await mongoose.disconnect();
        // Server connection closed.
        await httpServer.close();
      } catch (error) {
        console.log(`
          You did something wrong dummy!
          ${error}
        `);
        throw error;
      }
}

export { startServer, endServer }