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
import i18n from 'i18n-x';
import nodemailer from 'nodemailer';

import ChromeLauncher from 'chrome-launcher';

// Import blockly router
import blocklyRoutes from './routes/blockly-routes.js';
//let blocklyRoutes = require('./routes/blockly-routes');

// For deploying to production
import compression from 'compression';
import helmet from 'helmet';

// For profiling the application in development
import profiler from 'v8-profiler-node8'


// For cross origin requests in standalone and debug mode
import cors from 'cors'

// Load environment variables
dotenv.config();

let __dirname = path.resolve();
console.log(`dirname: ${__dirname}`);

let key, cert, ca = 0;
let options = {}

// Setup server port
var port = process.env.PORT || 12032;
console.log("Port: " + port);


let sslPort = process.env.SSLPORT || 443;;
console.log("SSL port: " + sslPort);


/** There are three environment settings
 *  1) production: set in the .env file on the server.
 *  2) standalone: set by the local server in the install.sh script.
 *  3) development: Not explicitly set in the environment (assumed when no environment is set)
 *  */ 

// Use server sertificate in production and local self signed certificate in standalone and debug mode.
if (process.env.NODE_ENV === 'production') {
    // For SSL certificates
    options['key'] = fs.readFileSync('/home/ubuntu/certs/private.key');
    options['cert'] = fs.readFileSync('/home/ubuntu/certs/certificate.crt');
    options['ca'] = fs.readFileSync('/home/ubuntu/certs/ca_bundle.crt');
    
    
}else if (process.env.NODE_ENV === 'standalone'){
    options['key'] = fs.readFileSync('./security/cert.key');
    options['cert'] = fs.readFileSync('./security/cert.pem');
}else{
    options['key'] = fs.readFileSync('./backend/security/cert.key');
    options['cert'] = fs.readFileSync('./backend/security/cert.pem');
}



// Initialize the app
let app = express();

// Set view engine
app.set('view engine', 'pug');
app.set('views', './views');

// Optimizations for production
if (process.env.NODE_ENV === 'production') {
    app.use(compression());
    app.use(helmet());
}else{
    app.use(cors({
        origin: '*'
      }));
}

app.use(cookieParser());
app.use(i18n({
    locales: ['en', 'nl'], 
    directory: 'msg',
    jointDir: 'msg',
    defaultLocale: 'en',
    queryParameter: 'lang',
    cookieName: 'lang',
    order: ['cookie', 'query', 'headers']
}));

app.use(express.json()); //Used to parse JSON bodies
app.use(express.urlencoded({extended: true})); //Parse URL-encoded bodies

let emailOptions = { 
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    },
    debug: true,
    logger: true
}
const emailService = nodemailer.createTransport(emailOptions);
console.log(emailService);

export default emailService;

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

if (process.env.NODE_ENV === 'production') {
    // Redirect http requests to https
    app.use((req, res, next) => {
        let redirectport = (sslPort != 443 ? `:${sslPort}` : "")
            if(req.protocol ==='http') {
                    res.redirect(301, `https://${req.hostname}${redirectport}${req.url}`);
            }
            next();
    });
}



    // Setup static file serving
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '..', 'Blockly-for-Dwenguino')));
} else if (process.env.NODE_ENV === 'standalone') {
    app.use('/dwenguinoblockly', express.static(path.join(__dirname, '..', 'Blockly-for-Dwenguino')));
} else {
    // Debug setup
    app.use('/dwenguinoblockly', express.static(path.join(__dirname, 'Blockly-for-Dwenguino')));
}

// Use blockly routes for the app
app.use('/', blocklyRoutes);
// Add default route
app.get("/", (req, res) => res.send('Welcome to blockly'));



const httpServer = http.createServer(app);
// Launch app to listen to specified port
httpServer.listen(port, function () {
    console.log("Running HTTP server on port " + port);
});

const httpsServer = https.createServer(options, app);
httpsServer.listen(sslPort, function () {
    console.log("Running HTTPS server on port " + sslPort);
});




//This is depricated, now the electron browser is which is started using a bash script
if (!(process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'standalone')) {
    // Launch a browser window for debugging
    ChromeLauncher.launch({
        startingUrl: 'https://localhost:' + sslPort + '/dwenguinoblockly',
        chromeFlags: ['--star-fullscreen', '--start-maximized'],
    }).then(chrome => {
        chrome.process.on('close', (code) => {
            console.log("browser window closed, closing application");
            server.close();
            process.exit();
        });
    });
}
