import DwenguinoEventLogger from './logging/dwenguino_event_logger.js'
import DwenguinoSimulation from './simulation/dwenguino_simulation.js'
import TutorialMenu from './tutorials/tutorial_menu.js'
import CookiesInformation from './user/cookies_information.js'
import LoginMenu from './user/login_menu.js'
import FileIOController from './utils/file_io_controller.js'
import { EVENT_NAMES } from './logging/event_names.js'
import ServerConfig from './server_config.js'
import jQuery from "jquery";
import 'jquery-ui-bundle';
import 'bootstrap';
import TextualEditor from './textual_editor/textual_editor.js'

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
    loginMenu: null,
    tutorialMenu: null,

    compilationPath: "",
    textualEditor: new TextualEditor("db_code_pane"),
    currentProgrammingContext: "blocks", // The current coding context can be blocks or text. 

    initDwenguinoBlockly: function(workspace){

          /**
           * If local installation is running, generate binary locally. 
           * Otherwise generate binary on the server.
           */
          $.ajax({
            url: "http://localhost:12032/utilities/getEnvironment",
            dataType: 'text',
            type: 'get',
            success: function( data, textStatus, jQxhr ){
                console.log('succes');
                DwenguinoBlockly.compilationPath = "http://localhost:12032/utilities/getDwenguinoBinary";
            },
            error: function( jqXhr, textStatus, errorThrown ){
                DwenguinoBlockly.compilationPath = ServerConfig.getServerUrl() + "/utilities/getDwenguinoBinary"
                console.log( errorThrown );
            }
        });


        this.workspace = workspace;
        this.setWorkspaceBlockFromXml('<xml id="startBlocks" style="display: none">' + document.getElementById('startBlocks').innerHTML + '</xml>');

        //Create device manager responsible for managing the connection to de Dwenguino board

        // Create DwenguinoEventLogger instance
        // This instance should be passed to all classes which want to log events.
        this.logger = new DwenguinoEventLogger();
        this.logger.init();
        var self = this;

        this.cookiesInformation = new CookiesInformation();
        DwenguinoBlockly.displayCookieConsent();

        this.loginMenu = new LoginMenu();

        // Create an instance of the tutorial menu (persists until the application stops).
        // Uses the event logger to capture tutorial actions.
        this.tutorialMenu = new TutorialMenu(this.logger);

        // Create new simulationenvironment
        this.simulationEnvironment = new DwenguinoSimulation(this.logger, this.workspace);  // This is weird, workspace should be created in a different place..

        //Restore recording after language change
        DwenguinoBlockly.recording = window.sessionStorage.loadOnceRecording || "";
        delete window.sessionStorage.loadOnceRecording;

        $("#db_menu_item_dwengo_robot_teacher_image").click(function() {
          self.loginMenu.createInitialMenu();
        });

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


        //The following code handles the upload of a saved file.
        //If it is run as an arduino ide plugin its shows a filechooser and returns the xml string (depricated and removed)
        //If it is run in the browser it shows a modal dialog with two upload options:
        //1) Using the upload button.
        //2) Using the drag and drop system.
        $("#db_menu_item_upload").on("click", function(){
          FileIOController.uploadTextFile().then((result) => {
            if (DwenguinoBlockly.currentProgrammingContext === "blocks"){
              DwenguinoBlockly.restoreFromXml(Blockly.Xml.textToDom(result));
            } else if (DwenguinoBlockly.currentProgrammingContext === "text"){
              DwenguinoBlockly.textualEditor.getEditorPane().renderEditor(result);
            } else {
              console.log("Error uploading file");
            }
          }, (err) => {
            console.log(err);
          })
        });

        // This code handles the download of the workspace to a local file.
        // If this is run in the arduino ide, a filechooser is shown. (depricated and removed)
        // If it is run in the browser, the document is downloaded using the name blocks.xml.
        $("#db_menu_item_download").click(function(){
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
            DwenguinoBlockly.download("sketch.cpp", cCode);
            data = {
              cCode: cCode
            }
          }else{
            return
          }

          let event = self.logger.createEvent(EVENT_NAMES.downloadClicked, data);
          DwenguinoBlockly.logger.recordEvent(event);
        });

        this.resetRunButton(); // set event handlers on run and clear buttons

         $("#blocklyDiv").click(function(){
           DwenguinoBlockly.simulationEnvironment.stop();
         });

         // Process blockly events and log them
         DwenguinoBlockly.workspace.addChangeListener(function(event){
           // Stop de simulator
           //DwenguinoBlockly.simulationEnvironment.stop();
          console.log("blockly event");
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
            console.log(event.type);
          }
        });

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

    downloadDwenguinoBinaryHandler: function(code){
      DwenguinoBlockly.downloadDwenguinoBinaryHandlerAjax(code);
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

    downloadDwenguinoBinaryHandlerAjax: function(code){
      DwenguinoBlockly.disableRunButton();
      let url = DwenguinoBlockly.compilationPath + "?code=" + encodeURIComponent(code);
      let res = "success";
      try{
        $.ajax({
          type: "GET",
          url: url,
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
              DwenguinoBlockly.downloadBlobToFile(blob, filename);
            }
            // To here

            DwenguinoBlockly.resetRunButton();
          },
          error: function(err, textStatus, errorThrown){
            console.log(`Compilation failed with error: ${err}`)
            DwenguinoBlockly.resetRunButton();
          }
        }) 
      } catch (e) {
        console.log(res);
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
        console.log("toggle console")
        $('#errorModal .modal-body .console').toggle();
      });

      if (error.message.signal === "SIGTERM"){
        $('#errorModal .modal-body .console').html('Operation timed out');
      }else{
        $('#errorModal .modal-body .console').html(error.trace);
      }
      $('#errorModal').modal('show');
    },

    disableRunButton: function(){
      $("#db_menu_item_run").off("click");
      $("#db_menu_item_clear").off("click");
      $("#db_menu_item_dwengo_robot_teacher_image").attr("src", DwenguinoBlockly.basepath + "DwenguinoIDE/img/gear_animation.gif");
      $("#db_menu_item_dwengo_robot_teacher_image").css({padding: "10px 25px", maxHeight: "100%", float: "right"});
      $("#db_menu_item_run").css({color: "gray"});
      $("#db_menu_item_clear").css({color: "gray"});
    },

    resetRunButton: function(){
          $("#db_menu_item_run").click(function(){
            Blockly.Arduino.emptySetup();
            var code = DwenguinoBlockly.getCodeForCurrentContext();
            DwenguinoBlockly.downloadDwenguinoBinaryHandler(code);
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

          $("#db_menu_item_dwengo_robot_teacher_image").css({padding: "10px", maxHeight: "100%", float: "right"});
          $("#db_menu_item_dwengo_robot_teacher_image").attr("src", DwenguinoBlockly.basepath + "DwenguinoIDE/img/dwengo_robot_plain.svg");
    },

    prevWorkspaceXml: "",
    /**
    *   Take a snapshot of the current timestamp, simulatorstate, selectedDifficulty, activeTutorial and blocks in the workspace.
    */
    takeSnapshotOfWorkspace: function(){
        console.log("taking snapshot");
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
        DwenguinoBlockly.textualEditor.getEditorPane().renderEditor(code);

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
      console.log("loading into workspace");
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
          
          console.log(variables)
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
            console.log(blockXml);
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
        console.log(data);
        $.ajax({
            type: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            url: ServerConfig.getServerUrl() + "/lang",
            data: JSON.stringify(data)}
        ).done(function(data){
            console.log(data);
        }).fail(function(response, status)  {
            console.log(status, response);
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
          url: ServerConfig.getServerUrl() + "/lang",
          data: JSON.stringify(data)}
      ).done(function(data){
          console.log(data);
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
        document.getElementById('db_menu_item_download').title = MSG['saveBlocksFileTooltip'];
        document.getElementById('db_menu_item_simulator').title = MSG['toggleSimulator'];

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

    setupEnvironment: function(){
        DwenguinoBlockly.initLanguage();
        let workspace = DwenguinoBlockly.injectBlockly();

        //DwenguinoBlockly.loadBlocks('<xml id="startBlocks" style="display: none">' + document.getElementById('startBlocks').innerHTML + '</xml>');
        DwenguinoBlockly.initDwenguinoBlockly(workspace);
        DwenguinoBlockly.doTranslation();
        //DwenguinoBlockly.setDifficultyLevel(0);
        DwenguinoBlockly.takeSnapshotOfWorkspace();
        $(window).resize(function(){
            DwenguinoBlockly.onresize();
            Blockly.svgResize(DwenguinoBlockly.workspace);
        });

        let codeViewCheckbox = document.querySelector('input[id="code_checkbox"]');

        codeViewCheckbox.addEventListener('change', function (event) {
          if (codeViewCheckbox.checked) {
            if (confirm("Opgepast! Wanneer je naar tekstuele code overstapt dan kan je je programma niet meer simuleren in de browser. Je kan de code dan enkel nog uitvoeren op het Dwenguino bord.")){
              // Turn off simulator
              if (DwenguinoBlockly.simulatorState !== "off"){
                DwenguinoBlockly.toggleSimulator();
                $("#db_menu_item_simulator").css("pointer-events","none");
              }
              DwenguinoBlockly.currentProgrammingContext = "text";
              document.getElementById("blocklyDiv").style.visibility = 'hidden';
              document.getElementById('db_code_pane').style.visibility = 'visible';
              DwenguinoBlockly.renderCode();
            } else {
              event.target.checked = false;
              return false;
            }
          } else {
            if (confirm("Opgepast! Wanneer je terugkeert naar blokken code dan ben je je aanpassingen aan de tekstuele code kwijt. Ben je zeker dat je wil verdergaan?")){
              DwenguinoBlockly.currentProgrammingContext = "blocks";
              document.getElementById("blocklyDiv").style.visibility = 'visible';
              document.getElementById('db_code_pane').style.visibility = 'hidden';
              // Turn simulator on
              if (DwenguinoBlockly.simulatorState === "off"){
                DwenguinoBlockly.toggleSimulator();
                $("#db_menu_item_simulator").css("pointer-events","auto");
              }
            } else {
              event.target.checked = true;
              return false; // Cancel onchange handler
            }
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

$(document).ready(function() {
  DwenguinoBlockly.setupEnvironment();
});

export default DwenguinoBlockly;