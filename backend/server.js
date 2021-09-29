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

import ChromeLauncher from 'chrome-launcher';

// Import blockly router
import blocklyRoutes from './routes/blockly-routes.js';
//let blocklyRoutes = require('./routes/blockly-routes');

// For deploying to production
import compression from 'compression';
import helmet from 'helmet';

// For profiling the application in development
//import profiler from 'v8-profiler-node8'


// For cross origin requests in standalone and debug mode
import cors from 'cors'

// Load environment variables
dotenv.config();

let __dirname = path.resolve();
console.log(`dirname: ${__dirname}`);

let key, cert, ca = 0;
let options = {}

// Setup server port
var port = 12032;
console.log("Port: " + port);


let sslPort = process.env.SSLPORT || 443;;
console.log("SSL port: " + sslPort);


/** There are three environment settings
 *  1) production: set in the .env file on the server.
 *  2) standalone: set by the local server in the install.sh script.
 *  3) development: Not explicitly set in the environment (assumed when no environment is set)
 *  */ 

// Use server sertificate in production and local self signed certificate in standalone and debug mode.
/*if (process.env.NODE_ENV === 'production') {
    // For SSL certificates with Certbot from Let's Encrypt
    options['key'] = fs.readFileSync('/home/ubuntu/certs/privkey.pem');
    options['cert'] = fs.readFileSync('/home/ubuntu/certs/cert.pem');
}else if (process.env.NODE_ENV === 'standalone'){
    options['key'] = fs.readFileSync('./security/cert.key');
    options['cert'] = fs.readFileSync('./security/cert.pem');
}else{
    options['key'] = fs.readFileSync('./backend/security/cert.key');
    options['cert'] = fs.readFileSync('./backend/security/cert.pem');
}*/



// Initialize the app
let app = express();

// Set view engine
app.set('view engine', 'ejs');
app.set('views', './Blockly-for-Dwenguino');   // For debug
//app.set('views', '../Blockly-for-Dwenguino');

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


/*if (process.env.NODE_ENV === 'production') {
    // Redirect http requests to https
    app.use((req, res, next) => {
        let redirectport = (sslPort != 443 ? `:${sslPort}` : "")
            if(req.protocol ==='http') {
                    res.redirect(301, `https://${req.hostname}${redirectport}${req.url}`);
            }
            next();
    });
}*/

    // Setup static file serving
if (process.env.NODE_ENV === 'production') {
    //app.use(express.static(path.join(__dirname, '..', 'Blockly-for-Dwenguino')));
    app.use('/dwenguinoblockly', express.static(path.join(__dirname, 'Blockly-for-Dwenguino')));
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


export { app, port, sslPort, options }


