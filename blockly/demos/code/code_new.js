/* global Blockly, hopscotch, tutorials, JsDiff, DwenguinoBlocklyLanguageSettings, MSG, BlocklyStorage, debugjs */

if (!window.dwenguinoBlocklyServer) {
  dwenguinoBlocklyServer = false;
}

var DwenguinoBlockly = {
    simButtonStateClicked: false,

    workspace: null,
    recording: "",
    sessionId: null,
    tutorialId: null,
    
    serverUrl: 'http://localhost:3000',
    serverUrl: '',

    //General settings for this session, these are used for data logging during experiments
    agegroupSetting: "",
    genderSetting: "",  //TODO: add this to the modal dialog
    activityIdSetting: "",
    tutorialIdSetting: "",

    initDwenguinoBlockly: function(){
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
            DwenguinoBlockly.agegroupSetting = $("input[name=optradio]:checked").val();
            DwenguinoBlockly.activityIdSetting = $("#activity_identifier").val();
            var activity_date = $("#activity_date").val();
            console.log("[act;" + (DwenguinoBlockly.agegroupSetting || "")
                + ";" + (DwenguinoBlockly.activityIdSetting || "")
                + ";" + (activity_date || "") + "]");
        });


        DwenguinoBlockly.sessionId = window.sessionStorage.loadOnceSessionId;
        delete window.sessionStorage.loadOnceSessionId;
        if (!DwenguinoBlockly.sessionId && dwenguinoBlocklyServer){
            // Try to get a new sessionId from the server to keep track
            $.ajax({
                type: "GET",
                url: this.serverUrl + "/sessions/newId"}
            ).done(function(data){
                console.debug('sessionId is set to', data);
                DwenguinoBlockly.sessionId = data;
            }).fail(function(response, status)  {
                console.warn('Failed to fetch sessionId:', status);
            });
        }

        DwenguinoBlockly.recording = window.sessionStorage.loadOnceRecording || "<startApplication/>";
        delete window.sessionStorage.loadOnceRecording;
        //appendToRecording("<startApplication/>");
        //init slider control
        $( "#db_menu_item_difficulty_slider" ).slider({
            value:0,
            min: 0,
            max: 4,
            step: 1,
            slide: function( event, ui ) {
                DwenguinoBlockly.setDifficultyLevel(ui.value);
                DwenguinoBlockly.appendToRecording("<setDifficultyLevel_" + ui.value + "/>");
            }
        });
        $( "#db_menu_item_difficulty_slider_input" ).val( "$" + $( "#db_menu_item_difficulty_slider" ).slider( "value" ) );

        //init resizable panels
        $( "#db_blockly" ).resizable({
            handles: "e",
            resize: function(event, ui){
                DwenguinoBlockly.onresize();
                Blockly.svgResize(DwenguinoBlockly.workspace);
            }
        });

        //show/hide simulator
        $("#db_menu_item_simulator").click(function(){
            if (this.simButtonStateClicked){
                $("#db_blockly").width('100%');
                this.simButtonStateClicked = false;
                DwenguinoBlockly.appendToRecording("<stopSimulator/>");
            }else{
                $("#db_blockly").width('50%');
                this.simButtonStateClicked = true;
                DwenguinoBlockly.appendToRecording("<startSimulator/>");
            }
            DwenguinoBlockly.onresize();
            Blockly.svgResize(DwenguinoBlockly.workspace);
        });

        //save/upload buttons
        $("#db_menu_item_run").click(function(){
            if (dwenguinoBlocklyServer){
                var code = Blockly.Arduino.workspaceToCode(DwenguinoBlockly.workspace);
                dwenguinoBlocklyServer.uploadCode(code);
            }
        });

        $("#db_menu_item_upload").click(function(){
            try {
                var xml = Blockly.Xml.textToDom(dwenguinoBlocklyServer ? dwenguinoBlocklyServer.loadBlocks() : localStorage.workspaceXml);
                DwenguinoBlockly.workspace.clear();
                console.log(xml);
                Blockly.Xml.domToWorkspace(xml, DwenguinoBlockly.workspace);
            } catch (e) {}           
        });

        $("#db_menu_item_download").click(function(){
            var xml = Blockly.Xml.workspaceToDom(DwenguinoBlockly.workspace);
            var data = Blockly.Xml.domToText(xml);
            if (dwenguinoBlocklyServer){
                dwenguinoBlocklyServer.saveBlocks(data);
            } else {
                console.log(data);
                localStorage.workspaceXml = data;
            }
        });

        //dropdown menu code
         $(".dropdown-toggle").dropdown();

         //dropdown link behaviors
         $("#tutsIntroduction").click(function(){
             DwenguinoBlockly.tutorialId = "Introduction";
             DwenguinoBlockly.tutorialIdSetting = DwenguinoBlockly.tutorialId;
             hopscotch.startTour(tutorials.introduction);
             DwenguinoBlockly.appendToRecording('<startIntroductionTutorial time="' + $.now() + '"/>');
         });

         $("#tutsBasicTest").click(function(){
             DwenguinoBlockly.tutorialId = "BasicTest";
             DwenguinoBlockly.tutorialIdSetting = DwenguinoBlockly.tutorialId ;
             hopscotch.startTour(tutorials.basic_test);
             DwenguinoBlockly.appendToRecording('<startBasicTestTutorial time="' + $.now() + '"/>');
         });

         $("#tutsTheremin").click(function(){
             DwenguinoBlockly.tutorialId  = "Theremin";
             DwenguinoBlockly.tutorialIdSetting = DwenguinoBlockly.tutorialId ;
             hopscotch.startTour(tutorials.theremin);
             DwenguinoBlockly.appendToRecording('<startTheremin time="' + $.now() + '"/>');
         });

         //following event listener is only a test --> remove later!
         $("#db_menu_item_dwengo_robot_teacher_image").click(function(){
            DwenguinoBlockly.takeSnapshotOfWorkspace();
         });
         
         $("#language1").click(function(){
            DwenguinoBlockly.language = "cpp";
            DwenguinoBlockly.renderCode();
         });
         
         $("#language2").click(function(){
            DwenguinoBlockly.language = "js";
            DwenguinoBlockly.renderCode();
         });
    },

    endTutorial: function(){
        DwenguinoBlockly.appendToRecording('<endTutorial time="' + $.now() + '"/>');
        DwenguinoBlockly.submitRecordingToServer();
    },

    appendToRecording: function(text){
            DwenguinoBlockly.recording = DwenguinoBlockly.recording + "\n" + text;
    },


    submitRecordingToServer: function(){
        if (!dwenguinoBlocklyServer) {
            return;
        }
        //online code submission
        $.ajax({
            type: "POST",
            url: this.serverUrl + "/sessions/update",
            data: { _id: DwenguinoBlockly.sessionId, agegroup: DwenguinoBlockly.agegroupSetting, gender: DwenguinoBlockly.genderSetting, activityId: DwenguinoBlockly.activityIdSetting, timestamp: $.now(), tutorialId: DwenguinoBlockly.tutorialIdSetting , logData: DwenguinoBlockly.recording }

        }
        ).done(function(data){
            console.debug('Recording submitted', data);
        }).fail(function(response, status)  {
            console.warn('Failed to submit recording:', status);
        });
        // local file submission (Dwenguinoblockly saves the log to a local file in the user home dir)
        if (dwenguinoBlocklyServer){
            dwenguinoBlocklyServer.saveToLog(
                JSON.stringify({ _id: DwenguinoBlockly.sessionId, agegroup: DwenguinoBlockly.agegroupSetting, gender: DwenguinoBlockly.genderSetting, activityId: DwenguinoBlockly.activityIdSetting, timestamp: $.now(), tutorialId: DwenguinoBlockly.tutorialIdSetting , logData: DwenguinoBlockly.recording })
            );
        }
    },

    prevWorkspaceXml: "",
    /**
    *   Take a snapshot of the current blocks in the workspace.
    */
    takeSnapshotOfWorkspace: function(){
        var xml = Blockly.Xml.workspaceToDom(DwenguinoBlockly.workspace);
        var text = Blockly.Xml.domToText(xml);
        if (text !== DwenguinoBlockly.prevWorkspaceXml){
            text = "<changedWorkspace timestamp='" + $.now() + "' activeTutorial='" + DwenguinoBlockly.tutorialIdSetting + "'>" + text + "</changedWorkspace>";
            DwenguinoBlockly.appendToRecording(text);
            DwenguinoBlockly.prevWorkspaceXml = text;
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
    language: "js",
    /**
     * Populate the currently selected pane with content generated from the blocks.
     */
    renderCode: function() {
        var arduino_content = document.getElementById("content_arduino");
        //var xml_content = document.getElementById("content_xml");

        // transform code
        if (DwenguinoBlockly.language === "cpp") {
            var code = Blockly.Arduino.workspaceToCode(DwenguinoBlockly.workspace);
        }
        else if (DwenguinoBlockly.language === "js") {
            var code = Blockly.JavaScript.workspaceToCode(DwenguinoBlockly.workspace);
        }

        // display code
        if (DwenguinoBlockly.previouslyRenderedCode === null){
            document.getElementById('content_arduino').innerHTML =
                prettyPrintOne(code.replace(/</g, "&lt;").replace(/>/g, "&gt;"), 'cpp', false);
                DwenguinoBlockly.previouslyRenderedCode = code;
        }
        else if (code !== DwenguinoBlockly.previouslyRenderedCode) {
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
        $("#toolbox").load("levels/lvl" + level + ".xml", function(){
            DwenguinoBlockly.doTranslation();
            DwenguinoBlockly.workspace.updateToolbox(document.getElementById("toolbox"));
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
                media: "./img/",
                zoom: {controls: true, wheel: true}
            });
        window.addEventListener('resize', DwenguinoBlockly.onresize, false);
        DwenguinoBlockly.onresize();
        Blockly.svgResize(DwenguinoBlockly.workspace);
        DwenguinoBlockly.workspace.addChangeListener(DwenguinoBlockly.renderCode);
        DwenguinoBlockly.workspace.addChangeListener(DwenguinoBlockly.logCodeChange);
        //load setup loop block to workspace
        //Blockly.Xml.domToWorkspace(document.getElementById('startBlocks'), workspace);
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
            window;sessionStorage.loadOnceSessionId = DwenguinoBlockly.sessionId;
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
        //document.getElementById('title').textContent = MSG['title'];
        //document.getElementById('tab_blocks').textContent = MSG['blocks'];

        //document.getElementById('linkButton').title = MSG['linkTooltip'];
        document.getElementById('db_menu_item_run').title = MSG['runTooltip'];
        document.getElementById('db_menu_item_upload').title = MSG['loadBlocksFileTooltip'];
        document.getElementById('db_menu_item_download').title = MSG['saveBlocksFileTooltip'];
        document.getElementById('db_menu_item_simulator').title = MSG['toggleSimulator'];
        //document.getElementById('trashButton').title = MSG['trashTooltip'];

        var tutorials = ['tutsIntroduction', 'tutsTheremin', 'tutsRobot', 'tutsBasicTest'];
        for (var i = 0; i < tutorials.length ; i++){
            var element = document.getElementById(tutorials[i]);
            if (element){
                element.innerHTML = MSG[tutorials[i]];
            }
        }

        var categories = ['catLogic', 'catLoops', 'catMath', 'catText', 'catLists',
            'catColour', 'catVariables', 'catFunctions', 'catBoardIO', 'catDwenguino', 'catArduino'];
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
        //DwenguinoBlockly.doTranslation();   TODO: remove line!
        DwenguinoBlockly.injectBlockly();
        DwenguinoBlockly.loadBlocks('<xml id="startBlocks" style="display: none">' + document.getElementById('startBlocks').innerHTML + '</xml>');
        DwenguinoBlockly.initDwenguinoBlockly();
        DwenguinoBlockly.doTranslation();
        DwenguinoBlockly.setDifficultyLevel(0);
        setInterval(function(){ DwenguinoBlockly.submitRecordingToServer(); }, 10000);
        $(window).resize(function(){
            DwenguinoBlockly.onresize();
            Blockly.svgResize(DwenguinoBlockly.workspace);
        });
    }
};

var DwenguinoSimulation = {
  board: {
    lcdContent: new Array(2),
    buzzer: {
      osc: null,
      audiocontext: null,
      tonePlaying: 0
    },
    servoAngles: [0, 0],
    motorSpeeds: [0, 0],
    leds: [0,0,0,0,0,0,0,0,0],
    buttons: [1,1,1,1,1],
    sonarDistance: 50
  },
  
  isSimulationRunning: false,
  isSimulationPaused: false,
  speedDelay: 500,
  debuggingView: false,
  scenarioView: "default",
  
  debugger: {
    debuggerjs: null,
    code: "",
    blocks: {
      lastBlocks: [null, null],
      lastColours: [-1, -1],
      blockMapping: {}
    }
  },
  
  field: {
    width: 200,
    height: 200,
    wallOffset: 25
  },
  robot: {
    image: {
      width: 50,
      height: 40
    },
    start: {
      x: 100,
      y: 100,
      angle: 0
    },
    position: {
      x: 100,
      y: 100,
      angle: 0
    },
    collision: [{
      type: 'circle',
      radius: 25
    }]
  },
  
  /*
   * Initializes the environment when loading page
   */
  setupEnvironment: function() {
    DwenguinoSimulation.initDwenguinoSimulation();
  },

  /*
   * inits the right actions to handle the simulation view
   */
  initDwenguinoSimulation: function() {
    // translation
    document.getElementById('sim_start').textContent = MSG.simulator['start'];
    document.getElementById('sim_stop').textContent = MSG.simulator['stop'];
    document.getElementById('sim_pause').textContent = MSG.simulator['pause'];
    document.getElementById('sim_step').textContent = MSG.simulator['step'];
    document.getElementById('sim_speedTag').textContent = MSG.simulator['speed'] + ":";

    document.getElementById('sim_speed_verySlow').textContent = MSG.simulator['speedVerySlow'];
    document.getElementById('sim_speed_slow').textContent = MSG.simulator['speedSlow'];
    document.getElementById('sim_speed_medium').textContent = MSG.simulator['speedMedium'];
    document.getElementById('sim_speed_fast').textContent = MSG.simulator['speedFast'];
    document.getElementById('sim_speed_veryFast').textContent = MSG.simulator['speedVeryFast'];
    document.getElementById('sim_speed_realTime').textContent = MSG.simulator['speedRealTime'];

    document.getElementById('sim_scenarioTag').textContent = MSG.simulator['scenario'] + ":";
    document.getElementById('sim_scenario_default').textContent = MSG.simulator['scenario_default'];
    document.getElementById('sim_scenario_moving').textContent = MSG.simulator['scenario_moving'];
    document.getElementById('sim_scenario_wall').textContent = MSG.simulator['scenario_wall'];

    document.getElementById('sim_components_select').textContent = MSG.simulator['components'] + ":";
    document.getElementById('servo1').textContent = MSG.simulator['servo'] + " 1";
    document.getElementById('servo2').textContent = MSG.simulator['servo'] + " 2";
    document.getElementById('motor1').textContent = MSG.simulator['motor'] + " 1";
    document.getElementById('motor2').textContent = MSG.simulator['motor'] + " 2";
    document.getElementById('sim_scope_name').textContent = MSG.simulator['scope'] + ":";
    document.getElementById('sim_sonar_distance').textContent = "Sonar " + MSG.simulator['distance'] + ":";
    document.getElementById('sonar_input').value = DwenguinoSimulation.board.sonarDistance;



    // start/stop/pause
    $("#sim_start").click(function() {
      DwenguinoSimulation.setButtonsStart();
      // start
      if (!DwenguinoSimulation.isSimulationRunning && !DwenguinoSimulation.isSimulationPaused) {
        DwenguinoSimulation.isSimulationRunning = true;
        DwenguinoSimulation.startSimulation();
      // resume
      } else if (!DwenguinoSimulation.isSimulationRunning) {
        DwenguinoSimulation.isSimulationPaused = false;
        DwenguinoSimulation.isSimulationRunning = true;
        DwenguinoSimulation.resumeSimulation();
      }
    });

    $("#sim_pause").click(function() {
      DwenguinoSimulation.isSimulationRunning = false;
      DwenguinoSimulation.isSimulationPaused = true;
      DwenguinoSimulation.setButtonsPause();
    });

    $("#sim_stop").click(function() {
      DwenguinoSimulation.isSimulationRunning = false;
      DwenguinoSimulation.isSimulationPaused = false;
      DwenguinoSimulation.setButtonsStop();
      DwenguinoSimulation.stopSimulation();
    });

    $("#sim_step").click(function() {
      DwenguinoSimulation.setButtonsStep();
      // step 1
      if (!DwenguinoSimulation.isSimulationPaused && !DwenguinoSimulation.isSimulationRunning) {
        DwenguinoSimulation.startStepSimulation();
        DwenguinoSimulation.isSimulationPaused = true;
      // step n
      } else if (!DwenguinoSimulation.isSimulationRunning) {
        DwenguinoSimulation.isSimulationPaused = false;
        DwenguinoSimulation.oneStep();
        DwenguinoSimulation.isSimulationPaused = true;
      }
    });

    // jquery to create select list with checkboxes that hide
    $("#sim_components_select").on('click', function() {
      if (!$("#sim_components_options").is(":visible")) {
        $("#sim_components_options").show();
      } else {
        $("#sim_components_options").hide();
      }
    });

    // enable show hide for dwenguino components
    $("#sim_servo1").hide();
    $("#servo1").on('change', function() {
      if (document.getElementById("servo1").checked) {
        $("#sim_servo1").show();
      } else {
        $("#sim_servo1").hide();
      }
    });

    $("#sim_servo2").hide();
    $("#servo2").on('change', function() {
      if (document.getElementById("servo2").checked) {
        $("#sim_servo2").show();
      } else {
        $("#sim_servo2").hide();
      }
    });

    $("#sim_motor1").hide();
    $("#motor1").on('change', function() {
      if (document.getElementById("motor1").checked) {
        $("#sim_motor1").show();
      } else {
        $("#sim_motor1").hide();
      }
    });

    $("#sim_motor2").hide();
    $("#motor2").on('change', function() {
      if (document.getElementById("motor2").checked) {
        $("#sim_motor2").show();
      } else {
        $("#sim_motor2").hide();
      }
    });

    $("#sim_sonar").hide();
    $("#sim_sonar_distance").hide();
    $("#sim_sonar_input").hide();
    $("#sonar").on('change', function() {
      if (document.getElementById("sonar").checked) {
        $("#sim_sonar").show();
        $("#sim_sonar_distance").show();
        $("#sim_sonar_input").show();
      } else {
        $("#sim_sonar").hide();
        $("#sim_sonar_distance").hide();
        $("#sim_sonar_input").hide();
      }
    });

    // push buttons
    $("#sim_button_N, #sim_button_E, #sim_button_C, #sim_button_S, #sim_button_W").on('click', function() {
      if (document.getElementById(this.id).className === "sim_button") {
        document.getElementById(this.id).className = "sim_button sim_button_pushed";
        // update state of buttons
        switch(this.id) {
          case "#sim_button_N":
            DwenguinoSimulation.board.buttons[0] = 0;
            break;
          case "#sim_button_W":
            DwenguinoSimulation.board.buttons[1] = 0;
            break;
          case "#sim_button_C":
            DwenguinoSimulation.board.buttons[2] = 0;
            break;
          case "#sim_button_E":
            DwenguinoSimulation.board.buttons[3] = 0;
            break;
          case "#sim_button_S":
            DwenguinoSimulation.board.buttons[4] = 0;
        }
      } else {
        document.getElementById(this.id).className = "sim_button";
        // update state of buttons
        switch(this.id) {
          case "#sim_button_N":
            DwenguinoSimulation.board.buttons[0] = 1;
            break;
          case "#sim_button_W":
            DwenguinoSimulation.board.buttons[1] = 1;
            break;
          case "#sim_button_C":
            DwenguinoSimulation.board.buttons[2] = 1;
            break;
          case "#sim_button_E":
            DwenguinoSimulation.board.buttons[3] = 1;
            break;
          case "#sim_button_S":
            DwenguinoSimulation.board.buttons[4] = 1;
        }
      }
    });

    // change speed of simulation
    $("#sim_speed").on('change', function() {
      DwenguinoSimulation.setSpeed();
    });

    // change scenario view
    $("#sim_scenario").on('change', function() {
      var e = document.getElementById("sim_scenario");
      DwenguinoSimulation.scenarioView = e.options[e.selectedIndex].value;
      DwenguinoSimulation.changeScenarioView();
    });
    
    DwenguinoSimulation.renderScenario();
  },

  /*
   * Starts the simulation for the current code
   */
  startSimulation: function() {
    DwenguinoSimulation.startDebuggingView();
    DwenguinoSimulation.initDebugger();
    // run debugger
    DwenguinoSimulation.step();
  },
  
  /*
   * Starts the simulation for the current code with 1 step
   */
  startStepSimulation: function() {
    DwenguinoSimulation.startDebuggingView();
    DwenguinoSimulation.initDebugger();
    // run debugger
    DwenguinoSimulation.oneStep();
  },

  /*
   * Stops the simulation and resets the view
   */
  stopSimulation: function() {
    DwenguinoSimulation.stopDebuggingView();
    DwenguinoSimulation.resetDwenguino();
  },

  /*
   * resumes a simulation that was paused
   */
  resumeSimulation: function() {
    // restart driving robot
    if (DwenguinoSimulation.scenarioView === "moving") {
      DwenguinoSimulation.adjustMovingRobot(DwenguinoSimulation.board.motorSpeeds[0], DwenguinoSimulation.board.motorSpeeds[1], false);
    } else if (DwenguinoSimulation.scenarioView === "wall") {
      DwenguinoSimulation.adjustMovingRobot(DwenguinoSimulation.board.motorSpeeds[0], DwenguinoSimulation.board.motorSpeeds[1], true);
    }
    
    DwenguinoSimulation.step();
  },
  
  /*
   * initialize the debugging environment
   */
  initDebugger: function() {
    // initialize simulation
    DwenguinoSimulation.initDwenguino();

    // get code
    DwenguinoSimulation.debugger.code = document.getElementById('content_arduino').textContent;
    DwenguinoSimulation.mapBlocksToCode();

    // create debugger
    DwenguinoSimulation.debugger.debuggerjs = debugjs.createDebugger({
      iframeParentElement: document.getElementById('debug'),
      // declare context that should be available in debugger
      sandbox: {
        DwenguinoSimulation: DwenguinoSimulation
      }
    });

    DwenguinoSimulation.debugger.debuggerjs.machine.on('error', function(err) {
      console.error(err.message);
    });

    var filename = 'simulation';
    DwenguinoSimulation.debugger.debuggerjs.load(DwenguinoSimulation.debugger.code, filename);

    var min = Math.min.apply(null, Object.keys(DwenguinoSimulation.debugger.blocks.blockMapping));
    var line = 0;
    while (line <= min) {
      DwenguinoSimulation.oneStep();
      line = DwenguinoSimulation.debugger.debuggerjs.machine.getCurrentLoc().start.line;
    }
  },

  /*
   * While the simulation is running, this function keeps being called with "speeddelay" timeouts in between
   */
  step: function() {
    if (!DwenguinoSimulation.isSimulationRunning) {
      return;
    }

    var line = DwenguinoSimulation.debugger.debuggerjs.machine.getCurrentLoc().start.line - 1;
    DwenguinoSimulation.debugger.debuggerjs.machine.step();

    // highlight the current block
    DwenguinoSimulation.updateBlocklyColour();
    DwenguinoSimulation.handleScope();

    // check if current line is not a sleep
    var code = DwenguinoSimulation.debugger.code.split("\n")[line] === undefined ? '' : DwenguinoSimulation.debugger.code.split("\n")[line];

    if (!code.trim().startsWith("DwenguinoSimulation.sleep")) {
      setTimeout(DwenguinoSimulation.step, DwenguinoSimulation.speedDelay);
    } else {
      // sleep
      setTimeout(DwenguinoSimulation.step,
        DwenguinoSimulation.speedDelay + (Number(DwenguinoSimulation.debugger.code.split("\n")[line].replace(/\D+/g, '')))*DwenguinoSimulation.speedDelay/20);
    }
    DwenguinoSimulation.checkForEnd();
  },

  /*
   * Lets the simulator run one step
   */
  oneStep: function() {
    // let driving robot update 1 frame
    if (DwenguinoSimulation.scenarioView === "moving") {
      DwenguinoSimulation.adjustMovingRobot(DwenguinoSimulation.board.motorSpeeds[0], DwenguinoSimulation.board.motorSpeeds[1], false);
    } else if (DwenguinoSimulation.scenarioView === "wall") {
      DwenguinoSimulation.adjustMovingRobot(DwenguinoSimulation.board.motorSpeeds[0], DwenguinoSimulation.board.motorSpeeds[1], true);
    }
    
    DwenguinoSimulation.debugger.debuggerjs.machine.step();
    DwenguinoSimulation.updateBlocklyColour();
    DwenguinoSimulation.handleScope();
    DwenguinoSimulation.checkForEnd();
  },

  /*
   * Displays the values of the variables during the simulation
   */
  handleScope: function() {
    var scope = DwenguinoSimulation.debugger.debuggerjs.machine.getCurrentStackFrame().scope;
    document.getElementById('sim_scope').innerHTML = "";
    for (var i in scope) {
      var item = scope[i];
      var value = DwenguinoSimulation.debugger.debuggerjs.machine.$runner.gen.stackFrame.evalInScope(item.name);
      document.getElementById('sim_scope').innerHTML = document.getElementById('sim_scope').innerHTML + item.name + " = " + value + "<br>";
    }
  },

  /*
   * Checks if the simulation has been interrupted
   */
  checkForEnd: function() {
    if ((DwenguinoSimulation.isSimulationRunning || DwenguinoSimulation.isSimulationPaused) &&
      DwenguinoSimulation.debugger.debuggerjs.machine.halted) {
      DwenguinoSimulation.isSimulationRunning = false;
      DwenguinoSimulation.isSimulationPaused = false;
      //DwenguinoSimulation.setButtonsStep();
    }
  },

  /*
   * maps line numbers to blocks
   */
  mapBlocksToCode: function() {
    var setup_block = DwenguinoBlockly.workspace.getAllBlocks()[0];

    var line = 0;
    var lines = DwenguinoSimulation.debugger.code.split("\n");
    var loopBlocks = [];

    // update variables in while loop when searching for a match between block and line
    function updateBlocks() {
      // special structure for loop blocks -> look at children
      if (lines[line].trim() === Blockly.JavaScript.blockToCode(block).split('\n')[0] &&
        (lines[line].trim().startsWith("for") || lines[line].trim().startsWith("while") ||
          lines[line].trim().startsWith("if"))) {
        loopBlocks.push(block);
        DwenguinoSimulation.debugger.blocks.blockMapping[line] = block;
        block = block.getInputTargetBlock('DO') || block.getInputTargetBlock('DO0');
      } else if (lines[line].trim() === Blockly.JavaScript.blockToCode(block).split('\n')[0]) {
        DwenguinoSimulation.debugger.blocks.blockMapping[line] = block;
        block = block.getNextBlock();
      }
      // end of loop structure
      if (block === null && loopBlocks.length > 0) {
        var parentBlock = loopBlocks.pop();
        block = parentBlock.getNextBlock();
        line++;
      }
      line++;
    };

    // look at blocks before while
    var block = setup_block.getInputTargetBlock('SETUP');
    while (block !== null && line < lines.length) {
      updateBlocks();
    }

    while (loopBlocks.length > 0) {
      loopBlocks.pop();
      line++;
    }

    // look at while
    while (line < lines.length && lines[line] !== "while (true) {") {
      line++;
    }
    if (line < lines.length) {
      DwenguinoSimulation.debugger.blocks.blockMapping[line] = setup_block;
      line++;
    }

    // look at blocks after while
    block = setup_block.getInputTargetBlock('LOOP');
    while (block !== null && line < lines.length) {
      updateBlocks();
    }
  },

  /*
   * Changes the color of the blocks at each iteration of the simulator
   * The block that was previously executed is highlighted (=blue)
   */
  updateBlocklyColour: function() {
    var highlight_colour = 210;

    var line = DwenguinoSimulation.debugger.debuggerjs.machine.getCurrentLoc().start.line - 1;
    if (DwenguinoSimulation.debugger.code !== "" && typeof DwenguinoSimulation.debugger.blocks.blockMapping[line] !== 'undefined') {
      // reset old block
      if (DwenguinoSimulation.debugger.blocks.lastBlocks[0] !== null) {
        DwenguinoSimulation.debugger.blocks.lastBlocks[0].setColour(DwenguinoSimulation.debugger.blocks.lastColours[0]);
      }

      DwenguinoSimulation.debugger.blocks.lastBlocks[0] = DwenguinoSimulation.debugger.blocks.lastBlocks[1];
      DwenguinoSimulation.debugger.blocks.lastColours[0] = DwenguinoSimulation.debugger.blocks.lastColours[1];

      // highlight current block
      DwenguinoSimulation.debugger.blocks.lastBlocks[1] = DwenguinoSimulation.debugger.blocks.blockMapping[line];
      DwenguinoSimulation.debugger.blocks.lastColours[1] = DwenguinoSimulation.debugger.blocks.blockMapping[line].getColour();

      if (DwenguinoSimulation.debugger.blocks.lastBlocks[0] !== null) {
        DwenguinoSimulation.debugger.blocks.lastBlocks[0].setColour(highlight_colour);
      }
    }
  },

  /*
   * updates the speed of the simulation
   */
  setSpeed: function() {
    var e = document.getElementById("sim_speed");
    var option = e.options[e.selectedIndex].value;

    switch (option) {
      case "veryslow":
        DwenguinoSimulation.speedDelay = 800;
        break;
      case "slow":
        DwenguinoSimulation.speedDelay = 400;
        break;
      case "medium":
        DwenguinoSimulation.speedDelay = 200;
        break;
      case "fast":
        DwenguinoSimulation.speedDelay = 100;
        break;
      case "veryfast":
        DwenguinoSimulation.speedDelay = 60;
        break;
      case "realtime":
        DwenguinoSimulation.speedDelay = 20;
    }
  },

  /*
   * Makes the simulation ready (draw the board)
   */
  initDwenguino: function() {
    DwenguinoSimulation.resetDwenguino();
  },

  /*
   * Resets the dwenguino (drawing) to its initial state (remove text, no sound etc)
   */
  resetDwenguino: function() {
    // delete debugger
    DwenguinoSimulation.debugger.debuggerjs = null;
    DwenguinoSimulation.debugger.code = "";
    DwenguinoSimulation.debugger.blocks.blockMapping = {};

    // reset colours
    if (DwenguinoSimulation.debugger.blocks.lastColours[0] !== -1) {
      DwenguinoSimulation.debugger.blocks.lastBlocks[0].setColour(DwenguinoSimulation.debugger.blocks.lastColours[0]);
    }
    DwenguinoSimulation.debugger.blocks.lastColours = [-1, -1];
    DwenguinoSimulation.debugger.blocks.lastBlocks = [null, null];

    // stop sound
    if (DwenguinoSimulation.board.buzzer.tonePlaying !== 0) {
      DwenguinoSimulation.noTone("BUZZER");
    }
    // clearn lcd
    DwenguinoSimulation.clearLcd();
    // turn all lights out
    DwenguinoSimulation.board.leds = [0,0,0,0,0,0,0,0,0];
    for (var i = 0; i < 8; i++) {
      document.getElementById('sim_light_' + i).className = "sim_light sim_light_off";
    }
    document.getElementById('sim_light_13').className = "sim_light sim_light_off";

    // reset servo
    DwenguinoSimulation.board.servoAngles = [0, 0];
    $("#sim_servo1_mov, #sim_servo2_mov").css("transform", "rotate(0deg)");

    // reset motors
    DwenguinoSimulation.board.motorSpeeds = [0, 0];
    $("#sim_motor1, #sim_motor2").css("transform", "rotate(0deg)");

    //reset buttons
    DwenguinoSimulation.board.buttons = [1,1,1,1,1];
    $("#sim_button_N, #sim_button_E, #sim_button_C, #sim_button_S, #sim_button_W").removeClass().addClass('sim_button');

    // clear scope
    document.getElementById('sim_scope').innerHTML = "";

    // reset moving car
    Object.assign(DwenguinoSimulation.robot.position, DwenguinoSimulation.robot.start);
    DwenguinoSimulation.renderScenario();
  },

  /*
   * function called by the delay block to delay the simulation
   *  @param {int} delay: time in ms the simaultion should be paused
   */
  sleep: function(delay) {
    // sleep is regulated inside step funtion
  },

  /*
   * Makes the lcd display empty
   *
   */
  clearLcd: function() {
    // clear lcd by writing spaces to it
    for (var i = 0; i < 2; i++) {
      DwenguinoSimulation.board.lcdContent[i] = " ".repeat(16);
      DwenguinoSimulation.writeLcd(" ".repeat(16), i, 1);
    }
  },
  
  /*
   * Writes text to the lcd on the given row starting fro position column
   * @param {string} text: text to write
   * @param {int} row: 0 or 1 addresses the row
   * @param {int} column: 0-15: the start position on the given row
   */
  writeLcd: function(text, row, column) {
    // replace text in current content (if text is hello and then a is written this gives aello)
    text = DwenguinoSimulation.board.lcdContent[row].substr(0, column) +
      text.substring(0, 16 - column) +
      DwenguinoSimulation.board.lcdContent[row].substr(text.length + column, 16);
    DwenguinoSimulation.board.lcdContent[row] = text;

    // write new text to lcd screen and replace spaces with &nbsp;
    $("#sim_lcd_row" + row).text(text);
    document.getElementById('sim_lcd_row' + row).innerHTML =
      document.getElementById('sim_lcd_row' + row).innerHTML.replace(/ /g, '&nbsp;');
    // repaint
    var element = document.getElementById("sim_lcds");
    element.style.display = 'none';
    element.offsetHeight;
    element.style.display = 'block';
  },

  /*
   * Write value 'HIGH' or 'LOW' to a pin, used to turn light on and off
   * @param {int} pinNumber: 13 or 32-39 adresses a light
   * @param {string} state: 'HIGH' to trun light on or 'LOW' to turn light off
   */
  digitalWrite: function(pinNumber, state) {
    // turns light on or off
    if ((pinNumber >= 32 && pinNumber <= 39) || pinNumber === 13) {
      if (pinNumber >= 32 && pinNumber <= 39) {
        pinNumber -= 32;
      }
      if (state === 'HIGH') {
        pinNumber === 13? DwenguinoSimulation.board.leds[8] = 1 : DwenguinoSimulation.board.leds[pinNumber] = 1;
        document.getElementById('sim_light_' + pinNumber).className = "sim_light sim_light_on";
      } else {
        pinNumber === 13? DwenguinoSimulation.board.leds[8] = 0 : DwenguinoSimulation.board.leds[pinNumber] = 0;
        document.getElementById('sim_light_' + pinNumber).className = "sim_light sim_light_off";
      }
    }
  },

  /*
   * Reads the value of the given pin, used to know the value of a button
   * @param {string} id of the button "SW_N","SW_W,SW_C","SW_E" or "SW_S"
   * @returns {int} 1 if not pressed, 0 if pressed
   */
  digitalRead: function(pin) {
    // read value from buttons
    if (pin.startsWith("SW_")) {
      return document.getElementById("sim_button_" + pin[3]).className === "sim_button" ? 1 : 0;
    }
  },

  /*
   * Turns the buzzer to a given frequancy
   * @param {string} id of the pin "BUZZER"
   * @param {int} frequency of the wanted sound
   */
  tone: function(pin, frequency) {
    if (pin !== "BUZZER") {
      return;
    }
    if (DwenguinoSimulation.board.buzzer.osc === null) {
      // initiate sound object
      try {
        DwenguinoSimulation.board.buzzer.audiocontext = new(window.AudioContext || window.webkitAudioContext)();
      } catch (e) {
        alert('Web Audio API is not supported in this browser');
      }
      //DwenguinoSimulation.board.sound.audiocontextBuzzer = new AudioContext();
    }
    if (DwenguinoSimulation.board.buzzer.tonePlaying !== 0 && DwenguinoSimulation.board.buzzer.tonePlaying !== frequency) {
      DwenguinoSimulation.board.buzzer.osc.stop();
    }
    if (DwenguinoSimulation.board.buzzer.tonePlaying !== frequency) {
      // a new oscilliator for each round
      DwenguinoSimulation.board.buzzer.osc = DwenguinoSimulation.board.buzzer.audiocontext.createOscillator(); // instantiate an oscillator
      DwenguinoSimulation.board.buzzer.osc.type = 'sine'; // this is the default - also square, sawtooth, triangle

      // start tone
      DwenguinoSimulation.board.buzzer.osc.frequency.value = frequency; // Hz
      DwenguinoSimulation.board.buzzer.osc.connect(DwenguinoSimulation.board.buzzer.audiocontext.destination); // connect it to the destination
      DwenguinoSimulation.board.buzzer.osc.start(); // start the oscillator

      DwenguinoSimulation.board.buzzer.tonePlaying = frequency;
    }
  },
  
  /*
   * Stops the buzzer
   * @param {string} id of the pin "BUZZER"
   */
  noTone: function(pin) {
    if (pin === "BUZZER") {
      // stop tone
      DwenguinoSimulation.board.buzzer.tonePlaying = 0;
      DwenguinoSimulation.board.buzzer.osc.stop();
    }
  },

  /*
   * Sets the servo to a given angle
   * @param {int} channel id of servo 1 or 2
   * @param {int} angle between 0 and 180
   */
  servo: function(channel, angle) {
    $("#sim_servo"+channel).show();
    document.getElementById("servo"+channel).checked = true;
    
    //set angle
    if (angle > 180) {
      angle = 180;
    }
    if (angle < 0) {
      angle = 0;
    }

    if (angle !== DwenguinoSimulation.board.servoAngles[channel - 1]) {
      DwenguinoSimulation.board.servoAngles[channel - 1] = angle;
      DwenguinoSimulation.servoRotate(channel, angle);
    }
  },

  /*
   * Renders the movement of the servo
   * @param {int} channel id of servo 1 or 2
   * @param {int} angle between 0 and 180
   */
  servoRotate: function(channel, angle) {
    var maxMovement = 10;
    if (angle !== DwenguinoSimulation.board.servoAngles[channel - 1]) {
      return;
    }
    var prevAngle = DwenguinoSimulation.getAngle($("#sim_servo" + channel + "_mov"));
    // set 10 degrees closer at a time to create rotate effect
    if (Math.abs(angle - prevAngle) > maxMovement) {
      var direction = ((angle - prevAngle) > 0) ? 1 : -1;
      $("#sim_servo" + channel + "_mov").css("transform", "rotate(" + (prevAngle + direction * maxMovement) + "deg)");
      setTimeout(function() {
        DwenguinoSimulation.servoRotate(channel, angle);
      }, 20);
    } else {
      $("#sim_servo" + channel + "_mov").css("transform", "rotate(" + angle + "deg)");
    }
  },

  /*
   * Help function to get the angle in degrees of a rotated html object
   * @param {obj} obj html object
   * @returns {int} degrees of rotation
   */
  getAngle: function(obj) {
    var matrix = obj.css("-webkit-transform") ||
      obj.css("-moz-transform") ||
      obj.css("-ms-transform") ||
      obj.css("-o-transform") ||
      obj.css("transform");
    if (matrix !== "none") {
      var values = matrix.split('(')[1];
      values = values.split(')')[0];
      values = values.split(',');
      var a = values[0];
      var b = values[1];
      return Math.round(Math.atan2(b, a) * (180 / Math.PI));
    }
    return 0;
  },

  /*
   * Turn a motor on at given speed
   * @param {int} channel id of motor 1 or 2
   * @param {int} speed between 0 and 255
   */
  startDcMotor: function(channel, speed) {
    $("#sim_motor"+channel).show();
    document.getElementById("motor"+channel).checked = true;
    
    //set angle
    if (speed > 255) {
      speed = 255;
    }
    if (speed < 0) {
      speed = 0;
    }

    // change view of motor
    if (speed === DwenguinoSimulation.board.motorSpeeds[channel - 1]) {
      return;
    }
    DwenguinoSimulation.board.motorSpeeds[channel - 1] = speed;
    DwenguinoSimulation.dcMotorRotate(channel, speed);

    // change view of driving robot
    var e = document.getElementById("sim_scenario");
    var option = e.options[e.selectedIndex].value;

    DwenguinoSimulation.field.width = $("#sim_container").width();
    DwenguinoSimulation.field.height = $("#sim_container").height();

    if (option === "moving") {
      DwenguinoSimulation.adjustMovingRobot(DwenguinoSimulation.board.motorSpeeds[0], DwenguinoSimulation.board.motorSpeeds[1], false);
    } else if (option === "wall") {
      DwenguinoSimulation.adjustMovingRobot(DwenguinoSimulation.board.motorSpeeds[0], DwenguinoSimulation.board.motorSpeeds[1], true);
    }
  },

  /*
   * Renders the rotation of the motor
   * @param {int} channel id of motor 1 or 2
   * @param {int} speed between 0 and 255
   */
  dcMotorRotate: function(channel, speed) {
    var maxMovement = speed / 20 + 5;
    if (speed !== DwenguinoSimulation.board.motorSpeeds[channel - 1] && speed !== 0) {
      return;
    }
    var prevAngle = DwenguinoSimulation.getAngle($("#sim_motor" + channel));
    // rotate x degrees at a time based on speed
    $("#sim_motor" + channel).css("transform", "rotate(" + ((prevAngle + maxMovement) % 360) + "deg)");
    setTimeout(function() {
      DwenguinoSimulation.dcMotorRotate(channel, speed);
    }, 20);
  },

  /*
   * Changes the position of the robot based on the speeds of the motors and the current position
   * int speed1: the speed of motor 1
   * int speed2: the speed of motor 2
   * boolean wall: true if the car is surrounded by a wall
   */
  adjustMovingRobot: function(speed1, speed2, wall) {
    if (!(speed1 === DwenguinoSimulation.board.motorSpeeds[0] && speed2 === DwenguinoSimulation.board.motorSpeeds[1] && (speed1 !== 0 || speed2 !== 0))
            || DwenguinoSimulation.isSimulationPaused) {
      return;
    }
    
    var x = DwenguinoSimulation.robot.position.x;
    var y = DwenguinoSimulation.robot.position.y;
    var angle = DwenguinoSimulation.robot.position.angle;
    var field = DwenguinoSimulation.field;

    // decide on angle (in deg) and distance (in px) based on 2 motor speeds
    var distance = (speed1 + speed2) / 100 + 0.5;

    if (speed1 !== speed2) {
      angle += (speed2 - speed1) / 30;
    }

    x += distance * Math.cos(Math.PI / 180 * angle);
    y += distance * Math.sin(Math.PI / 180 * angle);

    var offset = wall ? field.wallOffset : 25;

    // Stick to wall
    if (wall) {
      if (x > field.width - offset) x = field.width - offset;
      if (y > field.height - offset) y = field.height - offset;
      if (x < offset) x = offset;
      if (y < offset) y = offset;
    } else {
      // Teleport to other side
      if (x > field.width - offset) x = offset;
      if (y > field.height - offset) y = offset;
      if (x < offset) x = field.width - offset;
      if (y < offset) y = field.height - offset;
    }

    DwenguinoSimulation.robot.position = {
      x: x,
      y: y,
      angle: angle
    };

    DwenguinoSimulation.renderScenario();

    
    setTimeout(function() {
      DwenguinoSimulation.adjustMovingRobot(speed1, speed2, wall);
    }, DwenguinoSimulation.speedDelay);
  },

  /*
   * Returns the distance between the sonar and teh wall
   * @param {int} trigPin 11
   * @param {int} echoPin 12
   * @returns {int} distance in cm
   */
  sonar: function(trigPin, echoPin) {
    $("#sim_sonar").show();
    $("#sim_sonar_distance").show();
    $("#sim_sonar_input").show();
    document.getElementById("sonar").checked = true;
        
    // adjust sonar value based on wall
    var e = document.getElementById("sim_scenario");
    var option = e.options[e.selectedIndex].value;

    if (option === "wall") {
      // calculate distance between front of car and wall

      var xMiddle = DwenguinoSimulation.robot.position.x;
      var yMiddle = DwenguinoSimulation.robot.position.y;
      var angle = DwenguinoSimulation.robot.position.angle;
      
      var xFront = xMiddle + (DwenguinoSimulation.robot.image.width/2) * Math.cos(Math.PI / 180 * angle);
      var yFront = yMiddle + (DwenguinoSimulation.robot.image.width/2) * Math.sin(Math.PI / 180 * angle);
      
      // coordinates of line
      lineX = 0;
      lineY = 0;
      var angle = ((DwenguinoSimulation.robot.position.angle % 360)+360)%360;
      if (angle <= 180) {
        lineY = DwenguinoSimulation.field.height;
      }
      if (angle <= 90 || angle >= 270) {
        lineX = DwenguinoSimulation.field.width;
      }
      angle = DwenguinoSimulation.robot.position.angle;
      
      var distanceX = Math.cos(Math.PI / 180 * angle) !== 0? (lineX-xFront)/(Math.cos(Math.PI / 180 * angle)) : DwenguinoSimulation.field.width*2;
      var distanceY = Math.sin(Math.PI / 180 * angle) !== 0? (lineY-yFront)/(Math.sin(Math.PI / 180 * angle)) : DwenguinoSimulation.field.height*2;

      document.getElementById('sonar_input').value = parseInt(distanceX < distanceY? distanceX/2 : distanceY/2);
      return parseInt(distanceX < distanceY? distanceX/2 : distanceY/2);
    }

    return parseInt(document.getElementById('sonar_input').value);
  },

  /*
   * Renders the moving robot
   */
  renderScenario: function() {
    var robot = DwenguinoSimulation.robot;
    var $robot = $('#sim_animation');

    // Update field size
    DwenguinoSimulation.field.width = $("#sim_container").width();
    DwenguinoSimulation.field.height = $("#sim_container").height();
    
    $robot
      .css('top', robot.position.y + 'px')
      .css('left', robot.position.x + 'px')
      .css('transform', 'rotate(' + robot.position.angle + 'deg)');

    /*$("#sim_debug").text(JSON.stringify({
      field,
      robot
    }, null, 2));*/
  },
  
  /*
   * Adjust css when simulation is started
   */
  setButtonsStart: function() {
    // enable pauze and stop
    document.getElementById('sim_pause').className = "sim_item";
    document.getElementById('sim_stop').className = "sim_item";
    // disable start and step
    document.getElementById('sim_start').className = "sim_item disabled";
    document.getElementById('sim_step').className = "sim_item disabled";
  },

  /*
   * Adjust css when simulation is paused
   */
  setButtonsPause: function() {
    // enable start, stop and step
    document.getElementById('sim_start').className = "sim_item";
    document.getElementById('sim_step').className = "sim_item";
    document.getElementById('sim_stop').className = "sim_item";
    // disable pause
    document.getElementById('sim_pause').className = "sim_item disabled";
  },

  /*
   * Adjust css when simulation is stopped
   */
  setButtonsStop: function() {
    // enable start, stop and step
    document.getElementById('sim_start').className = "sim_item";
    document.getElementById('sim_step').className = "sim_item";
    // disable pause
    document.getElementById('sim_stop').className = "sim_item disabled";
    document.getElementById('sim_pause').className = "sim_item disabled";
  },

  /*
   * Adjust css when simulation is run step by step
   */
  setButtonsStep: function() {
    // enable start, stop and step
    document.getElementById('sim_start').className = "sim_item";
    document.getElementById('sim_step').className = "sim_item";
    document.getElementById('sim_stop').className = "sim_item";
    // disable pause
    document.getElementById('sim_pause').className = "sim_item disabled";
  },
  
  /*
   * Adjusts the view during simulation
   * disables the programming and makes the simulation pane biggger
   */
  startDebuggingView: function() {
    if (document.getElementsByClassName("alertDebug").length !== 0) {
      document.getElementsByClassName("alertDebug")[0].remove();
    }
    var alertMessage = '<div class ="alertDebug">' + MSG.simulator['alertDebug'] + '</div>';
    $('#db_body').append(alertMessage);
    document.getElementsByClassName('alertDebug')[0].style.width = document.getElementById("blocklyDiv").style.width;
    document.getElementById('blocklyDiv').style.opacity = "0.5";
    document.getElementById('blocklyDiv').style.pointerEvents = "none";
  },

  /*
   * Returns to normal view when debugging is finished
   */
  stopDebuggingView: function() {
    document.getElementById('blocklyDiv').style.opacity = "1";
    document.getElementById('blocklyDiv').style.pointerEvents = "auto";
    if (document.getElementsByClassName("alertDebug").length !== 0) {
      document.getElementsByClassName("alertDebug")[0].remove();
    }
  },

  changeScenarioView: function() {
    var option = DwenguinoSimulation.scenarioView;

    switch (option) {
      case "default":
        document.getElementById('db_code_pane').style.display = "inline";
        document.getElementById('db_robot_pane').style.display = "none";
        break;
      case "moving":
        document.getElementById('db_code_pane').style.display = "none";
        document.getElementById('db_robot_pane').style.display = "inline";
        document.getElementById('sim_container').style.border = "none";
        document.getElementById('sim_container').style.height = "50%";
        document.getElementById('sim_container').style.marginTop = "initial";
        document.getElementById('sim_container').style.left = "initial";
        document.getElementById('sim_container').style.width = "100%";
        break;
      case "wall":
        document.getElementById('db_code_pane').style.display = "none";
        document.getElementById('db_robot_pane').style.display = "inline";
        document.getElementById('sim_container').style.border = "2px solid grey";
        document.getElementById('sim_container').style.height = "40%";
        document.getElementById('sim_container').style.marginTop = "5%";
        document.getElementById('sim_container').style.left = "5%";
        document.getElementById('sim_container').style.width = "90%";
    }
  }
};

// initialise js functions if version older than 2015
if (!String.prototype.repeat) {
  String.prototype.repeat = function(num) {
    return new Array(num + 1).join(this);
  };
}

if (!String.prototype.startsWith) {
  String.prototype.startsWith = function(searchString, position) {
    position = position || 0;
    return this.substr(position, searchString.length) === searchString;
  };
}

$(document).ready(function() {
  DwenguinoBlockly.setupEnvironment();
  DwenguinoSimulation.setupEnvironment();
});