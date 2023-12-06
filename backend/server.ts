import path from 'path';
let __dirname = path.resolve();

import express from 'express';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';

//mongoose.set('debug', true);
//import i18n from 'i18n-x';

import axios from 'axios';

// Import routers
import blocklyRoutes from './routes/blockly-routes'
import dashboardRouter from './routes/dashboard-routes'
import oauthRouter from './routes/oauth-routes'
import userRouter from "./routes/user.routes"
import classGroupRouter from './routes/classgroup.router';
import savedProgramsRouter from "./routes/saved_state.router"

// Import test router
//import testRouter from './routes/test_auth.routes.js';

// For deploying to production
import compression from 'compression';
import helmet from 'helmet';

// For keeping track of sessions
import cookieSession from "cookie-session"

// For profiling the application in development
//import profiler from 'v8-profiler-node8'

//Configure cors middleware for the run route to allow all requests
import cors from 'cors';
import assignmentGroupRouter from './routes/assignmentgroup.router';
import { portfolioRouter } from './routes/portfolio.router';

let corsOptions = {
    origin: process.env.CORS_ORIGIN,
};

let key, cert, ca = 0;
let options = {}

// Setup server port
var port = 12032;
console.log("Port: " + port);


let sslPort = process.env.SSLPORT || 443;;
console.log("SSL port: " + sslPort);


// Initialize the app
let app = express();

app.use(cors(corsOptions));

// Set view engine
app.set('view engine', 'ejs');
let viewDirs = JSON.parse(process.env.VIEWS_DIR as string).map((elem) => {return __dirname + "/" + elem})
app.set('views', viewDirs);   // For debug

// Optimizations for production
if (process.env.NODE_ENV === 'production') {
    app.use(compression());
    app.use(helmet({
        frameguard: false // Allow use in iframe
      }));
    app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", 'example.com'],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'example.com'],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"]
    }
    }));
}else{
    app.use(cors({
        origin: '*',
        credentials: true
      }));
}

if (process.env.NODE_ENV !== "production"){
    axios.interceptors.request.use(request => {
        console.log('Starting Request', JSON.stringify(request, null, 2))
        return request
      })
}

app.use(cookieParser());
// app.use(i18n({
//     locales: ['en', 'nl'], 
//     directory: 'msg',
//     jointDir: 'msg',
//     defaultLocale: 'en',
//     queryParameter: 'lang',
//     cookieName: 'lang',
//     order: ['cookie', 'query', 'headers']
// }));



app.use(express.json()); //Used to parse JSON bodies
app.use(express.urlencoded({extended: true})); //Parse URL-encoded bodies
app.use(mongoSanitize()); // Sanitize data in the request body/params/header/query

app.use(
    cookieSession({
        name: process.env.COOKIE_NAME,
        secret: process.env.COOKIE_SECRET,
        sameSite: true,
        secure: process.env.COOKIE_SECURE === "true" ? true : false
    })
)

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

// Use dashboard routes
app.use('/dashboard', dashboardRouter);

// Use oauth routes
app.use('/oauth', oauthRouter);

// Use user routes
app.use("/user", userRouter);

// Use saved program routes
app.use("/savedstates", savedProgramsRouter)

// Disable these routes for next release
if (process.env.NODE_ENV === 'development') {
    
    // Use classgroup routes
    app.use("/classgroup", classGroupRouter)

    // Use assignment group routes
    app.use("/assignment", assignmentGroupRouter)

    // Use assignment group routes
    app.use("/portfolio", portfolioRouter)
}


// Add default route
app.get("/", (req, res) => res.send('Welcome to blockly'));

export { app, port, sslPort, options }


