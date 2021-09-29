import { app, port, sslPort, options } from "./server.js";
import http from 'http';
import https from 'https';
import mongoose from 'mongoose';


const httpServer = http.createServer(app);
//const httpsServer = https.createServer(options, app);



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



// Launch app to listen to specified port
httpServer.listen(port, function () {
    console.log("Running HTTP server on port " + port);
});

/*if (process.env.NODE_ENV === 'production') {
    httpsServer.listen(sslPort, function () {
        console.log("Running HTTPS server on port " + sslPort);
    })
}*/

//This is depricated, now the electron browser is which is started using a bash script
/*if (!(process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'standalone')) {
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
}*/