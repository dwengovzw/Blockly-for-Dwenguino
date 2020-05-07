import DwenguinoEventLogger from './logging/DwenguinoEventLogger.js'
import DwenguinoSimulation from './simulation/DwenguinoSimulation.js'
import TutorialMenu from './tutorials/TutorialMenu.js'
import FileIOController from './FileIoController.js';
import { EVENT_NAMES } from './logging/EventNames.js'
import SeverConfig from "./ServerConfig.js"
import ServerConfig from './ServerConfig.js';

/* global Blockly, hopscotch, tutorials, JsDiff, DwenguinoBlocklyLanguageSettings, MSG, BlocklyStorage */

//export { DwenguinoBlockly as default }

export default DwenguinoBlockly

var DwenguinoBlockly = {
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

    initDwenguinoBlockly: function(){
        
        // Create file io controller responisble for saving and uploading files
        this.fileIOController = new FileIOController();
        // Create DwenguinoEventLogger instance
        // This instance should be passed to all classes which want to log events.
        this.logger = new DwenguinoEventLogger();
        this.logger.init();

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
                this.logger.createEvent(this.logger.createEvent("setDifficultyLevel", ui.value));
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
          var code = Blockly.Arduino.workspaceToCode(DwenguinoBlockly.workspace);
          DwenguinoBlockly.runEventHandler(code);
        });


        //The following code handles the upload of a saved file.
        //If it is run as an arduino ide plugin its shows a filechooser and returns the xml string (depricated and removed)
        //If it is run in the browser it shows a modal dialog with two upload options:
        //1) Using the upload button.
        //2) Using the drag and drop system.
        $("#db_menu_item_upload").click(function(){
          var xml = "";
          if (window.File && window.FileReader && window.FileList && window.Blob) {
            // Great success! All the File APIs are supported.
            console.log("yay, files supported");

            // reset form
            $('div').remove('#dropzoneModal');

            $('#blocklyDiv').append('<div id="dropzoneModal" class="modal fade" role="dialog"></div>');
            $('#dropzoneModal').append('<div id="modalDialog" class="modal-dialog"></div>');
            $('#modalDialog').append('<div class="modal-header"><button type="button" class="close" data-dismiss="modal">&times;</button><h4 class="modal-title">Upload</h4></div>');
            $('#modalDialog').append('<div class="modal-body">'+ MSG.dropzone['dictSelectFile']+'<input type="file" id="fileInput"><div id="filedrag">'+ MSG.dropzone['dictDefaultMessage'] +'</div><pre id="fileDisplayArea"><pre></div>');
            $('#modalDialog').append('<div class="modal-footer"><button id="submit_upload_modal_dialog_button" type="button" class="btn btn-default" data-dismiss="modal">Ok</button></div>');

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
                fileDisplayArea.innerText = "File not supported!"
              }
            }
    
            var fileInput = document.getElementById('fileInput');
            var fileDisplayArea = document.getElementById('fileDisplayArea');
    
            fileInput.addEventListener('change', function(e) {
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
            
            console.log(data);
            localStorage.workspaceXml = data;
            DwenguinoBlockly.download("blocks.xml", data);
            
          DwenguinoBlockly.logger.recordEvent(this.logger.createEvent(EVENT_NAMES.downloadClicked, ""));
        });

        $("#db_menu_item_clear").click(function(){
          DwenguinoBlockly.simulationEnvironment.stop();
          var code = '#include <Wire.h>\n#include <Dwenguino.h>\n#include <LiquidCrystal.h>\n\nvoid setup(){\ninitDwenguino();\ndwenguinoLCD.setCursor(2,0);\ndwenguinoLCD.print(String("WeGoSTEM ;)"));\n}\n\nvoid loop(){}\n';
          DwenguinoBlockly.runEventHandler(code);
        });

         $("#language1").click(function(){
            DwenguinoBlockly.language = "cpp";
            DwenguinoBlockly.renderCode();
         });

         $("#language2").click(function(){
            DwenguinoBlockly.language = "js";
            DwenguinoBlockly.renderCode();
         });

         $("#blocklyDiv").click(function(){
           DwenguinoBlockly.simulationEnvironment.stop();
         });

         // Process blockly events and log them
         DwenguinoBlockly.workspace.addChangeListener(function(event){
           // Stop de simulator
           //DwenguinoBlockly.simulationEnvironment.stop();
           console.log("blockly event");
           if (event.type == "create"){
             var data = {
               xml: event.xml,
               ids: event.ids
             }
             data = JSON.stringify(data);
             DwenguinoBlockly.logger.recordEvent(DwenguinoBlockly.logger.createEvent(EVENT_NAMES.blocklyBlockCreate, data));
           } else if (event.type == "delete"){
             var data = {
               oldXml: event.oldXml,
               ids: event.ids
             }
             data = JSON.stringify(data);
             DwenguinoBlockly.logger.recordEvent(DwenguinoBlockly.logger.createEvent(EVENT_NAMES.blocklyBlockDelete, data));
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
             DwenguinoBlockly.logger.recordEvent(DwenguinoBlockly.logger.createEvent(EVENT_NAMES.blocklyBlockMove, data));
           } else if (event.type == "createVar"){
             var data = {
               varType: event.varType,
               varName: event.varName,
               varId: event.varId
             }
             data = JSON.stringify(data);
             DwenguinoBlockly.logger.recordEvent(DwenguinoBlockly.logger.createEvent(EVENT_NAMES.blocklyVarCreate, data));
           } else if (event.type == "deleteVar"){
             var data = {
               varType: event.varType,
               varName: event.varName,
               varId: event.varId
             }
             data = JSON.stringify(data);
             DwenguinoBlockly.logger.recordEvent(DwenguinoBlockly.logger.createEvent(EVENT_NAMES.blocklyVarDelete, data));
           } else if (event.type == Blockly.Events.VAR_RENAME){
             var data = {
               oldName: event.oldName,
               newName: event.newName,
               varId: event.varId
             }
             data = JSON.stringify(data);
             DwenguinoBlockly.logger.recordEvent(DwenguinoBlockly.logger.createEvent(EVENT_NAMES.blocklyVarRename, data));
           } else if (event.type == Blockly.Events.UI){
             var data = {
               element: event.element,
               oldValue: event.oldValue,
               newValue: event.newValue
             }
             data = JSON.stringify(data);
             DwenguinoBlockly.logger.recordEvent(DwenguinoBlockly.logger.createEvent(EVENT_NAMES.blocklyUI, data));
           } else if (event.type == Blockly.Events.CHANGE){
             var data = {
               element: event.element,
               name: event.name,
               oldValue: event.oldValue,
               newValue: event.newValue
             };
             data = JSON.stringify(data);
             DwenguinoBlockly.logger.recordEvent(DwenguinoBlockly.logger.createEvent(EVENT_NAMES.blocklyChange, data));
           } else if (event.type == Blockly.Events.UNDO){
             console.log(event);
             var data = {};
              DwenguinoBlockly.logger.recordEvent(DwenguinoBlockly.logger.createEvent(EVENT_NAMES.undo, data));
           }
         });

    },
    restoreFromXml: function(xml){
      DwenguinoBlockly.workspace.clear();
      Blockly.Xml.domToWorkspace(xml, DwenguinoBlockly.workspace);
      var count = DwenguinoBlockly.workspace.getAllBlocks().length;
      DwenguinoBlockly.logger.recordEvent(DwenguinoBlockly.logger.createEvent(EVENT_NAMES.uploadClicked, xml));
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
      DwenguinoBlockly.logger.recordEvent(DwenguinoBlockly.logger.createEvent(EVENT_NAMES.simButtonStateClicked, DwenguinoBlockly.simulatorState));
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
      DwenguinoBlockly.logger.recordEvent(DwenguinoBlockly.logger.createEvent(EVENT_NAMES.runClicked, ""));
    },
    showModalErrorDialog: function(error){
      $('#errorModal .modal-header').text(MSG.runError);
      if (error.info === "Upload failed"){
        $('#errorModal .modal-body .message').text(MSG.uploadError);
      } else if (error.info === "Compilation failed"){
        $('#errorModal .modal-body .message').text(MSG.compileError);
      } else if (error.info === "Clean failed"){
        $('#errorModal .modal-body .message').text(MSG.cleanError);
      } else {
        $('#errorModal .modal-body .message').text(MSG.uploadError);
      }

      $('#errorModal .modal-body .console').hide();
      $('#errorModal .modal-body .error_details').off("click");
      $('#errorModal .modal-body .error_details').click(function(){
        console.log("toggle console")
        $('#errorModal .modal-body .console').toggle();
      });

      if (error.message.signal === "SIGTERM"){
        $('#errorModal .modal-body .console').text('Operation timed out');
      }else{
        $('#errorModal .modal-body .console').text(error.trace);
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
          DwenguinoBlockly.logger.recordEvent(this.logger.createEvent(EVENT_NAMES.changedWorkspace, workspaceStateText));
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
    language: "cpp",
    /**
     * Populate the currently selected pane with content generated from the blocks.
     */
    renderCode: function() {
        var arduino_content = document.getElementById("content_arduino");
        //var xml_content = document.getElementById("content_xml");

        // Log code change if code has changed
        DwenguinoBlockly.logCodeChange();

        // transform code
        if (DwenguinoBlockly.language === "cpp") {
            var code = Blockly.Arduino.workspaceToCode(DwenguinoBlockly.workspace);
        }
        else if (DwenguinoBlockly.language === "js") {
            var code = Blockly.JavaScript.workspaceToCode(DwenguinoBlockly.workspace);
        }

        // display code
        if (DwenguinoBlockly.previouslyRenderedCode === null){
            /*document.getElementById('content_arduino').innerHTML =
                prettyPrintOne(code.replace(/</g, "&lt;").replace(/>/g, "&gt;"), 'cpp', false);
                DwenguinoBlockly.previouslyRenderedCode = code;*/
        }
        else if (code !== DwenguinoBlockly.previouslyRenderedCode) {
            //When the redered code changed log the block structures
            //Do this because when the user moves blocks we do not want to log anything
            //We want to log code progression not code movement
            

            var diff = JsDiff.diffWords(DwenguinoBlockly.previouslyRenderedCode, code);
            var resultStringArray = [];
            for (var i = 0; i < diff.length; i++) {
              if (!diff[i].removed) {
                var escapedCode = diff[i].value.replace(/</g, "&lt;")
                                               .replace(/>/g, "&gt;");
                if (diff[i].added) {
                  resultStringArray.push(
                      '<span class="code_highlight_new">' + escapedCode + '</span>');
                } else {
                  resultStringArray.push(escapedCode);
                }
              }
            }
            document.getElementById('content_arduino').innerHTML =
                prettyPrintOne(resultStringArray.join(''), 'cpp', false);
                DwenguinoBlockly.previouslyRenderedCode = code;
         }

    },

    setDifficultyLevel: function(level){
        DwenguinoBlockly.difficultyLevel = level;
        $("#toolbox").load("./DwenguinoIDE/levels/lvl" + level + ".xml", function(){
            DwenguinoBlockly.doTranslation();
            DwenguinoBlockly.workspace.updateToolbox(document.getElementById("toolbox"));
        });
    },

    /*
      The following functions load the contents of a block xml file into the workspace.
    */
    loadBlocksFile: function(filename){
      DwenguinoBlockly.loadBlocksFileContent(filename);
    },

    loadFileXmlIntoWorkspace: function(xml_content){
      console.log("loading into workspace");
      DwenguinoBlockly.setWorkspaceBlockFromXml(xml_content);
    },

    loadBlocksFileContent: function(filename){
      $.ajax({
        url: filename,
        success: function (data){
          var serializedToString = (new XMLSerializer()).serializeToString(data);
          DwenguinoBlockly.loadFileXmlIntoWorkspace(serializedToString);
        }
      });
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
        DwenguinoBlockly.workspace = Blockly.inject(blocklyDiv,
            {
                toolbox: document.getElementById('toolbox'),
                media: "DwenguinoIDE/img/",
                zoom: {controls: true, wheel: true},
                undo : true
            });
        window.addEventListener('resize', DwenguinoBlockly.onresize, false);
        DwenguinoBlockly.onresize();
        Blockly.svgResize(DwenguinoBlockly.workspace);
        DwenguinoBlockly.workspace.addChangeListener(DwenguinoBlockly.renderCode);

        // Init the callback for the dynamic creation of the toolbox
        /**
         * Construct the blocks required by the flyout for the colours category.
         * @param {!Blockly.Workspace} workspace The workspace this flyout is for.
         * @return {!Array.<!Element>} Array of XML block elements.
         */
        var variablesFlyoutCallback = function(workspace) {
          var variables = DwenguinoBlockly.workspace.getAllVariables();
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

        DwenguinoBlockly.workspace.registerButtonCallback(
          "createVariableCallback", createVariableCallback
        );

        DwenguinoBlockly.workspace.registerToolboxCategoryCallback(
          "DWB_VARIABLES", variablesFlyoutCallback
        );
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
        document.title += ' ' + MSG['title'];

        document.getElementById('db_menu_item_upload').title = MSG['loadBlocksFileTooltip'];
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
        DwenguinoBlockly.injectBlockly();
        DwenguinoBlockly.loadBlocks('<xml id="startBlocks" style="display: none">' + document.getElementById('startBlocks').innerHTML + '</xml>');
        DwenguinoBlockly.initDwenguinoBlockly();
        DwenguinoBlockly.doTranslation();
        DwenguinoBlockly.setDifficultyLevel(0);
        DwenguinoBlockly.takeSnapshotOfWorkspace();
        $(window).resize(function(){
            DwenguinoBlockly.onresize();
            Blockly.svgResize(DwenguinoBlockly.workspace);
        });
    },
    tearDownEnvironment: function(){
      // Called from the aruino IDE on close. For now do nothing.
    },
};


$(document).ready(function() {
  DwenguinoBlockly.setupEnvironment();
});
