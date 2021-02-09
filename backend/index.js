import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
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

let __dirname = path.resolve();
console.log(`dirname: ${__dirname}`);

// Initialize the app
let app = express();

if (process.env.NODE_ENV === 'production') {
    app.use(compression());
    app.use(helmet());
}

app.use(cookieParser());

// Configure bodyparser to handle post requests
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json({ type: 'application/*+json' }));

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
    app.use(express.static(path.join(__dirname, 'Blockly-for-Dwenguino')));
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
// Launch app to listen to specified port
let server = app.listen(port, function () {
    console.log("Running RestHub on port " + port);
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







