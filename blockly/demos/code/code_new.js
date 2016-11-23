
    var simButtonStateClicked = true;

    var workspace = null;
    var recording = "";
    var sessionId = null;
    function initDwenguinoBlockly(){
        sessionId = window.sessionStorage.loadOnceSessionId;
        delete window.sessionStorage.loadOnceSessionId;
        if (!sessionId){
            // Try to get a new sessionId from the server to keep track
            $.ajax({
                type: "GET",
                url: "http://localhost:8080/session_id.json"}
            ).done(function(data){
                console.log(data);
                sessionId = data;
            }).fail(function(data)  {
                console.log(data);
                alert("Sorry. Server unavailable. ");
            });
        }

        recording = window.sessionStorage.loadOnceRecording || "<startApplication/>";
        delete window.sessionStorage.loadOnceRecording;
        //appendToRecording("<startApplication/>");
        //init slider control
        $( "#db_menu_item_difficulty_slider" ).slider({
            value:0,
            min: 0,
            max: 4,
            step: 1,
            slide: function( event, ui ) {
                setDifficultyLevel(ui.value);
                appendToRecording("<setDifficultyLevel_" + ui.value + "/>");
            }
        });
        $( "#db_menu_item_difficulty_slider_input" ).val( "$" + $( "#db_menu_item_difficulty_slider" ).slider( "value" ) );

        //init resizable panels
        $( "#db_blockly" ).resizable({
            handles: "e",
            resize: function(event, ui){
                onresize();
                Blockly.svgResize(workspace);
            }
        });

        //show/hide simulator
        $("#db_menu_item_simulator").click(function(){
            if (simButtonStateClicked){
                $("#db_blockly").width('100%');
                simButtonStateClicked = false;
                appendToRecording("<stopSimulator/>");
            }else{
                $("#db_blockly").width('50%');
                simButtonStateClicked = true;
                appendToRecording("<startSimulator/>");
            }
            onresize();
            Blockly.svgResize(workspace);
        });

        //dropdown menu code
         $(".dropdown-toggle").dropdown();

         //dropdown link behaviors
         $("#tutsIntroduction").click(function(){
             hopscotch.startTour(tutorials.introduction);
             appendToRecording("<startIntroductionTutorial/>");
         });

         $("#tutsBasicTest").click(function(){
             hopscotch.startTour(tutorials.basic_test);
             appendToRecording("<startBasicTestTutorial/>");
         });

         //following event listener is only a test --> remove later!
         $("#db_menu_item_dwengo_robot_teacher_image").click(function(){
            takeSnapshotOfWorkspace();
         });

    };

    function endTutorial(){
        appendToRecording("<endTutorial/>")
    }

    function appendToRecording(text){
            recording = recording + "\n" + text;
            console.log(sessionId);
            console.log(recording);
            $.ajax({
                type: "POST",
                url: "http://localhost:8080/log.html",
                data: sessionId + "\n" + recording
            }
            ).done(function(data){
                console.log(data);
            }).fail(function(data)  {
                console.log(data);
                alert("Sorry. Server unavailable. ");
            });
    };

    var prevWorkspaceXml = "";
    /**
    *   Take a snapshot of the current blocks in the workspace.
    */
    function takeSnapshotOfWorkspace(){
        var xml = Blockly.Xml.workspaceToDom(workspace);
        var text = Blockly.Xml.domToText(xml);
        if (text != prevWorkspaceXml){
            appendToRecording(text);
            prevWorkspaceXml = text;
        }
    }

    /**
    *   Log the code changes of the user
    */
    function logCodeChange(event){
        takeSnapshotOfWorkspace();
    };

    /**
     * Populate the currently selected pane with content generated from the blocks.
     */
    function renderCode() {
        var arduino_content = document.getElementById("content_arduino");
        //var xml_content = document.getElementById("content_xml");

        // Write code to code window
        var code = Blockly.Arduino.workspaceToCode(workspace);
        arduino_content.textContent = code;
        if (typeof prettyPrintOne == 'function'){
            code = arduino_content.innerHTML;
            code = prettyPrintOne(code, 'c');
            arduino_content.innerHTML = code;
        }
    };

    function setDifficultyLevel(level){
        $("#toolbox").load("levels/lvl" + level + ".xml", function(){
            doTranslation();
            workspace.updateToolbox(document.getElementById("toolbox"));
        });
    };

    function onresize(){
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
    };

    function injectBlockly(){
        var blocklyArea = document.getElementById('db_blockly');
        var blocklyDiv = document.getElementById('blocklyDiv');
        workspace = Blockly.inject(blocklyDiv,
            {
                toolbox: document.getElementById('toolbox'),
                media: "./img/",
                zoom: {controls: true, wheel: true}
            });
        window.addEventListener('resize', onresize, false);
        onresize();
        Blockly.svgResize(workspace);
        workspace.addChangeListener(renderCode);
        workspace.addChangeListener(logCodeChange);
        //load setup loop block to workspace
        //Blockly.Xml.domToWorkspace(document.getElementById('startBlocks'), workspace);
    };

    function changeLanguage() {
        // Store the blocks for the duration of the reload.
        // This should be skipped for the index page, which has no blocks and does
        // not load Blockly.
        // Also store the recoring up till now.
        // MSIE 11 does not support sessionStorage on file:// URLs.
        if (typeof Blockly != 'undefined' && window.sessionStorage) {
            var xml = Blockly.Xml.workspaceToDom(workspace);
            var text = Blockly.Xml.domToText(xml);
            window.sessionStorage.loadOnceBlocks = text;
            window.sessionStorage.loadOnceRecording = recording;
            window;sessionStorage.loadOnceSessionId = sessionId;
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
    };

    /**
     * User's language (e.g. "en").
     * @type {string}
     */
    var LANG = getLang();

    function isRtl(){
        return false;
    };

    /**
     * Initialize the page language.
     */
    function initLanguage() {
      // Set the HTML's language and direction.
      var rtl = isRtl();
      document.dir = rtl ? 'rtl' : 'ltr';
      document.head.parentElement.setAttribute('lang', LANG);

      // Sort languages alphabetically.
      var languages = [];
      for (var lang in DwenguinoBlockly.LANGUAGE_NAME) {
        languages.push([DwenguinoBlockly.LANGUAGE_NAME[lang], lang]);
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
        if (lang == LANG) {
          option.selected = true;
        }
        languageMenu.options.add(option);
      }
      languageMenu.addEventListener('change', changeLanguage, true);

    };

    function doTranslation() {
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
            'catColour', 'catVariables', 'catFunctions', 'catBoardIO', 'catDwenguino'];
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
    }

    /**
     * Load blocks saved on App Engine Storage or in session/local storage.
     * @param {string} defaultXml Text representation of default blocks.
     */
    function loadBlocks(defaultXml) {
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
        Blockly.Xml.domToWorkspace(xml, workspace);
      } else if (defaultXml) {
        // Load the editor with default starting blocks.
        var xml = Blockly.Xml.textToDom(defaultXml);
        Blockly.Xml.domToWorkspace(xml, workspace);
        // Set empty recording
        recording = "";
      } else if ('BlocklyStorage' in window) {
        // Restore saved blocks in a separate thread so that subsequent
        // initialization is not affected from a failed load.
        window.setTimeout(BlocklyStorage.restoreBlocks, 0);
      }
    };

    function setWorkspaceBlockFromXml(xml){
        workspace.clear();
        try {
            var xmlDom = Blockly.Xml.textToDom(xml);
        } catch (e) {
            console.log("invalid xml");
            return;
        }
        Blockly.Xml.domToWorkspace(xmlDom, workspace);
    };

    function setupEnvironment(){
        initLanguage();
        doTranslation();
        injectBlockly();
        loadBlocks('<xml id="startBlocks" style="display: none">' + document.getElementById('startBlocks').innerHTML + '</xml>');
        initDwenguinoBlockly();
        doTranslation();
    };


$(document).ready(function(){
    setupEnvironment();
});
