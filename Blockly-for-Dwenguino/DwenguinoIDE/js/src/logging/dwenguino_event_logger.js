import LoggingMenu from './logging_menu.js'
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

    loggingModal = null;

    /**
     * @constructs
     */
    constructor(){
        this.loggingModal = new LoggingMenu(this);
    }

    init(){
        // This should not happen here. The modal dialog should be created in an other class which references the eventLogger.
        // TODO: separate display code from logic
        //set keypress event listerner to show test environment window
        var keys = {};
        $(document).keydown((e) => {
            keys[e.which] = true;
            if (keys[69] && keys[83] && keys[84]){
                this.loggingModal.createInitialMenu();
            }
        });

        $(document).keyup(function (e) {
            delete keys[e.which];
        });

        this.sessionId = window.sessionStorage.loadOnceSessionId;
        delete window.sessionStorage.loadOnceSessionId;

        if (!this.sessionId){
            // Try to get a new sessionId from the server to keep track
            $.ajax({
                type: "GET",
                url: ServerConfig.getServerUrl() + "/logging/id"}
            ).done((data) => {
                this.sessionId = data;
            }).fail(function(response, status)  {
                console.warn('Failed to fetch sessionId:', status);
            });
        }
    }

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

    recordEvent(eventToRecord){
        var serverSubmission = {
        "timestamp": $.now(),
        "sessionId": this.sessionId,
        "event": eventToRecord
        };
        console.log(eventToRecord);
        console.log(serverSubmission);
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