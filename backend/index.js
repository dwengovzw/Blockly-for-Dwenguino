// FileName: index.js
// Import express
let express = require('express');
// Import body parser
let bodyParser = require('body-parser');
// Import mongoose
let mongoose = require('mongoose');
// Import path
let path = require("path");

// Import blockly router
let blocklyRoutes = require('./routes/blockly-routes');

// For deploying to production
let compression = require('compression');
let helmet = require('helmet');

// Initialize the app
let app = express();

if (process.env.NODE_ENV === 'production') {
    app.use(compression());
    app.use(helmet());
}

// Configure bodyparser to handle post requests
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json({ type: 'application/*+json' }));

// connect to Mongoose and set connection variable
// Depricate: mongoose.connect();
let dev_db_url = 'mongodb://localhost/dwenguinoblockly';
let mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB, {
    useNewUrlParser: true,
})
var db = mongoose.connection;

if (!db) {
    console.log("Error connecting to db");
} else {
    console.log("db connection succesfull");
}

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '..', 'Blockly-for-Dwenguino')));
} else {
    // Setup static file serving
    app.use('/dwenguinoblockly', express.static(path.join(__dirname, '..', 'Blockly-for-Dwenguino')));
}

// Use blockly routes for the app
app.use('/', blocklyRoutes);
// Add default route
app.get("/", (req, res) => res.send('Welcome to blockly'));

// Setup server port
var port = process.env.PORT || 12032;
// Launch app to listen to specified port
let server = app.listen(port, function () {
    console.log("Running RestHub on port " + port);
});

if (process.env.NODE_ENV === 'production') {
    module.export = app;
} else {
    // Launch a browser window
    const ChromeLauncher = require('chrome-launcher');
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
}







