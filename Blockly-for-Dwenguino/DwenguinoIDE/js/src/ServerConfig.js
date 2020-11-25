

/**
 * Class that is used for the local server configuration.
 * The application will be available on port 12032.
 */
export default class ServerConfig{
    
    /**
     * 
     * @static
     * @returns {string} The server URL on which you can access the Dwenguino simulator app.
     */
    static getServerUrl(){
        return 'http://localhost:12032';
    }
}