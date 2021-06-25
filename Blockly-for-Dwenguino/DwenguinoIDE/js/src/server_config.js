

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
        let url = window.location.protocol + "//" + window.location.hostname + serverport;
        console.log("serverurl1:")
        console.log(url);

        // Stupid hack to make it work in electron
        if (url == 'file://'){
            url = "http://localhost:12032";
        }
        console.log("serverurl2:")
        console.log(url);
        
        return url
    }
}

export default ServerConfig;
