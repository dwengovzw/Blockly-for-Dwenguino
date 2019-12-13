/**
 * DwenguinoEventLogger class is responsible for keeping all personal data about the user
 * and creating and registering user events.
 * When a user opens DwenguinoBlockly, a session id is created and stored in the
 * DwenguinoEventLogger.
 */
var DwenguinoEventLogger = {
      sessionId: null,
      tutorialId: null,
  
      //General settings for this session, these are used for data logging during experiments
      agegroupSetting: "",
      genderSetting: "",  
      activityIdSetting: "",
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
                    DwenguinoEventLogger.loggingModal.showMenu();
                    var db_now = new Date();
    
                    var db_day = ("0" + db_now.getDate()).slice(-2);
                    var db_month = ("0" + (db_now.getMonth() + 1)).slice(-2);
    
                    var db_today = db_now.getFullYear()+"-"+(db_month)+"-"+(db_day) ;
                    $('#activity_date').val(db_today);

                    //code to init the bootstrap modal dialog
                    $("#submit_modal_dialog_button").click(function(){
                        DwenguinoEventLogger.agegroupSetting = $("input[name=agegroupRadio]:checked").val();
                        DwenguinoEventLogger.genderSetting = $("input[name=genderRadio]:checked").val();
                        DwenguinoEventLogger.activityIdSetting = $("#activity_identifier").val();
                        var activity_date = $("#activity_date").val();
                        console.log("[act;" + (DwenguinoEventLogger.agegroupSetting || "")
                            + ";" + (DwenguinoEventLogger.activityIdSetting || "")
                            + ";" + (activity_date || "") + "]");
                    });
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
            "sessionId": DwenguinoEventLogger.sessionId,
            "agegroup": DwenguinoEventLogger.agegroupSetting,
            "gender": DwenguinoEventLogger.genderSetting,
            "activityId": DwenguinoEventLogger.activityId,
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
}

$(document).ready(function() {
    DwenguinoEventLogger.initEventLogger();
});
  