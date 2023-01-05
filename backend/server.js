import express from 'express';
import fs from 'fs';

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

//import ChromeLauncher from 'chrome-launcher';

// Import blockly router
import blocklyRoutes from './routes/blockly-routes.js';

// Import statistics routes
import statsRoutes from './routes/stats-routes.js'

// For deploying to production
import compression from 'compression';
import helmet from 'helmet';

// For profiling the application in development
//import profiler from 'v8-profiler-node8'


// For cross origin requests in standalone and debug mode
import cors from 'cors'

let __dirname = path.resolve();
console.log(`dirname: ${__dirname}`);

// Load environment variables
dotenv.config({path: __dirname + '/.env'}); // configure .env location

let key, cert, ca = 0;
let options = {}

// Setup server port
var port = 12032;
console.log("Port: " + port);


let sslPort = process.env.SSLPORT || 443;;
console.log("SSL port: " + sslPort);


// Initialize the app
let app = express();

// Set view engine
app.set('view engine', 'ejs');  
let viewDirs = JSON.parse(process.env.VIEWS_DIR).map((elem) => {return __dirname + "/" + elem})
app.set('views', viewDirs);   // For debug
//app.set('views', '../Blockly-for-Dwenguino');

// Optimizations for production
if (process.env.NODE_ENV === 'production') {
    app.use(compression());
    app.use(helmet({
        frameguard: false // Allow use in iframe
      }));
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


    // Setup static file serving
if (process.env.NODE_ENV === 'production') {
    app.use('/dwenguinoblockly', express.static(path.join(__dirname, 'Blockly-for-Dwenguino')));
} else if (process.env.NODE_ENV === 'standalone') {
    app.use('/dwenguinoblockly', express.static(path.join(__dirname, '..', 'Blockly-for-Dwenguino')));
} else {
    // Debug setup
    app.use('/dwenguinoblockly', express.static(path.join(__dirname, 'Blockly-for-Dwenguino')));
}

// Set favicon
app.get("/favicon.ico", (req, res) => {
    return res.sendFile(path.join(__dirname + "/Blockly-for-Dwenguino/favicon.ico"));
})

// Use blockly routes for the app
app.use('/', blocklyRoutes);

// Use statistics routes
app.use('/stats', statsRoutes);

// Add default route
app.get("/", (req, res) => res.send('Welcome to blockly'));


export { app, port, sslPort, options }


