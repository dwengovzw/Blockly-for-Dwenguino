if (!window.dwenguinoBlocklyServer) {
  dwenguinoBlocklyServer = false
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
                console.log(xml)
                Blockly.Xml.domToWorkspace(xml, DwenguinoBlockly.workspace);
            } catch (e) {}           
        });

        $("#db_menu_item_download").click(function(){
            var xml = Blockly.Xml.workspaceToDom(DwenguinoBlockly.workspace);
            var data = Blockly.Xml.domToText(xml);
            if (dwenguinoBlocklyServer){
                dwenguinoBlocklyServer.saveBlocks(data);
            } else {
                console.log(data)
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
             DwenguinoBlockly.tutorialId = "BasicTest"
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
            data: { _id: DwenguinoBlockly.sessionId, agegroup: DwenguinoBlockly.agegroupSetting, gender: DwenguinoBlockly.genderSetting, activityId: DwenguinoBlockly.activityIdSetting, timestamp: $.now(), tutorialId: DwenguinoBlockly.tutorialIdSetting , logData: DwenguinoBlockly.recording },

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
        if (text != DwenguinoBlockly.prevWorkspaceXml){
            text = "<changedWorkspace timestamp='" + $.now() + "' activeTutorial='" + DwenguinoBlockly.tutorialIdSetting + "'>" + text + "</changedWorkspace>";
            DwenguinoBlockly.appendToRecording(text);
            DwenguinoBlockly.prevWorkspaceXml = text;
        }
    },

    /**
    *   Log the code changes of the user
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
        if (DwenguinoBlockly.language == "cpp") {
            var code = Blockly.Arduino.workspaceToCode(DwenguinoBlockly.workspace);
        }
        else if (DwenguinoBlockly.language == "js") {
            var code = Blockly.JavaScript.workspaceToCode(DwenguinoBlockly.workspace);
        }

        // display code
        if (DwenguinoBlockly.previouslyRenderedCode == null){
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
        if (typeof Blockly != 'undefined' && window.sessionStorage) {
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
        if (lang == DwenguinoBlockly.LANG) {
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
    },

};



var DwenguinoSimulation = {
    lcdContent: new Array(2),
    isSimulationRunning: false,
    isSimulationPaused: false,
    oscBuzzer: null,
    audiocontextBuzzer: null,
    tonePlayingBuzzer: 0,
    debuggerjs: null,
    speedDelaySimulation: 500,
    code: "",
    lastBlocks: [null, null],
    lastColours: [-1,-1],
    blockMapping: {},
    servoAngles: [0,0],
    motorSpeeds: [0,0],
    
    /*
     * inits the right actions to handle the simulation view
     */
    initDwenguinoSimulation: function(){
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
        document.getElementById('sim_sonar_distance').textContent = "Sonar "+MSG.simulator['distance'] + ":";
        document.getElementById('sonar_input').value= '50'; 

        
        
        // start/stop/pause
        $("#sim_start").click(function(){
            // start
            if (!DwenguinoSimulation.isSimulationRunning && !DwenguinoSimulation.isSimulationPaused) {
              DwenguinoSimulation.isSimulationRunning = true;
              DwenguinoSimulation.setButtonsStart();
              DwenguinoSimulation.startSimulation();
            // resume
            } else if (!DwenguinoSimulation.isSimulationRunning) {
              DwenguinoSimulation.isSimulationRunning = true;
              DwenguinoSimulation.isSimulationPaused = false;
              DwenguinoSimulation.setButtonsStart();
              DwenguinoSimulation.resumeSimulation();
            }
        });
        
        $("#sim_pause").click(function(){
            if (DwenguinoSimulation.isSimulationRunning) {
              DwenguinoSimulation.isSimulationRunning = false;
              DwenguinoSimulation.isSimulationPaused = true;
              DwenguinoSimulation.setButtonsPause();
            }
        });
        
        $("#sim_stop").click(function(){
          DwenguinoSimulation.isSimulationRunning = false;
          DwenguinoSimulation.isSimulationPaused = false;
          DwenguinoSimulation.setButtonsStop();
          DwenguinoSimulation.stopSimulation();
        });
        
        $("#sim_step").click(function(){
            if (!DwenguinoSimulation.isSimulationPaused && !DwenguinoSimulation.isSimulationRunning) {
              DwenguinoSimulation.isSimulationPaused = true;
              DwenguinoSimulation.setButtonsStep();
              DwenguinoSimulation.stopDebuggingView();
              DwenguinoSimulation.startDebuggingView();
              DwenguinoSimulation.initDebugger();
              DwenguinoSimulation.oneStep();
            } else if (!DwenguinoSimulation.isSimulationRunning) {
              DwenguinoSimulation.setButtonsStep();
              DwenguinoSimulation.oneStep();
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
          } else {
            document.getElementById(this.id).className = "sim_button";
          }
        });
        
        // change speed of simulation
        $("#sim_speed").on('change', function() {
          DwenguinoSimulation.setSpeed();
        });
        
        $("#sim_scenario").on('change', function() {
          DwenguinoSimulation.changeScenarioView();
        });
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
     * initialize the debugging environment
     */
    initDebugger: function() {
      // initialize simulation
      DwenguinoSimulation.initDwenguino();
      

      // get code
      DwenguinoSimulation.code = document.getElementById('content_arduino').textContent;
      DwenguinoSimulation.mapBlocksToCode();
      
      // create debugger
      DwenguinoSimulation.debuggerjs = debugjs.createDebugger({
        iframeParentElement: document.getElementById('debug'),
        // declare context that should be available in debugger
        sandbox: {
          DwenguinoSimulation: DwenguinoSimulation
        }
      });

      DwenguinoSimulation.debuggerjs.machine.on('error', function (err) {
        console.error(err.message);
      });

      var filename = 'simulation';
      DwenguinoSimulation.debuggerjs.load(DwenguinoSimulation.code, filename);
      
      var min = Math.min.apply(null,Object.keys(DwenguinoSimulation.blockMapping))
      var line = 0;
      while (line <= min) {
        DwenguinoSimulation.oneStep();
        line = DwenguinoSimulation.debuggerjs.machine.getCurrentLoc().start.line; 
      }
    },
    
    /*
     * Starts the simulation for the current code
     */
    startSimulation: function() {
      DwenguinoSimulation.stopDebuggingView();
      DwenguinoSimulation.startDebuggingView();
      DwenguinoSimulation.initDebugger()
      // run debugger
      DwenguinoSimulation.step();
    },
    
    stopSimulation: function() {
      DwenguinoSimulation.stopDebuggingView();
      DwenguinoSimulation.resetDwenguino();
    },
    
    /*
     * resumes a simulation that was paused
     */
    resumeSimulation :function() {
      DwenguinoSimulation.step();
    },
    
    /*
     * While the simulation is running, this function keeps being called with "speeddelay" timeouts in between
     */
    step : function() {
      if (DwenguinoSimulation.isSimulationRunning) {
        
        var line = DwenguinoSimulation.debuggerjs.machine.getCurrentLoc().start.line-1;
        
        DwenguinoSimulation.debuggerjs.machine.step();
        
        // highlight the current block
        DwenguinoSimulation.updateBlocklyColour();
        DwenguinoSimulation.handleScope();
        
        // check if current line is not a sleep
        var code = DwenguinoSimulation.code.split("\n")[line] === undefined? '':DwenguinoSimulation.code.split("\n")[line];
        
        if (!code.trim().startsWith("DwenguinoSimulation.sleep")) {
          setTimeout(DwenguinoSimulation.step, DwenguinoSimulation.speedDelaySimulation);
        } else {
          // sleep
          setTimeout(DwenguinoSimulation.step, 
              DwenguinoSimulation.speedDelaySimulation + Number(DwenguinoSimulation.code.split("\n")[line].replace( /\D+/g, '')));
        }
      }
      DwenguinoSimulation.checkForEnd();
    },
    
    
    /*
     * Lets the simulator run one step
     */
    oneStep: function() {
      DwenguinoSimulation.debuggerjs.machine.step();
      DwenguinoSimulation.updateBlocklyColour();
      DwenguinoSimulation.handleScope();
      DwenguinoSimulation.checkForEnd();
    },
    
    /*
     * Displays the values of the variables during the simulation
     */
    handleScope: function() {
      var scope = DwenguinoSimulation.debuggerjs.machine.getCurrentStackFrame().scope;
      document.getElementById('sim_scope').innerHTML = "";
      for (var i in scope) {
        var item = scope[i];
        var value = DwenguinoSimulation.debuggerjs.machine.$runner.gen.stackFrame.evalInScope(item.name);
        document.getElementById('sim_scope').innerHTML = document.getElementById('sim_scope').innerHTML + item.name + " = " + value + "<br>";
      }
    },
    
    /*
     * Checks if the simulation has been interrupted
     */
    checkForEnd: function() {
      if ((DwenguinoSimulation.isSimulationRunning || DwenguinoSimulation.isSimulationPaused)
                && DwenguinoSimulation.debuggerjs.machine.halted) {
          DwenguinoSimulation.isSimulationRunning = false;
          DwenguinoSimulation.isSimulationPaused = false;
          DwenguinoSimulation.setButtonsStep();
      }
    },
    
    /*
     * Adjusts the view during simulation
     * disables the programming and makes the simulation pane biggger
     */
    startDebuggingView: function() {
      var alertMessage = '<div class ="alertDebug">'+MSG.simulator['alertDebug']+'</div>'
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
      var e = document.getElementById("sim_scenario");
      var option = e.options[e.selectedIndex].value;
      
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
        case "wall": {
          document.getElementById('db_code_pane').style.display = "none";
          document.getElementById('db_robot_pane').style.display = "inline";
          document.getElementById('sim_container').style.border = "2px solid grey";
          document.getElementById('sim_container').style.height = "40%";
          document.getElementById('sim_container').style.marginTop = "5%";
          document.getElementById('sim_container').style.left = "5%";
          document.getElementById('sim_container').style.width = "90%";
        }
      }
    },
    
    // maps line numbers to blocks
    mapBlocksToCode: function() {
      var setup_block = DwenguinoBlockly.workspace.getAllBlocks()[0];
      
      var line = 0;
      var lines = DwenguinoSimulation.code.split("\n");
      var loopBlocks = [];
      
      // update variables in while loop when searching for a match between block and line
      function updateBlocks() {
        // special structure for loop blocks -> look at children
        if (lines[line].trim() === Blockly.JavaScript.blockToCode(block).split('\n')[0] 
              && (lines[line].trim().startsWith("for") || lines[line].trim().startsWith("while")
              || lines[line].trim().startsWith("if"))) {
          loopBlocks.push(block);
          DwenguinoSimulation.blockMapping[line] = block;
          block = block.getInputTargetBlock('DO') || block.getInputTargetBlock('DO0');
        }
        else if (lines[line].trim() === Blockly.JavaScript.blockToCode(block).split('\n')[0]) {
          DwenguinoSimulation.blockMapping[line] = block;
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
        DwenguinoSimulation.blockMapping[line] = setup_block;
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
      
      var line = DwenguinoSimulation.debuggerjs.machine.getCurrentLoc().start.line-1;
      if (DwenguinoSimulation.code !== "" && typeof DwenguinoSimulation.blockMapping[line] !== 'undefined') {
        // reset old block
        if (DwenguinoSimulation.lastBlocks[0] !== null) {
          DwenguinoSimulation.lastBlocks[0].setColour(DwenguinoSimulation.lastColours[0]);
        }
        
        DwenguinoSimulation.lastBlocks[0] = DwenguinoSimulation.lastBlocks[1];
        DwenguinoSimulation.lastColours[0] = DwenguinoSimulation.lastColours[1];
        
        // highlight current block
        DwenguinoSimulation.lastBlocks[1] = DwenguinoSimulation.blockMapping[line];
        DwenguinoSimulation.lastColours[1] = DwenguinoSimulation.blockMapping[line].getColour();
        
        if (DwenguinoSimulation.lastBlocks[0] !== null) {
          DwenguinoSimulation.lastBlocks[0].setColour(highlight_colour);
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
          DwenguinoSimulation.speedDelaySimulation = 900;
          break;
        case "slow":
          DwenguinoSimulation.speedDelaySimulation = 700;
          break;
        case "medium":
          DwenguinoSimulation.speedDelaySimulation = 500;
          break;
        case "fast":
          DwenguinoSimulation.speedDelaySimulation = 300;
          break;
        case "veryfast":
          DwenguinoSimulation.speedDelaySimulation = 100;
        case "realtime":
          DwenguinoSimulation.speedDelaySimulation = 20;
          break;
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
      DwenguinoSimulation.debuggerjs = null;
      DwenguinoSimulation.blockMapping = {};
      
      // reset colours
      if (DwenguinoSimulation.lastColours[0] !== -1) {
        DwenguinoSimulation.lastBlocks[0].setColour(DwenguinoSimulation.lastColours[0]);
      }
      DwenguinoSimulation.lastColours = [-1,-1];
      DwenguinoSimulation.lastBlocks = [null,null];
      
      // stop sound
      if (DwenguinoSimulation.tonePlayingBuzzer !== 0) {
        DwenguinoSimulation.noTone("BUZZER");
      }
      // clearn lcd
       DwenguinoSimulation.clearLcd();
       // turn all lights out
       for (var i=0; i < 8; i++) {
         document.getElementById('sim_light_'+i).className = "sim_light sim_light_off";
       }
       document.getElementById('sim_light_13').className = "sim_light sim_light_off";
       
       // reset servo
       DwenguinoSimulation.servoAngles = [0,0]
       $("#sim_servo1_mov, #sim_servo2_mov").css("transform", "rotate(0deg)");
       
       // reset motors
       DwenguinoSimulation.motorSpeeds = [0,0]
       $("#sim_motor1, #sim_motor2").css("transform", "rotate(0deg)");
       
       //reset buttons
      $("#sim_button_N, #sim_button_E, #sim_button_C, #sim_button_S, #sim_button_W").removeClass().addClass('sim_button');
      
      // clear scope
      document.getElementById('sim_scope').innerHTML = "";
      
      // reset moving car
      var car = document.getElementById('sim_animation');
      car.style.top = "50%";
      car.style.left = "20%";
      $("#sim_animation").css("transform", "translate(-20%, -50%) rotate(0deg)");
      
    },
    
    sleep: function(delay) {
      // sleep is regulated inside step funtion
    },

    clearLcd: function() {
        // clear lcd by writing spaces to it
        for (var i = 0; i < 2; i++) {
          DwenguinoSimulation.lcdContent[i] = " ".repeat(16);
          DwenguinoSimulation.writeLcd(" ".repeat(16), i, 1);
        }
    },
    
    writeLcd: function(text, row, column) {
      // replace text in current content (if text is hello and then a is written this gives aello)
      text = DwenguinoSimulation.lcdContent[row].substr(0,column)
              + text.substring(0,16-column) 
              + DwenguinoSimulation.lcdContent[row].substr(text.length+column, 16);
      DwenguinoSimulation.lcdContent[row] = text;
      
      // write new text to lcd screen and replace spaces with &nbsp;
      $("#sim_lcd_row"+row).text(text);
      document.getElementById('sim_lcd_row'+row).innerHTML = 
              document.getElementById('sim_lcd_row'+row).innerHTML.replace(/ /g, '&nbsp;');
      // repaint
      var element = document.getElementById("sim_lcds");
      element.style.display='none';
      element.offsetHeight;
      element.style.display='block';
    },
    
    digitalWrite: function(pinNumber, state) {
      // turns light on or off
      if ((pinNumber >= 32 && pinNumber <= 39) || pinNumber === 13) {
        if (pinNumber >= 32 && pinNumber <= 39) {
          pinNumber -= 32;
        }
        if (state === 'HIGH') {
          document.getElementById('sim_light_'+pinNumber).className = "sim_light sim_light_on";
        } else {
          document.getElementById('sim_light_'+pinNumber).className = "sim_light sim_light_off";
        }
      }
    },
    
    digitalRead: function(pin) {
      // read value from buttons
      if (pin.startsWith("SW_")) {
        return document.getElementById("sim_button_"+pin[3]).className === "sim_button"?1:0;
      }
    },
    
    tone: function(pin, frequency) {
      if ( pin === "BUZZER") {
        if (DwenguinoSimulation.oscBuzzer === null) {
          // initiate sound object
          try {
            DwenguinoSimulation.audiocontextBuzzer = new (window.AudioContext || window.webkitAudioContext)();
          } catch(e) {
            alert('Web Audio API is not supported in this browser');
          }
          //DwenguinoSimulation.audiocontextBuzzer = new AudioContext();
        }
        if (DwenguinoSimulation.tonePlayingBuzzer !== 0 && DwenguinoSimulation.tonePlayingBuzzer !== frequency) {
          DwenguinoSimulation.oscBuzzer.stop();
        }
        if (DwenguinoSimulation.tonePlayingBuzzer !== frequency) {
          // a new oscilliator for each round
          DwenguinoSimulation.oscBuzzer = DwenguinoSimulation.audiocontextBuzzer.createOscillator(); // instantiate an oscillator
          DwenguinoSimulation.oscBuzzer.type = 'sine'; // this is the default - also square, sawtooth, triangle

          // start tone
          DwenguinoSimulation.oscBuzzer.frequency.value = frequency; // Hz
          DwenguinoSimulation.oscBuzzer.connect(DwenguinoSimulation.audiocontextBuzzer.destination); // connect it to the destination
          DwenguinoSimulation.oscBuzzer.start(); // start the oscillator

          DwenguinoSimulation.tonePlayingBuzzer = frequency;
        }
      }
    },
    
    noTone: function(pin) {
      if ( pin === "BUZZER") {
        // stop tone
        DwenguinoSimulation.tonePlayingBuzzer = 0;
        DwenguinoSimulation.oscBuzzer.stop();
      }
    },
    
    servo: function(channel, angle) {
      //set angle
      if (angle > 180) {
        angle = 180;
      }
      if (angle < 0) {
        angle = 0;
      }
      
      if (angle !== DwenguinoSimulation.servoAngles[channel-1]) {
        DwenguinoSimulation.servoAngles[channel-1] = angle;
        DwenguinoSimulation.servoRotate(channel, angle);
      }
    },
    
    servoRotate: function(channel, angle) {
      var maxMovement = 10;
      if (angle === DwenguinoSimulation.servoAngles[channel-1]) {
        var prevAngle = DwenguinoSimulation.getAngle($("#sim_servo"+channel+"_mov"));
        // set 10 degrees closer at a time to create rotate effect
        if (Math.abs(angle - prevAngle) > maxMovement) {
          var direction = ((angle - prevAngle)>0)?1:-1;
          $("#sim_servo"+channel+"_mov").css("transform", "rotate("+(prevAngle+direction*maxMovement)+"deg)");
          setTimeout(function(){DwenguinoSimulation.servoRotate(channel, angle);}, 15);
        } else {
          $("#sim_servo"+channel+"_mov").css("transform", "rotate("+angle+"deg)");
        }
      }
    },
    
    getAngle: function(obj) {
      var matrix = obj.css("-webkit-transform") ||
      obj.css("-moz-transform")    ||
      obj.css("-ms-transform")     ||
      obj.css("-o-transform")      ||
      obj.css("transform");
      if (matrix !== "none") {
        var values = matrix.split('(')[1];
        values = values.split(')')[0];
        values = values.split(',');
        var a = values[0];
        var b = values[1];
        return Math.round(Math.atan2(b, a) * (180/Math.PI));
      }
      return 0;
    },
     
    startDcMotor: function(channel, speed) {
      //set angle
      if (speed > 255) {
        speed = 255;
      }
      if (speed < 0) {
        speed = 0;
      }
      
      // change view of motor
      if (speed !== DwenguinoSimulation.motorSpeeds[channel-1]) {
        DwenguinoSimulation.motorSpeeds[channel-1] = speed;
        DwenguinoSimulation.dcMotorRotate(channel, speed);
      }
      
      // change view of driving robot
      var e = document.getElementById("sim_scenario");
      var option = e.options[e.selectedIndex].value;
      
      if (option === "moving") {
        DwenguinoSimulation.drawMovingRobot(DwenguinoSimulation.motorSpeeds[0], DwenguinoSimulation.motorSpeeds[1], false);
      } else if (option === "wall") {
        
        DwenguinoSimulation.drawMovingRobot(DwenguinoSimulation.motorSpeeds[0], DwenguinoSimulation.motorSpeeds[1], true);
      }
    },
    
    dcMotorRotate: function(channel, speed) {
      var maxMovement = speed/20 + 5;
      if (speed === DwenguinoSimulation.motorSpeeds[channel-1] && speed !== 0) {
        var prevAngle = DwenguinoSimulation.getAngle($("#sim_motor"+channel));
        // rotate x degrees at a time based on speed
        $("#sim_motor"+channel).css("transform", "rotate("+((prevAngle+maxMovement)%360)+"deg)");
        setTimeout(function(){DwenguinoSimulation.dcMotorRotate(channel, speed);}, 15);
      }
    },
    
    /*
     * int speed1: the speed of motor 1
     * int speed2: the speed of motor 2
     * boolean wall: true if the car is surrounded by a wall
     */
    drawMovingRobot: function(speed1, speed2, wall) {
      if (speed1 === DwenguinoSimulation.motorSpeeds[0] && speed2 === DwenguinoSimulation.motorSpeeds[1] && (speed1 !== 0 || speed2 !== 0)) {
        var car = document.getElementById('sim_animation');
        var x = 100 * parseFloat($('#sim_animation').css('left')) / parseFloat($('#sim_animation').parent().css('width'));
        var y = 100 * parseFloat($('#sim_animation').css('top')) / parseFloat($('#sim_animation').parent().css('height'));
        
        // decide on angle and speed based on 2 motor speeds
        var speed = (speed1+speed2)/300+0.5;
        var angle = DwenguinoSimulation.getAngle($("#sim_animation"));
        
        if (speed1 !== speed2) {
          angle += (speed2 - speed1)/30;
        }
        
        x += speed * Math.cos(Math.PI/180 * angle);
        y += speed * Math.sin(Math.PI/180 * angle);
        
        if (!wall) {
          if (x > 100) x = 2;
          if (y > 100) y = 2;
          if (x < 2) x = 100;
          if (y < 2) y = 100;
        } else {
          if (x > 100) x = 100;
          if (y > 100) y = 100;
          if (x < 0) x = 0;
          if (y < 0) y = 0;
        }

        car.style.left = x+"%";
        car.style.top = y+"%";
        $("#sim_animation").css("transform", "translate(-"+String(parseInt(x))+"%, -"+String(parseInt(y))+"%) rotate("+angle+"deg)");
        $("#sim_debug").text(JSON.stringify({
          x, y
        }, null, 2))


        setTimeout(function(){DwenguinoSimulation.drawMovingRobot(speed1,speed2, wall);}, DwenguinoSimulation.speedDelaySimulation);
      }
    },
    
    sonar: function(trigPin, echoPin) {
      // adjust sonar value based on wall
      var e = document.getElementById("sim_scenario");
      var option = e.options[e.selectedIndex].value;
      
      if (option === "wall") {
        // calculate distance between front of car and wall
        // todo get real value of width and height before rotation
        var height = 40;
        var width = 50;
        var x0 = parseFloat($('#sim_animation').css('left'));
        var y0 = parseFloat($('#sim_animation').css('top')) + height;
        var angle = (-1*DwenguinoSimulation.getAngle($("#sim_animation")))%360;
        var directionX = 1;
        var directionY = 1;
        
        //calculate angle and direction
        if (angle >= 90 && angle < 180) {
          angle = 180 - angle;
          directionX = -1;
          directionY = 1;
        } else if (angle >= 180 && angle < 270) {
          angle = angle -180;
          directionX = -1;
          directionY = -1;
        } else if (angle >= 270 && angle < 360) {
          angle = 360 - angle;
          directionX = 1;
          directionY = -1;
        }
        
        //find the coordinates of the front corners
        // based on formula a/sinA = b/sinB = c/sinC
        //In any triangle, the ratio of a side length to the sine of its opposite angle is the same for all three sides.
        var xCorner1 = x0 + directionX * width * (Math.sin(Math.PI/180 * (90-angle)))/Math.sin(Math.PI/180 * 90);
        var yCorner1 = y0 - directionY * width * (Math.sin(Math.PI/180 * (angle)))/Math.sin(Math.PI/180 * 90);
        var xCorner2 = xCorner1 - directionX * height*(Math.sin(Math.PI/180 * (angle)))/Math.sin(Math.PI/180 * 90);
        var yCorner2 = yCorner1 + directionY * height*(Math.sin(Math.PI/180 * (90-angle)))/Math.sin(Math.PI/180 * 90);
        
        
        console.log(xCorner1, yCorner1, xCorner2, yCorner2);
        
        //document.getElementById('sonar_input').value = 
      }
      
      
      return parseInt(document.getElementById('sonar_input').value);
    },
  
    setupEnvironment: function(){
        DwenguinoSimulation.initDwenguinoSimulation();
    },
};

// initialise js functions if version older than 2015
if (!String.prototype.repeat) {
  String.prototype.repeat = function( num ) {
    return new Array( num + 1 ).join( this );
  };
}

if (!String.prototype.startsWith) {
  String.prototype.startsWith = function (searchString, position) {
      position = position || 0;
      return this.substr(position, searchString.length) === searchString;
  };
}

$(document).ready(function(){
    DwenguinoBlockly.setupEnvironment();
    DwenguinoSimulation.setupEnvironment();
});
