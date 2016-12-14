var DwenguinoBlockly = {
    simButtonStateClicked: false,

    workspace: null,
    recording: "",
    sessionId: null,
    tutorialId: null,

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
        if (!DwenguinoBlockly.sessionId){
            // Try to get a new sessionId from the server to keep track
            $.ajax({
                type: "GET",
                url: "http://localhost:3000/sessions/newId"}
            ).done(function(data){
                console.log(data);
                DwenguinoBlockly.sessionId = data;
            }).fail(function(data)  {
                console.log(data);
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
            if (dwenguinoBlocklyServer){
                try {
                    var xml = Blockly.Xml.textToDom(dwenguinoBlocklyServer.loadBlocks());
                } catch (e) {
                    return;
                }
                var count = DwenguinoBlockly.workspace.getAllBlocks().length;
                //if (count && confirm('Replace existing blocks?\n"Cancel" will merge.')) {
                    DwenguinoBlockly.workspace.clear();
                //}
                //Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, xml);
                Blockly.Xml.domToWorkspace(xml, DwenguinoBlockly.workspace);
            }
        });

        $("#db_menu_item_download").click(function(){
            if (dwenguinoBlocklyServer){
                var xml = Blockly.Xml.workspaceToDom(DwenguinoBlockly.workspace);
                var data = Blockly.Xml.domToText(xml);
                dwenguinoBlocklyServer.saveBlocks(data);
            }
        });

        //dropdown menu code
         $(".dropdown-toggle").dropdown();

         //dropdown link behaviors
         $("#tutsIntroduction").click(function(){
             DwenguinoBlockly.tutorialId = "Introduction";
             DwenguinoBlockly.tutorialIdSetting = DwenguinoBlockly.tutorialId;
             hopscotch.startTour(tutorials.introduction);
             //DwenguinoBlockly.appendToRecording('<startIntroductionTutorial time="' + $.now() + '"/>');
         });

         $("#tutsBasicTest").click(function(){
             DwenguinoBlockly.tutorialId = "BasicTest"
             DwenguinoBlockly.tutorialIdSetting = DwenguinoBlockly.tutorialId ;
             hopscotch.startTour(tutorials.basic_test);
             //DwenguinoBlockly.appendToRecording('<startBasicTestTutorial time="' + $.now() + '"/>');
         });

         $("#tutsTheremin").click(function(){
             DwenguinoBlockly.tutorialId  = "Theremin";
             DwenguinoBlockly.tutorialIdSetting = DwenguinoBlockly.tutorialId ;
             hopscotch.startTour(tutorials.theremin);
             //DwenguinoBlockly.appendToRecording('<startTheremin time="' + $.now() + '"/>');
         });

         //following event listener is only a test --> remove later!
         $("#db_menu_item_dwengo_robot_teacher_image").click(function(){
            DwenguinoBlockly.takeSnapshotOfWorkspace();
         });

    },

    endTutorial: function(){
        DwenguinoBlockly.tutorialId = "";
        DwenguinoBlockly.tutorialIdSetting = "";
        //DwenguinoBlockly.appendToRecording('<endTutorial time="' + $.now() + '"/>');
        DwenguinoBlockly.submitRecordingToServer();
    },

    appendToRecording: function(text){
            DwenguinoBlockly.recording = DwenguinoBlockly.recording + "\n" + text;
    },


    submitRecordingToServer: function(){
        //online code submission
        var serverSubmission = { _id: DwenguinoBlockly.sessionId, agegroup: DwenguinoBlockly.agegroupSetting, gender: DwenguinoBlockly.genderSetting, activityId: DwenguinoBlockly.activityId, timestamp: $.now(), logData: DwenguinoBlockly.recording };
        $.ajax({
            type: "POST",
            url: "http://localhost:3000/sessions/update",
            data: serverSubmission,

        }
        ).done(function(data){
            console.log(data);
        }).fail(function(data)  {
            console.log(data);
        });
        // local file submission (Dwenguinoblockly saves the log to a local file in the user home dir)
        if (dwenguinoBlocklyServer){
            dwenguinoBlocklyServer.saveToLog(
                JSON.stringify(serverSubmission);
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
    /**
     * Populate the currently selected pane with content generated from the blocks.
     */
    renderCode: function() {
        var arduino_content = document.getElementById("content_arduino");
        //var xml_content = document.getElementById("content_xml");

        // Write code to code window
        var code = Blockly.Arduino.workspaceToCode(DwenguinoBlockly.workspace);
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
$(document).ready(function(){
    DwenguinoBlockly.setupEnvironment();
});
