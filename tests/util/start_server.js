import http from 'http'
import { app, port } from "../../backend/server.js"

const httpServer = http.createServer(app);

let startServer = () =>
{
    return new Promise((resolve, reject) => {
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

let endServer = () =>
{
    return new Promise(function (resolve) {
        httpServer.close((err) => {
            if (err){
                reject();
            }else{
                resolve();
            }
        })
    });
}

export { startServer, endServer }