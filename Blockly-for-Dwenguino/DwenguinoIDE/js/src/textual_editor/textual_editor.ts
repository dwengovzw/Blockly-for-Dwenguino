import BindMethods from "../utils/bindmethods.js";
import ErrorLog from "./error_log";
import EditorPane from "./editor_pane";
import DwenguinoCodeSamples from "./dwenguino_code_samples";
import LayoutConfig from "./layout_config";

class TextualEditor {
    _containerId:string = "";   // The id of the container div element into which the text editor has to be injected;
    _editorContainerId:string = ""
    _logContainerId:string = "";
    _menuContainerId:string = "";
    _panesContainerId:string = "";
    _rightPanesContainerId:string = "";
    _serialMonitorContainerId:string = "";
    $_editorContainer:JQuery;
    $_logContainer:JQuery;
    $_serialMonitorContainer:JQuery;
    $_menuContainer:JQuery;
    $_panesContainer:JQuery;
    $_rightPanesContainer:JQuery;
    _errorLog:ErrorLog;
    _editorPane:EditorPane;
    //_serialMonitor:SerialMonitor;
    /**
     * _containerId String id of the container into which the text editor has to be injected.
     */
    constructor(_containerId:string){
        BindMethods(this);
        this._containerId = _containerId;
        this._editorContainerId = "textual_editor_container";
        this._logContainerId = "textual_editor_log_container";
        this._menuContainerId = "textual_editor_menu";
        this._panesContainerId = "textual_editor_panes_container";
        this._rightPanesContainerId = "textual_editor_right_panes_container";
        this._serialMonitorContainerId = "textual_editor_serial_monitor_container";

        let container = $("#" + this._containerId);
        container.css({"display": "flex", "flex-direction": "column", "background-color": LayoutConfig.backgroundColor, "position": "relative"})

        this.$_menuContainer = $("<div>").attr("id", this._menuContainerId).attr("class", "row");
        this.$_menuContainer.css({"width": "100vw", "height": LayoutConfig.editorMenuHeight, "padding-left": "10px"});

        this.$_panesContainer = $("<div>").attr("id", this._panesContainerId);
        this.$_panesContainer.css({"position": "absolute", "top": LayoutConfig.editorMenuHeight, left: 0, right: 0, bottom: 0, display: "flex", "flex-direction": "row", width: "100vw", "overflow": "hidden"});
        
        this.$_rightPanesContainer = $("<div>").attr("id", this._rightPanesContainerId);
        this.$_rightPanesContainer.css({"display": "flex", "flex-direction": "column", "align-items": "stretch", "flex-grow": "1", "flex-basis": "50%"})
        
        this.$_serialMonitorContainer = $("<div>").attr("id", this._serialMonitorContainerId).css({"flex-grow": "1", "flex-basis": "50%", "max-height": "50%"});
        this.$_logContainer = $("<div>").attr("id", this._logContainerId).css({"flex-grow": "1", "flex-basis": "50%"});

        this.$_rightPanesContainer.append(this.$_logContainer);
        this.$_rightPanesContainer.append(this.$_serialMonitorContainer);

        this.$_editorContainer = $("<div>").attr("id", this._editorContainerId).css({"flex-grow": "1", "flex-basis": "50%", width: "50vw"});
        
        this.$_panesContainer.append(this.$_editorContainer);
        this.$_panesContainer.append(this.$_rightPanesContainer);

        container.append(this.$_menuContainer);
        container.append(this.$_panesContainer);

        this._errorLog = new ErrorLog(this._logContainerId);
        this._editorPane = new EditorPane(this._editorContainerId);
        this.$_serialMonitorContainer.html(`<serial-monitor serial-port-filters='[{"usbVendorId":54240}]'></serial-monitor>`)

        this.populateMenu();
    }

    closeTabs(notify=true){
      this._editorPane.closeTabs(notify);
    }

    populateMenu(){
        let iconStyle = {"color": LayoutConfig.foregroundColor, width: "20px", height: "20px", display: "inline-block", "margin-top": "10px", "margin-left": "20px"};
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
            .attr("class", "sim_item fas fa-book-open mytooltip my-dropdown-toggle")
            .css(iconStyle)
        examplesIcon.append($("<span class='mytooltiptext'>").text(DwenguinoBlocklyLanguageSettings.translate(["examples"])));
        let dropdown = $("<ul class='my-dropdown'>");
        for (let sampleName of Object.keys(DwenguinoCodeSamples)){
            let dropdownItem = $("<a href='#'>").text(sampleName)
            dropdownItem.on("click", () => {
                this.getEditorPane().openTab(DwenguinoCodeSamples[sampleName], `${sampleName}.cpp`);
                examplesIcon.next(".my-dropdown").slideToggle();
            })
            dropdown.append($("<li>").append(dropdownItem));
        }
        examplesIcon.on("click", function(){
            $(this).next(".my-dropdown").slideToggle();
        })

        this.$_menuContainer.append(copyItem);
        this.$_menuContainer.append(examplesIcon);
        this.$_menuContainer.append(dropdown);
    }

    fallbackCopyCodeToClipboard(text:string) {
        var textArea:any = document.createElement("dummy-text-area");
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
            $("#notification-copy").hide(500)
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
            $("#notification-copy").hide(500)
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

    looseFocus(){

    }

}

export default TextualEditor;