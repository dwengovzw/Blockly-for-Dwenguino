

/**
 * Class that is used for the local server configuration.
 * The application will be available on port 12032.
 * 
 * 
 */
class ServerConfig{
    
    /**
     * 
     * @static
     * @returns {string} The server URL on which you can access the Dwenguino simulator app.
     */
    static getServerUrl(){
        let serverport = (window.location.port != "" ? ":" + window.location.port : "");
        return window.location.protocol + "//" + window.location.hostname + serverport;
    }
}

export default ServerConfig;
