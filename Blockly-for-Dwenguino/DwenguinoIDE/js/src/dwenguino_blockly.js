import DwenguinoEventLogger from './logging/dwenguino_event_logger.js'
import DwenguinoSimulation from './simulation/dwenguino_simulation.js'
import CookiesInformation from './user/cookies_information.js'
import FileIOController from './utils/file_io_controller.js'
import { EVENT_NAMES } from './logging/event_names.js'
import ServerConfig from './server_config.js'
import jQuery from "jquery";
import 'jquery-ui-bundle';
import 'bootstrap';
import TextualEditor from './textual_editor/textual_editor.ts'
import { store } from "../../../dashboards/js/src/state/store.ts"
import { SAVEDPROGRAM_TYPES } from '../../../../backend/models/saved_state.model'

window.$ = window.jQuery = jQuery;

/* global Blockly, hopscotch, tutorials, JsDiff, DwenguinoBlocklyLanguageSettings, MSG, BlocklyStorage */

//export { DwenguinoBlockly as default }



let DwenguinoBlockly = {
    basepath: settings.basepath,
    simButtonStateClicked: false,

    workspace: null,
    recording: "",

    //difficultyLevel: 1,
    simulatorState: "off",
    xmlLoadedFromFile: "",
    xmlFromScenario: "",

    logger: null,

    simulationEnvironment: null,

    cookiesInformation: null,

    compilationPath: "",
    textualEditor: new TextualEditor("db_code_pane"),
    currentProgrammingContext: "blocks", // The current coding context can be blocks or text. 
    programSavedIntoAccount: true,
    internalRedirect: false,

    initDwenguinoBlockly: function(workspace){
            

           if (DwenguinoBlockly.isUserLoggedIn()){ 
            DwenguinoBlockly.setSavedInCloud(true)
            setInterval(() => {
              // Save program to cloud every 1 seconds
              if (!DwenguinoBlockly.programSavedIntoAccount){
                setTimeout(() => {
                  DwenguinoBlockly.saveStateHandler(false);
                })
              }
            }, 5000)
          } else {
            $("#db_menu_saved_notification").hide() // Hide the saved notification if we are not editing a saved program
          }
      
          /**
           * Show popup when users close the editor
           */
          let leavePageCheck = (e) => {
            if (e) { 
              // If program has been saved, don't show popup
              if (DwenguinoBlockly.programSavedIntoAccount || DwenguinoBlockly.internalRedirect){
                e.preventDefault()
                return
              }
              e.returnValue = DwenguinoBlocklyLanguageSettings.translate(["confirm_close"]) 
            }
            return DwenguinoBlocklyLanguageSettings.translate(["confirm_close"]); 
          }
          window.addEventListener('onbeforeunload', (e) => {
            return leavePageCheck(e);   
          })
          window.addEventListener('beforeunload', (e) => {
            return leavePageCheck(e);   
          })


          /**
           * If local installation is running, generate binary locally. 
           * Otherwise generate binary on the server.
           */
          $.ajax({
            url: `${settings.hostname}/utilities/getEnvironment`,
            dataType: 'text',
            type: 'get',
            success: function( data, textStatus, jQxhr ){
                DwenguinoBlockly.compilationPath = `${settings.hostname}/utilities/getDwenguinoBinary`;
            },
            error: function( jqXhr, textStatus, errorThrown ){
                DwenguinoBlockly.compilationPath = settings.hostname + "/utilities/getDwenguinoBinary"
                console.log( errorThrown );
            }
        });


        this.workspace = workspace;

        // Create DwenguinoEventLogger instance
        // This instance should be passed to all classes which want to log events.
        this.logger = new DwenguinoEventLogger();
        this.logger.init();
        var self = this;

        this.cookiesInformation = new CookiesInformation();
        DwenguinoBlockly.displayCookieConsent();

        // Create new simulationenvironment
        this.simulationEnvironment = new DwenguinoSimulation(this.logger, this.workspace);  // This is weird, workspace should be created in a different place..

        //Restore recording after language change
        DwenguinoBlockly.recording = window.sessionStorage.loadOnceRecording || "";
        delete window.sessionStorage.loadOnceRecording;


        //init resizable panels
        $( "#db_blockly" ).resizable({
            handles: "e"
        });

        $( "#db_blockly" ).resize(function(){
          DwenguinoBlockly.onresize();
          Blockly.svgResize(DwenguinoBlockly.workspace);
        });

        //show/hide simulator
        $("#db_menu_item_simulator").click(function(){
          DwenguinoBlockly.toggleSimulator();
        });

        

        //turn on the simulator by default
        DwenguinoBlockly.toggleSimulator();


        DwenguinoBlockly.textualEditor.getEditorPane().addOnHasBecomeUnsavedEventListener(() => {
          DwenguinoBlockly.setSavedInCloud(false)
        })

        //The following code handles the upload of a saved file.
        //If it is run in the browser it shows a modal dialog with two upload options:
        //1) Using the upload button.
        //2) Using the drag and drop system.
        $("#db_menu_item_upload").on("click", function(){
          FileIOController.uploadTextFile().then((result) => {
            if (DwenguinoBlockly.currentProgrammingContext === "blocks"){
              DwenguinoBlockly.restoreFromXml(Blockly.Xml.textToDom(result.content));
              if (globalSettings.savedProgramUUID !== ""){ // If we are editing a saved program and uploaded code, changes are not saved in the cloud yet.
                DwenguinoBlockly.setSavedInCloud(false)
              }
            } else if (DwenguinoBlockly.currentProgrammingContext === "text"){
              DwenguinoBlockly.textualEditor.getEditorPane().openTab(result.content, result.filename);
            } else {
              console.log("Error uploading file");
            }
          }, (err) => {
            console.log(err);
          })
        });

        //The following code handles saving of the current program in the users' account
        //If it is run in the browser it shows a modal dialog enabeling them to choose a name:
        $("#db_menu_item_save").on("click", function(){
          if (DwenguinoBlockly.isUserLoggedIn()){
            setTimeout(() => {
              DwenguinoBlockly.saveStateHandler();
            })
          } else {
            DwenguinoBlockly.showSaveToProfileModal()
          }
        });

        // This code handles the download of the workspace to a local file.
        // If this is run in the arduino ide, a filechooser is shown. (depricated and removed)
        // If it is run in the browser, the document is downloaded using the name blocks.xml.
        $("#db_menu_item_download").on("click", (e) => {
          DwenguinoBlockly.downloadFileHandler();
        });

        $("#submit_save_modal_dialog_button").on("click", (e) => {
          setTimeout(() => {
            DwenguinoBlockly.saveStateHandler();
          })
        })

        document.addEventListener('keydown', e => {
          if (e.ctrlKey && e.key === 's'){
            e.preventDefault();
            DwenguinoBlockly.downloadFileHandler();
          }
        })

        this.resetRunButton(); // set event handlers on run and clear buttons

         $("#blocklyDiv").click(function(){
           DwenguinoBlockly.simulationEnvironment.stop();
         });

         // Process blockly events and log them
         DwenguinoBlockly.workspace.addChangeListener(function(event){
           // Stop de simulator
          let eventToRecord = "";

          let javascriptCode = "";
          let pythonCode = "";
          try {
              javascriptCode = Blockly.JavaScript.workspaceToCode(DwenguinoBlockly.workspace);
          } catch (error){
              javascriptCode = "invalid code";
          }
          try {
              pythonCode = Blockly.Python.workspaceToCode(DwenguinoBlockly.workspace);
          } catch (error){
              pythonCode = "invalid code";
          }

          if (event.type == "create"){
            var xmlCodeChanged = Blockly.Xml.domToText(event.xml);
            var data = {
              xmlCodeChanged: xmlCodeChanged,
              ids: event.ids,
              javascriptCode: javascriptCode,
              pythonCode: pythonCode
            }
            eventToRecord = DwenguinoBlockly.logger.createEvent(EVENT_NAMES.blocklyBlockCreate, data);
            DwenguinoBlockly.logger.recordEvent(eventToRecord);
          } else if (event.type == "delete"){
            var xmlCodeChanged = Blockly.Xml.domToText(event.oldXml);
            var data = {
              xmlCodeChanged: xmlCodeChanged,
              ids: event.ids,
              javascriptCode: javascriptCode,
              pythonCode: pythonCode
            } 
            eventToRecord = DwenguinoBlockly.logger.createEvent(EVENT_NAMES.blocklyBlockDelete, data);
            DwenguinoBlockly.logger.recordEvent(eventToRecord);
          } else if (event.type == "move"){
            var data = {
              oldParentId: event.oldParentId,
              oldInputName: event.oldInputName,
              oldCoordinate: event.oldCoordinate,
              newParentId: event.newParentId,
              newInputName: event.newInputName,
              newCoordinate: event.newCoordinate,
              javascriptCode: javascriptCode,
              pythonCode: pythonCode
            }
            eventToRecord = DwenguinoBlockly.logger.createEvent(EVENT_NAMES.blocklyBlockMove, data);
            DwenguinoBlockly.logger.recordEvent(eventToRecord);
          } else if (event.type == "createVar"){
            var data = {
              varType: event.varType,
              varName: event.varName,
              varId: event.varId,
              javascriptCode: javascriptCode,
              pythonCode: pythonCode
            }
            eventToRecord = DwenguinoBlockly.logger.createEvent(EVENT_NAMES.blocklyVarCreate, data);
            DwenguinoBlockly.logger.recordEvent(eventToRecord);
          } else if (event.type == "deleteVar"){
            var data = {
              varType: event.varType,
              varName: event.varName,
              varId: event.varId,
              javascriptCode: javascriptCode,
              pythonCode: pythonCode
            }
            eventToRecord = DwenguinoBlockly.logger.createEvent(EVENT_NAMES.blocklyVarDelete, data);
            DwenguinoBlockly.logger.recordEvent(eventToRecord);
          } else if (event.type == Blockly.Events.VAR_RENAME){
            var data = {
              oldName: event.oldName,
              newName: event.newName,
              varId: event.varId,
              javascriptCode: javascriptCode,
              pythonCode: pythonCode
            }
            eventToRecord = DwenguinoBlockly.logger.createEvent(EVENT_NAMES.blocklyVarRename, data);
            DwenguinoBlockly.logger.recordEvent(eventToRecord);
          } else if (event.type == Blockly.Events.UI){
            var data = {
              element: event.element,
              oldValue: event.oldValue,
              newValue: event.newValue,
              javascriptCode: javascriptCode,
              pythonCode: pythonCode
            }
            eventToRecord = DwenguinoBlockly.logger.createEvent(EVENT_NAMES.blocklyUI, data);
            DwenguinoBlockly.logger.recordEvent(eventToRecord);
          } else if (event.type == Blockly.Events.CHANGE){
            var data = {
              element: event.element,
              name: event.name,
              oldValue: event.oldValue,
              newValue: event.newValue,
              javascriptCode: javascriptCode,
              pythonCode: pythonCode
            };
            eventToRecord = DwenguinoBlockly.logger.createEvent(EVENT_NAMES.blocklyChange, data);
            DwenguinoBlockly.logger.recordEvent(eventToRecord);
          } else if (event.type == Blockly.Events.UNDO){
            var data = {};
            eventToRecord = DwenguinoBlockly.logger.createEvent(EVENT_NAMES.undo, data);
            DwenguinoBlockly.logger.recordEvent(eventToRecord);
          } else {
            console.debug('Type of event unkown ', event);
          }
        });


        // Abstract this away into a function that sets the environment state based on the data in globalSettings
        console.log("EDITOR STATE:--------------------------");
        console.log(globalSettings.editorState);
        if (globalSettings.editorState){
          if (globalSettings.editorState.view === "blocks"){
            DwenguinoBlockly.switchToBlockly();
            DwenguinoBlockly.setTextualCodeToggle(false)
            DwenguinoBlockly.setOpenTextualEditorTabs(globalSettings.editorState.cppCode || [])
          } else if (globalSettings.editorState.view === "text"){
            DwenguinoBlockly.switchToTextualEditor(globalSettings.editorState.cppCode, true);
            DwenguinoBlockly.setTextualCodeToggle(true)          
          }
          if (globalSettings.editorState.scenario){
            DwenguinoBlockly.simulationEnvironment.setCurrentScenario(globalSettings.editorState.scenario);
          }
        }

    },
    setSavedInCloud: function(saved){
      console.log(`Saved in cloud: ${saved}}`)
      DwenguinoBlockly.programSavedIntoAccount = saved;
      if (saved){
        $("#db_menu_saved_notification").html(`<span 
          title="${DwenguinoBlocklyLanguageSettings.translate(["allChangesSavedInCloud"])}" 
          class="material-symbols-outlined"
          style="color: gray; font-size: 1em; margin-left: 0.5rem">
            cloud_done
          </span>`)
      } else {
        $("#db_menu_saved_notification").html(`<span 
          title="${DwenguinoBlocklyLanguageSettings.translate(["unsavedChangesInCloud"])}" 
          class="material-symbols-outlined"
          style="color: gray; font-size: 1em; margin-left: 0.5rem">
            cloud_off
          </span>`)
      }
    },
    downloadFileHandler: function(){
      let data = {};
      if (DwenguinoBlockly.currentProgrammingContext === "blocks"){
        var xml = Blockly.Xml.workspaceToDom(DwenguinoBlockly.workspace);
        var xmlCode = Blockly.Xml.domToText(xml);
        console.debug(xmlCode);
        localStorage.workspaceXml = xmlCode;
        DwenguinoBlockly.download("blocks.xml", xmlCode);
        
        // Get javascript and python for current code
        let javascriptCode = "";
        let pythonCode = "";
        try {
            javascriptCode = Blockly.JavaScript.workspaceToCode(DwenguinoBlockly.workspace);
        } catch (error){
            javascriptCode = "invalid code";
        }
        try {
            pythonCode = Blockly.Python.workspaceToCode(DwenguinoBlockly.workspace);
        } catch (error){
            pythonCode = "invalid code";
        }
         data = {
          xmlCode: xmlCode,
          javascriptCode: javascriptCode,
          pythonCode: pythonCode
        }
      } else if (DwenguinoBlockly.currentProgrammingContext === "text"){
        let cCode = DwenguinoBlockly.textualEditor.getEditorPane().getCurrentCode();
        let fileName = DwenguinoBlockly.textualEditor.getEditorPane().getCurrentTabName();
        DwenguinoBlockly.textualEditor.getEditorPane().saveCurrentTab();
        DwenguinoBlockly.download(`${fileName}`, cCode);
        data = {
          cCode: cCode
        }
      }else{
        return
      }

      let event = DwenguinoBlockly.logger.createEvent(EVENT_NAMES.downloadClicked, data);
      DwenguinoBlockly.logger.recordEvent(event);
    },

    saveStateHandler: async function(notify=true){
      let name = $('#saveToProfileModal .modal-body #filename').val() || "no name"
      let view = DwenguinoBlockly.currentProgrammingContext
      let scenario = DwenguinoBlockly.simulationEnvironment.getCurrentScenario().name
      let blocklyXml = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(DwenguinoBlockly.workspace))
      let socialRobotXml = ""
      if (scenario === "socialrobot"){
        socialRobotXml = DwenguinoBlockly.simulationEnvironment.getCurrentScenario().robotToXml()
      }
      let cppCode = this.textualEditor.getEditorPane().getCurrentTabData().map(tabInfo => {
        return {
          filename: tabInfo.title,
          cppCode: tabInfo.code
        }
      }) // TODO: get cpp code from textual editor

      try {
        let result = await fetch(
          `${globalSettings.hostname}/savedstates/save`, {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
              blocklyXml: blocklyXml,
              name: name,
              uuid: globalSettings.savedProgramUUID,
              view: view,
              scenario: scenario,
              socialRobotXml: socialRobotXml,
              cppCode: cppCode
          })
        })
        if (result.status == 200){
          DwenguinoBlockly.setSavedInCloud(true)
          DwenguinoBlockly.textualEditor.getEditorPane().saveAllTabs()
          if (notify){
            DwenguinoBlockly.showNotificationModal(
              DwenguinoBlocklyLanguageSettings.translate(['confirmProjectSavedTitle']), 
              DwenguinoBlocklyLanguageSettings.translate(['confirmProjectSaved'])
            )
          }
        } else if (result.status === 302){
          let response = await result.json()
          DwenguinoBlockly.internalRedirect = true
          window.location.href = response.redirectUrl
        }else{
          if (notify){
            DwenguinoBlockly.showNotificationModal(
              DwenguinoBlocklyLanguageSettings.translate(['saveProjectToProfileFailedTitle']), 
              DwenguinoBlocklyLanguageSettings.translate(['saveProjectToProfileFailed'])
            )
          }
        }
      } catch (e) {

      } finally {
        $('#saveToProfileModal .modal-body #filename').val("")
      }      
    },

    restoreFromXml: function(xml){
      DwenguinoBlockly.workspace.clear();
      Blockly.Xml.domToWorkspace(xml, DwenguinoBlockly.workspace);
      var count = DwenguinoBlockly.workspace.getAllBlocks().length;
      var data = {
        xmlCode: Blockly.Xml.domToText(xml)
      }
      let eventToRecord = DwenguinoBlockly.logger.createEvent(EVENT_NAMES.uploadClicked, data);
      DwenguinoBlockly.logger.recordEvent(eventToRecord);
    },

    getCodeForCurrentContext: function(){
      if (DwenguinoBlockly.currentProgrammingContext === "blocks"){
        return Blockly.Arduino.workspaceToCode(DwenguinoBlockly.workspace);
      } else if (DwenguinoBlockly.currentProgrammingContext === "text"){
        return DwenguinoBlockly.textualEditor.getEditorPane().getCurrentCode();
      } else {
        return "";
      }
    },

    getFilenameForCurrentContext: function(){
      if (DwenguinoBlockly.currentProgrammingContext === "blocks"){
        return "program.dw"
      } else if (DwenguinoBlockly.currentProgrammingContext === "text"){
        let tabname = `${DwenguinoBlockly.textualEditor.getEditorPane().getCurrentTabName()}`
        if (tabname.includes(".")){
          let extRegex = /^(.*)\.(.*)$/
          tabname = tabname.match(extRegex)[1]
        }
        return `${tabname}.dw`
      } else {
        return "";
      }
    },

    download: function(filename, text) {
      FileIOController.download(filename, text);
    },

    toggleSimulator: function(){
      var newStateArray = [];
      if (this.simButtonStateClicked){
        newStateArray = ['100%', 'off', false];
        DwenguinoBlockly.simulationEnvironment.stop();
      } else {
        newStateArray = ['50%', 'on', true];
        DwenguinoBlockly.simulationEnvironment.open();
      }
      $("#db_blockly").width(newStateArray[0]);
      this.simButtonStateClicked = newStateArray[2];
      DwenguinoBlockly.simulatorState = newStateArray[1];
      var data = {
        "simulatorState": DwenguinoBlockly.simulatorState
      }
      let eventToRecord = DwenguinoBlockly.logger.createEvent(EVENT_NAMES.simButtonStateClicked, data);
      DwenguinoBlockly.logger.recordEvent(eventToRecord);

      DwenguinoBlockly.onresize();
      Blockly.svgResize(DwenguinoBlockly.workspace);
    },

    downloadDwenguinoBinaryHandler: function(code, localfilename=""){
      DwenguinoBlockly.downloadDwenguinoBinaryHandlerAjax(code, localfilename);
    },

    downloadBlobToFile: function(blob, filename){
      let compilationSuccessMessage = "Compilation successful.\nDownloading file..."
      DwenguinoBlockly.textualEditor.getErrorLog().setContent(compilationSuccessMessage);
      if (typeof window.navigator.msSaveBlob !== 'undefined') {
        // IE workaround for "HTML7007: One or more blob URLs were revoked by closing the blob for which they were created. These URLs will no longer resolve as the data backing the URL has been freed."
        window.navigator.msSaveBlob(blob, filename);
      } else {
          var URL = window.URL || window.webkitURL;
          var downloadUrl = URL.createObjectURL(blob);

          if (filename) {
              // use HTML5 a[download] attribute to specify filename
              var a = document.createElement("a");
              // safari doesn't support this yet
              if (typeof a.download === 'undefined') {
                  window.location.href = downloadUrl;
              } else {
                  a.href = downloadUrl;
                  a.download = filename;
                  document.body.appendChild(a);
                  a.click();
              }
          } else {
              window.location.href = downloadUrl;
          }
          setTimeout(function () { URL.revokeObjectURL(downloadUrl); }, 100); // cleanup          
      }
    },

    setBlobContentToErrorWindow: function(blob){
      blob.text().then(text => {
        let errorInfo = JSON.parse(text);
        if (DwenguinoBlockly.currentProgrammingContext == "text"){
          DwenguinoBlockly.textualEditor.getErrorLog().setContent(errorInfo.trace);
        } else {
          DwenguinoBlockly.showModalErrorDialog(errorInfo);
        }
        
      })
    },

    downloadDwenguinoBinaryHandlerAjax: function(code, localfilename=""){
      DwenguinoBlockly.disableRunButton();
      let url = DwenguinoBlockly.compilationPath// + "?code=" + encodeURIComponent(code);
      let res = "success";
      try{
        $.ajax({
          type: "POST",
          url: url,
          data: {code: code},
          xhrFields: {
            responseType: "blob" 
          },
          success: function(blob, status, xhr){
            // check for a filename
            var filename = "";
            var disposition = xhr.getResponseHeader('Content-Disposition');
            if (disposition && disposition.indexOf('attachment') !== -1) {
                var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                var matches = filenameRegex.exec(disposition);
                if (matches != null && matches[1]) filename = matches[1].replace(/['"]/g, '');
            }
            if (filename === "error.log"){
              DwenguinoBlockly.setBlobContentToErrorWindow(blob);
            } else {
              if (localfilename !== ""){
                filename = localfilename
              }
              DwenguinoBlockly.downloadBlobToFile(blob, filename);
            }
            // To here

            DwenguinoBlockly.resetRunButton();
          },
          error: function(err, textStatus, errorThrown){
            DwenguinoBlockly.resetRunButton();
          }
        }) 
      } catch (e) {
        console.log(e);
      }
    },

    showModalErrorDialog: function(error){
      // Set modal dialog error messages.
      $('#errorModal .modal-header').html(DwenguinoBlocklyLanguageSettings.translate(['downloadError']));
      $('#errorModal .modal-body .message').html(DwenguinoBlocklyLanguageSettings.translate(['compileError']));

      // Create additional info button
      $('#errorModal .modal-body .console').hide();
      $('#errorModal .modal-body .error_details').off("click");
      $('#errorModal .modal-body .error_details').click(function(){
        $('#errorModal .modal-body .console').toggle();
      });

      if (error.message.signal === "SIGTERM"){
        $('#errorModal .modal-body .console').html('Operation timed out');
      }else{
        $('#errorModal .modal-body .console').html(error.trace);
      }
      $('#errorModal').modal('show');
    },
    showNotificationModal: function(title, message){
      // Set modal dialog error messages.
      $('#notificationModal .modal-header').html(title);
      $('#notificationModal .modal-header').append('<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>');
      $('#notificationModal .modal-body .message').html(message);
      $('#notificationModal').modal('show');
    },

    showSaveToProfileModal: function(){
      $('#saveToProfileModal .modal-header').html(DwenguinoBlocklyLanguageSettings.translate(['saveToProfile']));
      $('#saveToProfileModal .modal-header').append('<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>');
      $('#saveToProfileModal .modal-body .message').html(DwenguinoBlocklyLanguageSettings.translate(['nameProjectToSave']));
      $('#saveToProfileModal').modal('show');
    },

    disableRunButton: function(){
      $("#db_menu_item_run").off("click");
      $("#db_menu_item_clear").off("click");
      $("#db_menu_item_loading_gear").show();
      $("#db_menu_item_run").hide();
      $("#db_menu_item_run").css({color: "gray"});
      $("#db_menu_item_clear").css({color: "gray"});
    },

    resetRunButton: function(){
          $("#db_menu_item_run").click(function(){
            Blockly.Arduino.emptySetup();
            var code = DwenguinoBlockly.getCodeForCurrentContext();
            let filename = DwenguinoBlockly.getFilenameForCurrentContext()
            DwenguinoBlockly.downloadDwenguinoBinaryHandler(code, filename);
          });

          $("#db_menu_item_clear").click(function(){
            var code = '#include <Wire.h>\n#include <Dwenguino.h>\n#include <LiquidCrystal.h>\n\nvoid setup(){\ninitDwenguino();\ndwenguinoLCD.setCursor(2,0);\ndwenguinoLCD.print(String("WeGoSTEM ;)"));\n}\n\nvoid loop(){}\n';
            DwenguinoBlockly.downloadDwenguinoBinaryHandlerAjax(code);
          });

          $("#db_menu_item_run").css({color: "black"});
          $("#db_menu_item_run").hover(function() {
            $(this).css({color: "#8bab42"});
          });
          $("#db_menu_item_run").mouseleave(function() {
            $(this).css({color: "black"});
          });

          $("#db_menu_item_clear").css({color: "black"});
          $("#db_menu_item_clear").hover(function() {
            $(this).css({color: "#8bab42"});
          });
          $("#db_menu_item_clear").mouseleave(function() {
            $(this).css({color: "black"});
          });

          $("#db_menu_item_loading_gear").hide();
          $("#db_menu_item_run").show();

          //$("#db_menu_item_dwengo_robot_teacher_image").css({padding: "10px", maxHeight: "100%", float: "right"});
          //$("#db_menu_item_dwengo_robot_teacher_image").attr("src", DwenguinoBlockly.basepath + "DwenguinoIDE/img/dwengo_robot_plain.svg");
    },

    prevWorkspaceXml: "",
    /**
    *   Take a snapshot of the current timestamp, simulatorstate, selectedDifficulty, activeTutorial and blocks in the workspace.
    */
    takeSnapshotOfWorkspace: function(){
        // Get xml for current code
        let xml = Blockly.Xml.workspaceToDom(DwenguinoBlockly.workspace);
        let xmlCode = Blockly.Xml.domToText(xml);
        if (xmlCode != DwenguinoBlockly.prevWorkspaceXml){
          // Get javascript and python for current code
          let javascriptCode = "";
          let pythonCode = "";
          let cCode = "";
          try {
            javascriptCode = Blockly.JavaScript.workspaceToCode(DwenguinoBlockly.workspace);
          } catch (error){
            javascriptCode = "invalid code";
          }
          try {
            pythonCode = Blockly.Python.workspaceToCode(DwenguinoBlockly.workspace);
          } catch (error){
            pythonCode = "invalid code";
          }
          try {
            cCode = Blockly.Arduino.workspaceToCode(DwenguinoBlockly.workspace);
          } catch (error){
            cCode = "invalid code";
          }
          let data = {
            xmlCode: xmlCode,
            javascriptCode: javascriptCode,
            pythonCode: pythonCode,
            cCode: cCode
          }
          DwenguinoBlockly.prevWorkspaceXml = xmlCode;
          let eventToRecord = this.logger.createEvent(EVENT_NAMES.changedWorkspace, data);
          DwenguinoBlockly.logger.recordEvent(eventToRecord);
          DwenguinoBlockly.setSavedInCloud(false)
        }
    },

    /**
    *   Log the code changes of the user
    *   @param {type} event
    */
    logCodeChange: function(event){
        DwenguinoBlockly.takeSnapshotOfWorkspace();
    },

    previouslyRenderedCode: null,

    /**
     * Populate the db_blockly div with content generated from the blocks. This method highlights the Arduino C++ code that 
     * has recently changed.
     */
    renderCode: function() {
        DwenguinoBlockly.logCodeChange(); // Log code change if code has changed

        Blockly.Arduino.emptySetup();
        let code = Blockly.Arduino.workspaceToCode(DwenguinoBlockly.workspace);

    },

    highlightModifiedCode(code){
      let diff = JsDiff.diffWords(DwenguinoBlockly.previouslyRenderedCode, code);
      let resultStringArray = [];
      for (let i = 0; i < diff.length; i++) {
        if (!diff[i].removed) {
          let escapedCode = diff[i].value.replace(/</g, "&lt;")
                                          .replace(/>/g, "&gt;");
          if (diff[i].added) {
            resultStringArray.push(
                '<span class="code_highlight_new">' + escapedCode + '</span>');
          } else {
            resultStringArray.push(escapedCode);
          }
        }
      }
      return resultStringArray
    }, 

    loadFileXmlIntoWorkspace: function(xml_content){
      DwenguinoBlockly.setWorkspaceBlockFromXml(xml_content);
    },

    onresize: function(){
        var blocklyArea = document.getElementById('db_blockly');
        var blocklyDiv = document.getElementById('blocklyDiv');
        // Compute the absolute coordinates and dimensions of blocklyArea.
        var element = blocklyArea;
        var x = 0;
        var y = 0;
        do {
            x += element.offsetLeft;
            y += element.offsetTop;
            element = element.offsetParent;
        } while (element);
        // Position blocklyDiv over blocklyArea.
        blocklyDiv.style.left = x + 'px';
        blocklyDiv.style.top = y + 'px';
        blocklyDiv.style.width = blocklyArea.offsetWidth + 'px';
        blocklyDiv.style.height = blocklyArea.offsetHeight + 'px';
    },

    injectBlockly: function(){
        var blocklyArea = document.getElementById('db_blockly');
        var blocklyDiv = document.getElementById('blocklyDiv');
        let workspace = Blockly.inject(blocklyDiv,
            {
                toolbox: document.getElementById('toolbox'),
                media: DwenguinoBlockly.basepath + "DwenguinoIDE/img/",
                zoom: {controls: true, wheel: true},
                undo : true
            });
        window.addEventListener('resize', DwenguinoBlockly.onresize, false);
        DwenguinoBlockly.onresize();
        Blockly.svgResize(workspace);
        workspace.addChangeListener(DwenguinoBlockly.renderCode);
        
        // Init the callback for the dynamic creation of the toolbox
        /**
         * Construct the blocks required by the flyout for the colours category.
         * @param {!Blockly.Workspace} workspace The workspace this flyout is for.
         * @return {!Array.<!Element>} Array of XML block elements.
         */
        var variablesFlyoutCallback = function() {
          var variables = workspace.getAllVariables();
          var block_texts = []
          //block_texts.push('<button text="' + MSG['createVar'] + '" callbackKey="createVariableCallback"></button>')
          block_texts.push('<block type="variables_declare_set_int"></block>');
          block_texts.push('<block type="variables_get_int"></block>');
          block_texts.push('<block type="variables_declare_set_string"></block>');
          block_texts.push('<block type="variables_get_string"></block>');
          
          for (var i = 0 ; i < variables.length ; i++){
            var type = "_int";
            if (variables[i]["type"] == "Number"){
              type = "_int";
            } else if (variables[i]["type"] == "String"){
              type = "_string";
            }else{
              type = ""
            }
            
            var blockXml = '<block type="variables_get' + type + '"><field name="VAR" id="';
            blockXml = blockXml + variables[i]["id_"] + '" variabletype="';
            blockXml = blockXml + variables[i]["type"] + '">';
            blockXml = blockXml + variables[i]["name"] + '</field></block>';
            block_texts.push(blockXml);
          }
          var blocks = []
          for (var i = 0 ; i < block_texts.length ; i++){
            blocks.push(Blockly.Xml.textToDom(block_texts[i]))
          }
          return blocks;
        }

        var createVariableCallback = function(btn){
            console.log("Creating new variable");
        };

        workspace.registerButtonCallback(
          "createVariableCallback", createVariableCallback
        );

        workspace.registerToolboxCategoryCallback(
          "DWB_VARIABLES", variablesFlyoutCallback
        );
        return workspace;
    },

    changeLanguage: function() {
        // Store the blocks for the duration of the reload.
        // This should be skipped for the index page, which has no blocks and does
        // not load Blockly.
        // Also store the recoring up till now.
        // MSIE 11 does not support sessionStorage on file:// URLs.
        if (typeof Blockly !== 'undefined' && window.sessionStorage) {
            var xml = Blockly.Xml.workspaceToDom(DwenguinoBlockly.workspace);
            var text = Blockly.Xml.domToText(xml);
            window.sessionStorage.loadOnceBlocks = text;
            window.sessionStorage.loadOnceRecording = DwenguinoBlockly.recording;
            window.sessionStorage.loadOnceSessionId = DwenguinoBlockly.sessionId;
        }

        var languageMenu = document.getElementById('db_menu_item_language_selection');
        let newLang = encodeURIComponent(languageMenu.options[languageMenu.selectedIndex].value);
        var search = window.location.search;
        if (search.length <= 1) {
            search = '?lang=' + newLang;
        } else if (search.match(/[?&]lang=[^&]*/)) {
            search = search.replace(/([?&]lang=)[^&]*/, '$1' + newLang);
        } else {
            search = search.replace(/\?/, '?lang=' + newLang + '&');
        }

        let data = { lang: newLang };
        $.ajax({
            type: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            url: settings.hostname + "/lang",
            data: JSON.stringify(data)}
        ).done(function(data){
        }).fail(function(response, status)  {
        }); 

        window.location = window.location.protocol + '//' +
        window.location.host + window.location.pathname + search;
    },

    /**
     * User's language (e.g. "en").
     * @type {string}
     */
    LANG: DwenguinoBlocklyLanguageSettings.getLang(),

    isRtl: function(){
        return false;
    },

    /**
     * Initialize the page language.
     */
    initLanguage: function() {
      // Set the HTML's language and direction.
      var rtl = DwenguinoBlockly.isRtl();
      document.dir = rtl ? 'rtl' : 'ltr';
      document.head.parentElement.setAttribute('lang', DwenguinoBlockly.LANG);

      // Set the language for the backend.
      let data = { lang: DwenguinoBlockly.LANG };
      $.ajax({
          type: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          url: settings.hostname + "/lang",
          data: JSON.stringify(data)}
      ).done(function(data){
      }).fail(function(response, status)  {
          console.log(status, response);
      }); 
      
      // Sort languages alphabetically.
      var languages = [];
      for (var lang in DwenguinoBlocklyLanguageSettings.LANGUAGE_NAME) {
        languages.push([DwenguinoBlocklyLanguageSettings.LANGUAGE_NAME[lang], lang]);
      }
      var comp = function(a, b) {
        // Sort based on first argument ('English', 'Русский', '简体字', etc).
        if (a[0] > b[0]) return 1;
        if (a[0] < b[0]) return -1;
        return 0;
      };
      languages.sort(comp);
      // Populate the language selection menu.
      var languageMenu = document.getElementById('db_menu_item_language_selection');
      languageMenu.options.length = 0;
      for (var i = 0; i < languages.length; i++) {
        var tuple = languages[i];
        var lang = tuple[tuple.length - 1];
        var option = new Option(tuple[0], lang);
        if (lang === DwenguinoBlockly.LANG) {
          option.selected = true;
        }
        languageMenu.options.add(option);
      }
      languageMenu.addEventListener('change', DwenguinoBlockly.changeLanguage, true);

  },

    doTranslation: function() {
        // Inject language strings.
        document.title += ' ' + DwenguinoBlocklyLanguageSettings.translate(['title']);        

        document.getElementById('db_menu_item_upload').title = DwenguinoBlocklyLanguageSettings.translate(['loadBlocksFileTooltip']);
        document.getElementById('db_menu_item_download').title = DwenguinoBlocklyLanguageSettings.translate(['saveBlocksFileTooltip']);
        document.getElementById('db_menu_item_save').title = DwenguinoBlocklyLanguageSettings.translate(['saveProjectToProfileTooltip']);
        document.getElementById('db_menu_item_simulator').title = DwenguinoBlocklyLanguageSettings.translate(['toggleSimulator']);
        document.getElementById('db_menu_item_run').title = DwenguinoBlocklyLanguageSettings.translate(['compileAndDownload']);
        document.getElementById('db_menu_item_clear').title = DwenguinoBlocklyLanguageSettings.translate(['compileEmptyProgram']);

        var categories = ['catLogic', 'catLoops', 'catMath', 'catText', 'catLists',
            'catColour', 'catVariables', 'catFunctions', 'catBoardIO', 'catDwenguino', 'catSocialRobot', 'catInput', 'catOutput', 'catArduino', 'catComments', 'catConveyor'];
        for (var i = 0, cat; cat = categories[i]; i++) {
            var element = document.getElementById(cat);
            if (element) {
                element.setAttribute('name', DwenguinoBlocklyLanguageSettings.translate([cat]));
            }

        }
        var textVars = document.getElementsByClassName('textVar');
        for (var i = 0, textVar; textVar = textVars[i]; i++) {
            textVar.textContent = MSG['textVariable'];
        }
        var listVars = document.getElementsByClassName('listVar');
        for (var i = 0, listVar; listVar = listVars[i]; i++) {
            listVar.textContent = MSG['listVariable'];
        }
    },

    /**
     * Load blocks saved on App Engine Storage or in session/local storage.
     * @param {string} defaultXml Text representation of default blocks.
     */
    loadBlocks: function(defaultXml) {
      try {
        var loadOnce = window.sessionStorage.loadOnceBlocks;
      } catch(e) {
        // Firefox sometimes throws a SecurityError when accessing sessionStorage.
        // Restarting Firefox fixes this, so it looks like a bug.
        var loadOnce = null;
      }
      if ('BlocklyStorage' in window && window.location.hash.length > 1) {
        // An href with #key trigers an AJAX call to retrieve saved blocks.
        BlocklyStorage.retrieveXml(window.location.hash.substring(1));
      } else if (loadOnce) {
        // Language switching stores the blocks during the reload.
        delete window.sessionStorage.loadOnceBlocks;
        var xml = Blockly.Xml.textToDom(loadOnce);
        Blockly.Xml.domToWorkspace(xml, DwenguinoBlockly.workspace);
      } else if (defaultXml) {
        // Load the editor with default starting blocks.
        var xml = Blockly.Xml.textToDom(defaultXml);
        Blockly.Xml.domToWorkspace(xml, DwenguinoBlockly.workspace);
        // Set empty recording
        DwenguinoBlockly.recording = "";
      } else if ('BlocklyStorage' in window) {
        // Restore saved blocks in a separate thread so that subsequent
        // initialization is not affected from a failed load.
        window.setTimeout(BlocklyStorage.restoreBlocks, 0);
      }
  },

    setWorkspaceBlockFromXml: function(xml){
        DwenguinoBlockly.workspace.clear();
        try {
            var xmlDom = Blockly.Xml.textToDom(xml);
        } catch (e) {
            console.log("invalid xml");
            return;
        }
        Blockly.Xml.domToWorkspace(xmlDom, DwenguinoBlockly.workspace);
    },

    checkLoggedIn: async function() {
      $("#db_menu_item_save").hide()
      try {
        let response = await fetch(`${globalSettings.hostname}/user/info`)
        if (response.status == 200){
          $("#db_menu_item_save").show()
            this.loggedIn = true;
        } else if (response.status == 401){ 
            this.loggedIn = false;
        } else if (response.status == 403){
            this.loggedIn = false;
        } else {
            this.loggedIn = false;
        }
    } catch (err) {
        this.loggedIn = false;
    } finally {
        this.loggedIn = false;
    }
    },

    // TODO add param for code to load
    switchToTextualEditor(openTabsCode = [], closeCurrentTabs = false){
      // Turn off simulator
      if (DwenguinoBlockly.simulatorState !== "off"){
        DwenguinoBlockly.toggleSimulator();
        $("#db_menu_item_simulator").css("pointer-events","none");
      }
      DwenguinoBlockly.currentProgrammingContext = "text";
      document.getElementById("blocklyDiv").style.visibility = 'hidden';
      document.getElementById('db_code_pane').style.visibility = 'visible';
      if (closeCurrentTabs){
        DwenguinoBlockly.textualEditor.getEditorPane().closeTabs(false)
      }
      DwenguinoBlockly.setOpenTextualEditorTabs(openTabsCode)
      DwenguinoBlockly.saveState()
    },
    setOpenTextualEditorTabs(openTabsCode = []){
      openTabsCode.forEach((codeInfo) => {
        DwenguinoBlockly.textualEditor.getEditorPane().openTab(codeInfo.cppCode, codeInfo.filename)
      })
    },
    switchToBlockly(){
      DwenguinoBlockly.currentProgrammingContext = "blocks";
      document.getElementById("blocklyDiv").style.visibility = 'visible';
      document.getElementById('db_code_pane').style.visibility = 'hidden';
      DwenguinoBlockly.textualEditor.looseFocus();
      // Turn simulator on
      if (DwenguinoBlockly.simulatorState === "off"){
        DwenguinoBlockly.toggleSimulator();
        $("#db_menu_item_simulator").css("pointer-events","auto");
      }
      DwenguinoBlockly.saveState()
    },
    isUserLoggedIn(){
      return globalSettings && globalSettings.savedProgramUUID !== "" && globalSettings.savedProgramUUID !== undefined
    },
    saveState(){
      // If logged in, save state
      if (DwenguinoBlockly.isUserLoggedIn()){
        setTimeout(() => {
          DwenguinoBlockly.saveStateHandler(false);
        })
      }
    },
    setTextualCodeToggle(on) {
      const checkbox = document.querySelector('input[id="code_checkbox"]')
      checkbox.checked = on
    },

    setupEnvironment: async function(){
        this.checkLoggedIn();
        
        
        DwenguinoBlockly.initLanguage();
        let workspace = DwenguinoBlockly.injectBlockly();

        
        DwenguinoBlockly.initDwenguinoBlockly(workspace);
        DwenguinoBlockly.doTranslation();

        DwenguinoBlockly.loadBlocks(document.getElementById('startBlocks').innerHTML);
        DwenguinoBlockly.takeSnapshotOfWorkspace();
        $(window).resize(function(){
            DwenguinoBlockly.onresize();
            Blockly.svgResize(DwenguinoBlockly.workspace);
        });

        let codeViewCheckbox = document.querySelector('input[id="code_checkbox"]');

        codeViewCheckbox.addEventListener('change', function (event) {
          if (codeViewCheckbox.checked) {
            if (confirm("Opgepast! Wanneer je naar tekstuele code overstapt dan kan je je programma niet meer simuleren in de browser. Je kan de code dan enkel nog uitvoeren op het Dwenguino bord.")){
              DwenguinoBlockly.switchToTextualEditor([{
                cppCode: Blockly.Arduino.workspaceToCode(DwenguinoBlockly.workspace),
                filename: "blocks.cpp"
              }])
            } else {
              event.target.checked = false;
              return false;
            }
          } else {
              DwenguinoBlockly.switchToBlockly()
          }
        });
    },

    
    tearDownEnvironment: function(){
      // Called from the aruino IDE on close. For now do nothing.
    },

    displayCookieConsent: function(){
      // If not yet accepted show cookies banner
      if (localStorage.getItem("cookies") !== "accept"){
        let cookieConsent = DwenguinoBlocklyLanguageSettings.translateFrom('cookieConsent',['cookieConsent'])
                            + '<a id="cookie-info" href="#" class="ml-1">' + DwenguinoBlocklyLanguageSettings.translateFrom('cookieConsent',['cookieInfo']) + '</a>'
                            + '<div class=" ml-2 d-flex align-items-center justify-content-center g-2"> <button id="allow-cookies" class="allow-button mr-1">'+DwenguinoBlocklyLanguageSettings.translateFrom('cookieConsent',['close'])+'</button></div>';

        $('#cookie-consent').html(cookieConsent);

        let self = this;
        $("#cookie-info").click(() => {
          self.cookiesInformation.initCookiesInformation();
        });

        $('#allow-cookies').click(function () {
          localStorage.setItem("cookies", "accept");
          $('#cookie-consent').remove();
        }); 
      } else {
        $('#cookie-consent').remove();
      }    
    }
};

window.addEventListener('load', function(e) {
  DwenguinoBlockly.setupEnvironment();
});

export default DwenguinoBlockly;