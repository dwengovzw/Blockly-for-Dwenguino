import DwenguinoEventLogger from './logging/dwenguino_event_logger.js'
import DwenguinoSimulation from './simulation/dwenguino_simulation.js'
import TutorialMenu from './tutorials/tutorial_menu.js'
import FileIOController from './file_io_controller.js'
import { EVENT_NAMES } from './logging/event_names.js'
import SeverConfig from "./server_config.js"
import ServerConfig from './server_config.js'

/* global Blockly, hopscotch, tutorials, JsDiff, DwenguinoBlocklyLanguageSettings, MSG, BlocklyStorage */

//export { DwenguinoBlockly as default }



let DwenguinoBlockly = {
    simButtonStateClicked: false,

    workspace: null,
    recording: "",

    difficultyLevel: 1,
    simulatorState: "off",
    xmlLoadedFromFile: "",
    xmlFromScenario: "",

    logger: null,

    simulationEnvironment: null,

    tutorialMenu: null,

    fileIOController: null,

    initDwenguinoBlockly: function(workspace){
        this.workspace = workspace;
        this.setWorkspaceBlockFromXml('<xml id="startBlocks" style="display: none">' + document.getElementById('startBlocks').innerHTML + '</xml>');

        // Create file io controller responisble for saving and uploading files
        this.fileIOController = new FileIOController();
        // Create DwenguinoEventLogger instance
        // This instance should be passed to all classes which want to log events.
        this.logger = new DwenguinoEventLogger();
        this.logger.init();
        var self = this;

        DwenguinoBlockly.displayCookieConsent();

        // Create an instance of the tutorial menu (persists until the application stops).
        // Uses the event logger to capture tutorial actions.
        this.tutorialMenu = new TutorialMenu(this.logger);

        // Create new simulationenvironment
        this.simulationEnvironment = new DwenguinoSimulation(this.logger, this.workspace);  // This is weird, workspace should be created in a different place..

        //Restore recording after language change
        DwenguinoBlockly.recording = window.sessionStorage.loadOnceRecording || "";
        delete window.sessionStorage.loadOnceRecording;

        //init slider control
        $( "#db_menu_item_difficulty_slider" ).slider({
            value:0,
            min: 0,
            max: 2,
            step: 1,
            slide: function( event, ui ) {
                DwenguinoBlockly.setDifficultyLevel(ui.value);
                console.log(ui.value);
                let eventToRecord = self.logger.createEvent(EVENT_NAMES.difficultyLevel, ui.value);
                self.logger.recordEvent(eventToRecord);
            }
        });
        $( "#db_menu_item_difficulty_slider_input" ).val( "$" + $( "#db_menu_item_difficulty_slider" ).slider( "value" ) );

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

        //save/upload buttons
        $("#db_menu_item_run").click(function(){
          // TODO reset setup
          Blockly.Arduino.emptySetup();
          var code = Blockly.Arduino.workspaceToCode(DwenguinoBlockly.workspace);
          DwenguinoBlockly.runEventHandler(code);
        });

        //The following code handles the upload of a saved file.
        //If it is run as an arduino ide plugin its shows a filechooser and returns the xml string (depricated and removed)
        //If it is run in the browser it shows a modal dialog with two upload options:
        //1) Using the upload button.
        //2) Using the drag and drop system.
        $("#db_menu_item_upload").click(function(){
          let xml = "";
          if (window.File && window.FileReader && window.FileList && window.Blob) {
            // Great success! All the File APIs are supported.
            console.log("yay, files supported");

            // reset form
            $('#dropzoneModal .modal-header').empty();
            $('#dropzoneModal .modal-header').append('<h4 class="modal-title">'+ MSG.dropzone['dictUploadBlocks'] +'</h4>');
            $('#dropzoneModal .modal-header').append('<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>');
            $('#dropzoneModal .modal-body .message').empty();
            $('#dropzoneModal .modal-body .message').append('<p>' + MSG.dropzone['dictSelectFile'] + '</p>');
            $('#dropzoneModal .modal-body .message').append('<label for="fileInput" class="form-label">' + MSG.dropzone['dictChooseFile'] + '</label><input type="file" id="fileInput" class="form-control">');
            $('#dropzoneModal .modal-body .message').append('<div id="filedrag">' + MSG.dropzone['dictDefaultMessage'] + '</div>');
            $('#dropzoneModal .modal-body .message').append('<pre id="fileDisplayArea"></pre>');
            $('#dropzoneModal .modal-footer').empty();
            $('#dropzoneModal .modal-footer').append('<button id="submit_upload_modal_dialog_button" type="button" class="btn btn-default" data-dismiss="modal">Ok</button>');

            $("#dropzoneModal").modal('show');

            var processFile = function(file){
              var textType = /text.*/;
    
              if (file.type.match(textType)) {
                var reader = new FileReader();
    
                reader.onload = function(e) {
                  fileDisplayArea.innerText = file.name;
                  DwenguinoBlockly.xmlLoadedFromFile = reader.result;
                }
    
                reader.readAsText(file);
              } else {
                fileDisplayArea.innerText = MSG.dropzone['dictFileNotSupported'];
              }
            }
    
            let fileInput = document.getElementById('fileInput');
            var fileDisplayArea = document.getElementById('fileDisplayArea');
    
            console.log(fileInput);
            fileInput.addEventListener('change', function(e) {
              console.log("file input changed");
              var file = fileInput.files[0];
              processFile(file);
            });
    
            // file drag hover
            var FileDragHover = function(e) {
              e.stopPropagation();
              e.preventDefault();
              e.target.className = (e.type == "dragover" ? "hover" : "");
            };
    
            // file selection
            var FileSelectHandler = function(e) {
              // cancel event and hover styling
              FileDragHover(e);
              // fetch FileList object
              var files = e.target.files || e.dataTransfer.files;
              var file = files[0];
              processFile(file);
            };
    
            var filedrag = document.getElementById("filedrag");
            filedrag.addEventListener("dragover", FileDragHover, false);
            filedrag.addEventListener("dragleave", FileDragHover, false);
            filedrag.addEventListener("drop", FileSelectHandler, false);
            filedrag.style.display = "block";
    
            $("#submit_upload_modal_dialog_button").click(function(){
              DwenguinoBlockly.restoreFromXml(Blockly.Xml.textToDom(DwenguinoBlockly.xmlLoadedFromFile));
            });

          } else {
            alert('The File APIs are not fully supported in this browser.');
          }
          
        });

        // This code handles the download of the workspace to a local file.
        // If this is run in the arduino ide, a filechooser is shown. (depricated and removed)
        // If it is run in the browser, the document is downloaded using the name blocks.xml.
        $("#db_menu_item_download").click(function(){
          var xml = Blockly.Xml.workspaceToDom(DwenguinoBlockly.workspace);
          var data = Blockly.Xml.domToText(xml);
          
          console.debug(data);
          localStorage.workspaceXml = data;
          DwenguinoBlockly.download("blocks.xml", data);
          
          let event = self.logger.createEvent(EVENT_NAMES.downloadClicked, "");
          DwenguinoBlockly.logger.recordEvent(event);
        });

        $("#db_menu_item_clear").click(function(){
          DwenguinoBlockly.simulationEnvironment.stop();
          var code = '#include <Wire.h>\n#include <Dwenguino.h>\n#include <LiquidCrystal.h>\n\nvoid setup(){\ninitDwenguino();\ndwenguinoLCD.setCursor(2,0);\ndwenguinoLCD.print(String("WeGoSTEM ;)"));\n}\n\nvoid loop(){}\n';
          DwenguinoBlockly.runEventHandler(code);
        });

         $("#blocklyDiv").click(function(){
           DwenguinoBlockly.simulationEnvironment.stop();
         });

         // Process blockly events and log them
         DwenguinoBlockly.workspace.addChangeListener(function(event){
           // Stop de simulator
           //DwenguinoBlockly.simulationEnvironment.stop();
           console.log("blockly event");
           let eventToRecord = "";
           if (event.type == "create"){
             var data = {
               xml: Blockly.Xml.domToText(event.xml),
               ids: event.ids
             }
             data = JSON.stringify(data);
             eventToRecord = DwenguinoBlockly.logger.createEvent(EVENT_NAMES.blocklyBlockCreate, data);
             DwenguinoBlockly.logger.recordEvent(eventToRecord);
           } else if (event.type == "delete"){
             var data = {
               oldXml: Blockly.Xml.domToText(event.oldXml),
               ids: event.ids
             }
             data = JSON.stringify(data);
             eventToRecord = DwenguinoBlockly.logger.createEvent(EVENT_NAMES.blocklyBlockDelete, data);
             DwenguinoBlockly.logger.recordEvent(eventToRecord);
           } else if (event.type == "move"){
             var data = {
               oldParentId: event.oldParentId,
               oldInputName: event.oldInputName,
               oldCoordinate: event.oldCoordinate,
               newParentId: event.newParentId,
               newInputName: event.newInputName,
               newCoordinate: event.newCoordinate
             }
             data = JSON.stringify(data);
             eventToRecord = DwenguinoBlockly.logger.createEvent(EVENT_NAMES.blocklyBlockMove, data);
             DwenguinoBlockly.logger.recordEvent(eventToRecord);
           } else if (event.type == "createVar"){
             var data = {
               varType: event.varType,
               varName: event.varName,
               varId: event.varId
             }
             data = JSON.stringify(data);
             eventToRecord = DwenguinoBlockly.logger.createEvent(EVENT_NAMES.blocklyVarCreate, data);
             DwenguinoBlockly.logger.recordEvent(eventToRecord);
           } else if (event.type == "deleteVar"){
             var data = {
               varType: event.varType,
               varName: event.varName,
               varId: event.varId
             }
             data = JSON.stringify(data);
             eventToRecord = DwenguinoBlockly.logger.createEvent(EVENT_NAMES.blocklyVarDelete, data);
             DwenguinoBlockly.logger.recordEvent(eventToRecord);
           } else if (event.type == Blockly.Events.VAR_RENAME){
             var data = {
               oldName: event.oldName,
               newName: event.newName,
               varId: event.varId
             }
             data = JSON.stringify(data);
             eventToRecord = DwenguinoBlockly.logger.createEvent(EVENT_NAMES.blocklyVarRename, data);
             DwenguinoBlockly.logger.recordEvent(eventToRecord);
           } else if (event.type == Blockly.Events.UI){
             var data = {
               element: event.element,
               oldValue: event.oldValue,
               newValue: event.newValue
             }
             data = JSON.stringify(data);
             eventToRecord = DwenguinoBlockly.logger.createEvent(EVENT_NAMES.blocklyUI, data);
             DwenguinoBlockly.logger.recordEvent(eventToRecord);
           } else if (event.type == Blockly.Events.CHANGE){
             var data = {
               element: event.element,
               name: event.name,
               oldValue: event.oldValue,
               newValue: event.newValue
             };
             data = JSON.stringify(data);
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

    },
    restoreFromXml: function(xml){
      DwenguinoBlockly.workspace.clear();
      Blockly.Xml.domToWorkspace(xml, DwenguinoBlockly.workspace);
      var count = DwenguinoBlockly.workspace.getAllBlocks().length;
      let eventToRecord = DwenguinoBlockly.logger.createEvent(EVENT_NAMES.uploadClicked, xml);
      DwenguinoBlockly.logger.recordEvent(eventToRecord);
    },

    download: function(filename, text) {
      var element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
      element.setAttribute('download', filename);

      element.style.display = 'none';
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
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
      let eventToRecord = DwenguinoBlockly.logger.createEvent(EVENT_NAMES.simButtonStateClicked, DwenguinoBlockly.simulatorState);
      DwenguinoBlockly.logger.recordEvent(eventToRecord);

      DwenguinoBlockly.onresize();
      Blockly.svgResize(DwenguinoBlockly.workspace);
    },

    runEventHandler: function(code){
      
      DwenguinoBlockly.disableRunButton();
      
      $.ajax({
          url: ServerConfig.getServerUrl() + "/utilities/run",
          dataType: 'json',
          type: 'post',
          contentType: 'application/x-www-form-urlencoded',
          data: {"code": code},
          success: function( data, textStatus, jQxhr ){
              console.log('succes');
              console.log(data);

              if (data.status === "error"){
                DwenguinoBlockly.showModalErrorDialog(data);
              }
              DwenguinoBlockly.resetRunButton();
          },
          error: function( jqXhr, textStatus, errorThrown ){
              console.log( errorThrown );
              DwenguinoBlockly.resetRunButton();
          }
      });
      
      console.log(code.replace(/\r?\n|\r/g, "\n"));
      let eventToRecord = DwenguinoBlockly.logger.createEvent(EVENT_NAMES.runClicked, "");
      DwenguinoBlockly.logger.recordEvent(eventToRecord);
    },
    showModalErrorDialog: function(error){
      $('#errorModal .modal-header').html(MSG.runError);
      if (error.info === "Upload failed"){
        $('#errorModal .modal-body .message').html(MSG.uploadError);
      } else if (error.info === "Compilation failed"){
        $('#errorModal .modal-body .message').html(MSG.compileError);
      } else if (error.info === "Clean failed"){
        $('#errorModal .modal-body .message').html(MSG.cleanError);
      } else {
        $('#errorModal .modal-body .message').html(MSG.uploadError);
      }

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
      $("#db_menu_item_dwengo_robot_teacher_image").attr("src", "DwenguinoIDE/img/gear_animation.gif");
      $("#db_menu_item_dwengo_robot_teacher_image").css({padding: "10px 25px", maxHeight: "100%", float: "right"});
      $("#db_menu_item_run").css({color: "gray"});
      $("#db_menu_item_clear").css({color: "gray"});
    },
    resetRunButton: function(){
          $("#db_menu_item_run").click(function(){
            Blockly.Arduino.emptySetup();
            var code = Blockly.Arduino.workspaceToCode(DwenguinoBlockly.workspace);
            DwenguinoBlockly.runEventHandler(code);
          });

          $("#db_menu_item_clear").click(function(){
            var code = '#include <Wire.h>\n#include <Dwenguino.h>\n#include <LiquidCrystal.h>\n\nvoid setup(){\ninitDwenguino();\ndwenguinoLCD.setCursor(2,0);\ndwenguinoLCD.print(String("WeGoSTEM ;)"));\n}\n\nvoid loop(){}\n';
            DwenguinoBlockly.runEventHandler(code);
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
          $("#db_menu_item_dwengo_robot_teacher_image").attr("src", "DwenguinoIDE/img/dwengo_robot_plain.svg");
    },

    prevWorkspaceXml: "",
    /**
    *   Take a snapshot of the current timestamp, simulatorstate, selectedDifficulty, activeTutorial and blocks in the workspace.
    */
    takeSnapshotOfWorkspace: function(){
        console.log("taking snapshot");
        // Get xml for current code
        let xml = Blockly.Xml.workspaceToDom(DwenguinoBlockly.workspace);
        let xmlText = Blockly.Xml.domToText(xml);
        if (xmlText != DwenguinoBlockly.prevWorkspaceXml){
          // Get javascript for current code
          let js = Blockly.JavaScript.workspaceToCode(DwenguinoBlockly.workspace);
          let workspaceState = {
            blocksXml: xmlText,
            blocksJsCode: js,
          }
          let workspaceStateText = JSON.stringify(workspaceState);
          DwenguinoBlockly.prevWorkspaceXml = xmlText;
          let eventToRecord = this.logger.createEvent(EVENT_NAMES.changedWorkspace, workspaceStateText);
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

        // Log code change if code has changed
        DwenguinoBlockly.logCodeChange();

        Blockly.Arduino.emptySetup();
        let code = Blockly.Arduino.workspaceToCode(DwenguinoBlockly.workspace);

        // display code
        if (DwenguinoBlockly.previouslyRenderedCode === null){
            document.getElementById('db_arduino_code').innerHTML =
                prettyPrintOne(code.replace(/</g, "&lt;").replace(/>/g, "&gt;"), 'cpp', false);
                DwenguinoBlockly.previouslyRenderedCode = code;
        }
        else if (code !== DwenguinoBlockly.previouslyRenderedCode) {
          //When the redered code changed log the block structures
          //Do this because when the user moves blocks we do not want to log anything
          //We want to log code progression not code movement
          let resultStringArray = DwenguinoBlockly.highlightModifiedCode(code);            

          document.getElementById('db_arduino_code').innerHTML =
              prettyPrintOne(resultStringArray.join(''), 'cpp', false);
          DwenguinoBlockly.previouslyRenderedCode = code;  
        }
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

    setDifficultyLevel: function(level){
        DwenguinoBlockly.difficultyLevel = level;
        $("#toolbox").load("./DwenguinoIDE/levels/lvl" + level + ".xml", function(){
            DwenguinoBlockly.doTranslation();
            DwenguinoBlockly.workspace.updateToolbox(document.getElementById("toolbox"));
        });
    },

    fallbackCopyCodeToClipboard: function(text) {
      var textArea = document.createElement("dummy-text-area");
      textArea.value = text;
      
      // Avoid scrolling to bottom
      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.position = "fixed";
    
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
    
      try {
        document.execCommand('copy');
        $('#notification-copy').show();
        $('#notification-copy').text(MSG.arduinoCodeCopied);
        setTimeout(function() {
          $("#notification-copy").hide('blind', {}, 500)
        }, 3000);
      } catch (err) {
        console.error('Unable to copy Arduino code: ', err);
      }
    
      document.body.removeChild(textArea);
    },

    copyCodeToClipboard: function(){
      let code = Blockly.Arduino.workspaceToCode(DwenguinoBlockly.workspace);
      if (!navigator.clipboard) {
        fallbackCopyCodeToClipboard(code);
        return;
      }
      navigator.clipboard.writeText(code).then(function() {
        $('#notification-copy').show();
        $('#notification-copy').text(MSG.arduinoCodeCopied);
        setTimeout(function() {
          $("#notification-copy").hide('blind', {}, 500)
        }, 3000);
      }, function(err) {
        console.error('Unable to copy Arduino code: ', err);
      });
    },

    /*
      The following functions load the contents of a block xml file into the workspace.
    */


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
                media: "DwenguinoIDE/img/",
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
        var newLang = encodeURIComponent(languageMenu.options[languageMenu.selectedIndex].value);
        var search = window.location.search;
        if (search.length <= 1) {
            search = '?lang=' + newLang;
        } else if (search.match(/[?&]lang=[^&]*/)) {
            search = search.replace(/([?&]lang=)[^&]*/, '$1' + newLang);
        } else {
            search = search.replace(/\?/, '?lang=' + newLang + '&');
        }

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
            'catColour', 'catVariables', 'catFunctions', 'catBoardIO', 'catDwenguino', 'catSocialRobot', 'catArduino', 'catComments'];
        for (var i = 0, cat; cat = categories[i]; i++) {
            var element = document.getElementById(cat);
            if (element) {
                element.setAttribute('name', MSG[cat]);
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

  //TODO: remove following function: not used anywhere
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
        DwenguinoBlockly.setDifficultyLevel(0);
        DwenguinoBlockly.takeSnapshotOfWorkspace();
        $(window).resize(function(){
            DwenguinoBlockly.onresize();
            Blockly.svgResize(DwenguinoBlockly.workspace);
        });

        let codeViewCheckbox = document.querySelector('input[id="code_checkbox"]');

        codeViewCheckbox.addEventListener('change', function () {
          if (codeViewCheckbox.checked) {
            document.getElementById("blocklyDiv").style.visibility = 'hidden';
            document.getElementById('db_code_pane').style.visibility = 'visible';
            DwenguinoBlockly.renderCode();
          } else {
            document.getElementById("blocklyDiv").style.visibility = 'visible';
            document.getElementById('db_code_pane').style.visibility = 'hidden';
          }
        });

        $('#copy-code').click(function () {
          DwenguinoBlockly.copyCodeToClipboard();
        });
    },
    
    tearDownEnvironment: function(){
      // Called from the aruino IDE on close. For now do nothing.
    },

    displayCookieConsent: function(){
      let cookieConsent = MSG.cookieConsent['cookieConsent']
                          + '<a href="#" class="ml-1">' + MSG.cookieConsent['cookieInfo'] + '</a>'
                          + '<div class=" ml-2 d-flex align-items-center justify-content-center g-2"> <button id="allow-cookies" class="allow-button mr-1">'+MSG.cookieConsent['close']+'</button></div>';

      $('#cookie-consent').html(cookieConsent);

      $('#allow-cookies').click(function () {
        $('#cookie-consent').remove();
      });      
      
      // <span>This site uses cookies to enhance user experience. see<a href="#" class="ml-1 text-decoration-none">Privacy policy</a> </span>
      // <div class=" ml-2 d-flex align-items-center justify-content-center g-2"> <button class="allow-button mr-1">Allow cookies</button> <button class="allow-button">cancel</button> </div>
    }
};


$(document).ready(function() {
  DwenguinoBlockly.setupEnvironment();
});

export default DwenguinoBlockly;