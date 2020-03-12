/**
 * DwenguinoEventLogger class is responsible for keeping all personal data about the user
 * and creating and registering user events.
 * When a user opens DwenguinoBlockly, a session id is created and stored in the
 * DwenguinoEventLogger.
 */
var DwenguinoEventLogger = {
      sessionId: null,
      tutorialId: null,

      school: null,
      userId: null,
  
      //General settings for this session, these are used for data logging during experiments
      dateOfBirth: "",
      genderSetting: "",  
      tutorialIdSetting: "",
      computerId: "-1",
      workshopId: "-1",
      loggingModal: new LoggingMenu(),

      initEventLogger: function(){
            //set keypress event listerner to show test environment window
            var keys = {};
            $(document).keydown(function (e) {
                keys[e.which] = true;
                if (keys[69] && keys[83] && keys[84]){
                    DwenguinoEventLogger.loggingModal.createInitialMenu();
                }
            });
    
            $(document).keyup(function (e) {
                delete keys[e.which];
            });
    
            DwenguinoEventLogger.sessionId = window.sessionStorage.loadOnceSessionId;
            delete window.sessionStorage.loadOnceSessionId;

            if (!DwenguinoEventLogger.sessionId){
                // Try to get a new sessionId from the server to keep track
                $.ajax({
                    type: "GET",
                    url: window.serverUrl + "/logging/id"}
                ).done(function(data){
                    DwenguinoEventLogger.sessionId = data;
                }).fail(function(response, status)  {
                    console.warn('Failed to fetch sessionId:', status);
                });
            }
        },
  
        createEvent: function(eventName, data){
            var event = {
            "timestamp": $.now(),
            "name": eventName,
            "simulatorState": DwenguinoBlockly.simulatorState,
            "selectedDifficulty": DwenguinoBlockly.difficultyLevel,
            "activeTutorial": DwenguinoEventLogger.tutorialIdSetting,
            "groupId": DwenguinoEventLogger.activityIdSetting,
            "computerId": DwenguinoEventLogger.computerId,
            "workshopId": DwenguinoEventLogger.workshopId,
            "data": data
            };
            return event;
        },
  
        /*
        * This function submits an event to the logging server.
        */
        recordEvent: function(eventToRecord){
            var serverSubmission = {
            "timestamp": $.now(),
            "userId": DwenguinoEventLogger.userId,
            "school": DwenguinoEventLogger.school,
            "sessionId": DwenguinoEventLogger.sessionId,
            "dateOfBirth": DwenguinoEventLogger.agegroupSetting,
            "gender": DwenguinoEventLogger.genderSetting,
            "event": eventToRecord
            };
            console.log(eventToRecord);
            if (DwenguinoEventLogger.sessionId !== undefined){
            $.ajax({
                type: "POST",
                url: window.serverUrl + "/logging/event",
                data: serverSubmission,
            }).done(function(data){
                console.debug('Recording submitted', data);
            }).fail(function(response, status)  {
                console.warn('Failed to submit recording:', status);
            });
            }
        },

        setUserId: function(userId){
            this.userId = userId;
        },

        setSchool: function(school){
            this.school = school;
        },

        setDateOfBirth: function(dateOfBirth){
            this.dateOfBirth = dateOfBirth;
        },

        setGender: function(gender){
            this.genderSetting = gender;
        }
}

$(document).ready(function() {
    DwenguinoEventLogger.initEventLogger();
});
  