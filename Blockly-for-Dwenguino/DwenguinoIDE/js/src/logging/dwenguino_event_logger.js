import LoginMenu from '../user/login_menu.js'
import ServerConfig from '../server_config.js'

/**
 * 
 */
class DwenguinoEventLogger {
    sessionId = null;
    tutorialId = null;
    
    tutialIdSetting = "";
    computerId = "-1";
    workshopId = "-1";

    loginModal = null;

    /**
     * @constructs
     */
    constructor(){
        this.loginModal = new LoginMenu(this);
    }

    init(){
        // This should not happen here. The modal dialog should be created in an other class which references the eventLogger.
        // TODO: separate display code from logic
        //set keypress event listerner to show test environment window
        var keys = {};
        $(document).keydown((e) => {
            keys[e.which] = true;
            if (keys[69] && keys[83] && keys[84]){
                this.loginModal.createInitialMenu();
            }
        });

        $(document).keyup(function (e) {
            delete keys[e.which];
        });

        this.sessionId = window.sessionStorage.loadOnceSessionId;
        delete window.sessionStorage.loadOnceSessionId;

        this.createNewSessionId();
    }

    /**
     * Get a new session id from the server and set it as the current session id.
     */
    createNewSessionId() {
        if (!this.sessionId){
            $.ajax({
                type: "GET",
                url: ServerConfig.getServerUrl() + "/logging/newSessionId"}
            ).done((data) => {
                this.sessionId = data;
                console.debug(this.sessionId);
            }).fail(function(response, status)  {
                console.warn('Failed to fetch sessionId:', status, response);
            });
        }
    }

    /**
     * Create an event that captures the recent action of the user in the simulator.
     * The event needs to have a name that is defined in event_name.js.The data object depends 
     * on the nature of the action. 
     * The event will also contain a timestamp.
     * @param {String} eventName | Mandatory String to reference the action of the user in the simulator. Should be defined in event_names.js 
     * @param {String} data | Mandatory String containing the data related to this event. Empty if there is no relevant data. This can for instance be the xml data for the Blockly program or the xml data for the simulation scenario.
     * @param {Int} difficultyLevel | Optional parameter indicating the difficulty level of the programming blocks selected in the simulator.
     * @param {Int} simulatorState | Optional state of the simulator.
     * @returns 
     */
    createEvent(eventName, data, difficultyLevel = 0, simulatorState = -1){
        var event = {
        "timestamp": $.now(),
        "name": eventName,
        "simulatorState": simulatorState,
        "selectedDifficulty": difficultyLevel,
        "activeTutorial": this.tutorialIdSetting,
        "computerId": this.computerId,
        "workshopId": this.workshopId,
        "data": data
        };
        return event;
    }

    /**
     * This function records a recent action of the user in the simulator and sends it to the server.
     * The event contains a timestamp, a unique session id and the event object.
     * @param {event} eventToRecord | The event that will be saved by the server into the database.
     */
    recordEvent(eventToRecord){
        var serverSubmission = {
        "timestamp": $.now(),
        "sessionId": this.sessionId,
        "event": eventToRecord
        };
        console.debug('Record event ' + eventToRecord.name + ' with data ', serverSubmission);
        if (this.sessionId !== undefined){
            $.ajax({
                type: "POST",
                url: ServerConfig.getServerUrl() + "/logging/event",
                data: serverSubmission,
            }).done(function(data){
                console.debug('Recording submitted', data);
            }).fail(function(response, status)  {
                console.warn('Failed to submit recording:', status);
            });
        }
    }
}

export default DwenguinoEventLogger;