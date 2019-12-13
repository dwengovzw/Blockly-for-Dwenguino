/* global Blockly, hopscotch, tutorials, JsDiff, DwenguinoBlocklyLanguageSettings, MSG, BlocklyStorage */

if (!window.dwenguinoBlocklyServer) {
    dwenguinoBlocklyServer = false;
  }
  
  var DwenguinoEventLogger = {
      sessionId: null,
      tutorialId: null,
  
      //General settings for this session, these are used for data logging during experiments
      agegroupSetting: "",
      genderSetting: "",  //TODO: add this to the modal dialog
      activityIdSetting: "",
      tutorialIdSetting: "",
      computerId: "-1",
      workshopId: "-1",
  
      initEventLogger: function(){
            //set keypress event listerner to show test environment window
            var keys = {};
            $(document).keydown(function (e) {
                keys[e.which] = true;
                if (keys[69] && keys[83] && keys[84]){
                    console.log("starting test environment");
                    $('#myModal').modal('show');
                    var db_now = new Date();
    
                    var db_day = ("0" + db_now.getDate()).slice(-2);
                    var db_month = ("0" + (db_now.getMonth() + 1)).slice(-2);
    
                    var db_today = db_now.getFullYear()+"-"+(db_month)+"-"+(db_day) ;
                    $('#activity_date').val(db_today);
                }
            });
    
            $(document).keyup(function (e) {
                delete keys[e.which];
            });
  
            //code to init the bootstrap modal dialog
            $("#submit_modal_dialog_button").click(function(){
                DwenguinoEventLogger.agegroupSetting = $("input[name=optradio]:checked").val();
                DwenguinoEventLogger.activityIdSetting = $("#activity_identifier").val();
                var activity_date = $("#activity_date").val();
                console.log("[act;" + (DwenguinoEventLogger.agegroupSetting || "")
                    + ";" + (DwenguinoEventLogger.activityIdSetting || "")
                    + ";" + (activity_date || "") + "]");
            });
    
            DwenguinoEventLogger.sessionId = window.sessionStorage.loadOnceSessionId;
            delete window.sessionStorage.loadOnceSessionId;

            if (!DwenguinoEventLogger.sessionId /*&& dwenguinoBlocklyServer*/){
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
        * This function submits an event to the python logging server.
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
            console.log(serverSubmission);
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
  