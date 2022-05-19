import * as monaco from 'monaco-editor';
import BindMethods from "../utils/bindmethods.js"
import ErrorLog from "./error_log.js"
import EditorPane from "./editor_pane.js"
import DwenguinoCodeSamples from "./dwenguino_code_samples.js"

class TextualEditor {
    _containerId = null;   // The id of the container div element into which the text editor has to be injected;
    _editorContainerId = null;
    _logContainerId = null;
    _menuContainerId = null;
    _panesContainerId = null;
    $_editorContainer = null;
    $_logContainer = null;
    $_menuContainer = null;
    $_panesContainer = null;
    _errorLog = null;
    _editorPane = null;
    /**
     * _containerId String id of the container into which the text editor has to be injected.
     */
    constructor(_containerId){
        BindMethods(this);
        this._containerId = _containerId;
        this._editorContainerId = "textual_editor_container";
        this._logContainerId = "textual_editor_log_container";
        this._menuContainerId = "textual_editor_menu";
        this._panesContainerId = "textual_editor_panes_container";

        let container = $("#" + this._containerId);
        container.css({"display": "flex", "flex-direction": "column", "background-color": "#1e1e1e", "position": "relative"})

        this.$_menuContainer = $("<div>").attr("id", this._menuContainerId).attr("class", "row");
        this.$_menuContainer.css({"width": "100vw", "height": "40px", "padding-left": "10px"});

        this.$_panesContainer = $("<div>").attr("id", this._panesContainerId);
        this.$_panesContainer.css({"position": "absolute", "top": "40px", left: 0, right: 0, bottom: 0, display: "flex", "flex-direction": "row", width: "100vw", "overflow": "hidden"});
        this.$_editorContainer = $("<div>").attr("id", this._editorContainerId).css({"flex-grow": "1", "flex-basis": "50%", width: "50vw"});
        this.$_logContainer = $("<div>").attr("id", this._logContainerId).css({"flex-grow": "1", "flex-basis": "50%"});
        
        this.$_panesContainer.append(this.$_editorContainer);
        this.$_panesContainer.append(this.$_logContainer);

        container.append(this.$_menuContainer);
        container.append(this.$_panesContainer);

        this._errorLog = new ErrorLog(this._logContainerId);
        this._editorPane = new EditorPane(this._editorContainerId);

        this.populateMenu();
    }

    populateMenu(){
        let menuItems = []
        let iconStyle = {"color": "#8bab42", width: "20px", height: "20px", display: "inline-block", "margin-top": "10px", "margin-left": "20px"};
        let copyItem = $("<span>")
            .attr("id", "copy-code")
            .attr("class", "mytooltip sim_item fas fa-copy")
            .css(iconStyle);
        copyItem.append($("<span class='mytooltiptext'>").text(DwenguinoBlocklyLanguageSettings.translate(["copy"])));
        copyItem.on("click", ev => {
            this.copyCodeToClipboard();
        })
        let examplesIcon = $("<span>")
            .attr("id", "show-examples")
            .attr("class", "sim_item fas fa-book-open my-dropdown-toggle")
            .css(iconStyle)
        examplesIcon.append($("<span class='mytooltiptext'>").text(DwenguinoBlocklyLanguageSettings.translate(["examples"])));
        let dropdown = $("<ul class='my-dropdown'>");
        for (let sampleName of Object.keys(DwenguinoCodeSamples)){
            let dropdownItem = $("<a href='#'>").text(sampleName)
            dropdownItem.on("click", () => {
                this.getEditorPane().renderEditor(DwenguinoCodeSamples[sampleName]);
                examplesIcon.next(".my-dropdown").slideToggle();
            })
            dropdown.append($("<li>").append(dropdownItem));
        }
        examplesIcon.on("click", function(){
            $(this).next(".my-dropdown").slideToggle();
        })


        menuItems.push(copyItem);
        menuItems.push(examplesIcon);
        menuItems.push(dropdown)

        for (let menuItem of menuItems){
            this.$_menuContainer.append(menuItem);
        }
    }

    fallbackCopyCodeToClipboard(text) {
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
          $('#notification-copy').text(DwenguinoBlocklyLanguageSettings.translate(['arduinoCodeCopied']));
          setTimeout(function() {
            $("#notification-copy").hide('blind', {}, 500)
          }, 3000);
        } catch (err) {
          console.error('Unable to copy Arduino code: ', err);
        }
      
        document.body.removeChild(textArea);
      }
  
      copyCodeToClipboard(){
        let code = this.getEditorPane().getCurrentCode();
        if (!navigator.clipboard) {
          this.fallbackCopyCodeToClipboard(code);
          return;
        }
        navigator.clipboard.writeText(code).then(function() {
          $('#notification-copy').show();
          $('#notification-copy').text(DwenguinoBlocklyLanguageSettings.translate(['arduinoCodeCopied']));
          setTimeout(function() {
            $("#notification-copy").hide('blind', {}, 500)
          }, 3000);
        }, function(err) {
          console.error('Unable to copy Arduino code: ', err);
        });
      }

    getErrorLog(){
        return this._errorLog;
    }

    getEditorPane(){
        return this._editorPane;
    }

}

export default TextualEditor;