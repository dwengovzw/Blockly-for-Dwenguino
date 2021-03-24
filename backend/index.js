import express from 'express';
import fs from 'fs';
import http from 'http';
import https from 'https';

//let express = require('express');
// Import body parser
// import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
//mongoose.set('debug', true);
import path from 'path';

import ChromeLauncher from 'chrome-launcher';

// Import blockly router
import blocklyRoutes from './routes/blockly-routes.js';
//let blocklyRoutes = require('./routes/blockly-routes');

// For deploying to production
import compression from 'compression';
import helmet from 'helmet';

// For profiling the application in development
import profiler from 'v8-profiler-node8'

// Load environment variables
dotenv.config();

let __dirname = path.resolve();
console.log(`dirname: ${__dirname}`);

// For SSL certificates
let key = fs.readFileSync('/home/ubuntu/certs/private.key');
let cert = fs.readFileSync('/home/ubuntu/certs/certificate.crt');
let ca = fs.readFileSync('/home/ubuntu/certs/ca_bundle.crt');

let options = {
        key: key,
        cert: cert,
        ca: ca
};

// Initialize the app
let app = express();

if (process.env.NODE_ENV === 'production') {
    app.use(compression());
    app.use(helmet());
}

app.use(cookieParser());

app.use(express.json()); //Used to parse JSON bodies
app.use(express.urlencoded({extended: true})); //Parse URL-encoded bodies

// // Configure bodyparser to handle post requests
// app.use(bodyParser.urlencoded({
//     extended: true
// }));
// app.use(bodyParser.json({ type: 'application/*+json' }));

// connect to Mongoose and set connection variable
// Depricate: mongoose.connect();
let dev_db_url = 'mongodb://localhost/dwenguinoblockly';
//let dev_db_url = 'mongodb://localhost/testingFuncSave';
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

app.use((req, res, next) => {
        if(req.protocol ==='http') {
                res.redirect(301, `https://${req.headers.host}${req.url}`);
        }
        next();
});

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '..', 'Blockly-for-Dwenguino')));
} else {
    // Setup static file serving
    // Changed for debugging, use first line when debugging
    //app.use('/dwenguinoblockly', express.static(path.join(__dirname, 'Blockly-for-Dwenguino')));
    app.use('/dwenguinoblockly', express.static(path.join(__dirname, '..', 'Blockly-for-Dwenguino')));
}

// Use blockly routes for the app
app.use('/', blocklyRoutes);
// Add default route
app.get("/", (req, res) => res.send('Welcome to blockly'));

// Setup server port
var port = process.env.PORT || 12032;
console.log("Port: " + port);

const httpServer = http.createServer(app);
const httpsServer = https.createServer(options, app);

// Launch app to listen to specified port
httpServer.listen(port, function () {
    console.log("Running HTTP server on port " + port);
});

httpsServer.listen(443, function () {
   console.log("Running HTTPS server on port 443");
});

//This is depricated, now the electron browser is which is started using a bash script
/*if (process.env.NODE_ENV === 'production') {
    module.export = app;
} else {
    // Launch a browser window
    
    ChromeLauncher.launch({
        startingUrl: 'http://localhost:12032/dwenguinoblockly',
        chromeFlags: ['--star-fullscreen', '--start-maximized'],
    }).then(chrome => {
        chrome.process.on('close', (code) => {
            console.log("browser window closed, closing application");
            server.close();
            process.exit();
        });
    });
}*/
