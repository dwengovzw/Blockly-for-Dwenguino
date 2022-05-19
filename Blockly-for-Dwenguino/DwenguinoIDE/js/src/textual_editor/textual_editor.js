import * as monaco from 'monaco-editor';
import BindMethods from "../utils/bindmethods.js"
import ErrorLog from "./error_log.js"
import EditorPane from "./editor_pane.js"

class TextualEditor {
    _containerId = null;   // The id of the container div element into which the text editor has to be injected;
    _editorContainerId = null;
    _logContainerId = null;
    $_editorContainer = null;
    $_logContainer = null;
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

        let container = $("#" + _containerId).css({display: "flex", "flex-direction": "row", width: "100vw", "overflow": "hidden"});
        this.$_editorContainer = $("<div>").attr("id", this._editorContainerId).css({"flex-grow": "1", "flex-basis": "50%", width: "50vw"});
        this.$_logContainer = $("<div>").attr("id", this._logContainerId).css({"flex-grow": "1", "flex-basis": "50%"});
        
        container.append(this.$_editorContainer);
        container.append(this.$_logContainer);

        this._errorLog = new ErrorLog(this._logContainerId);
        this._editorPane = new EditorPane(this._editorContainerId);
    }

    getErrorLog(){
        return this._errorLog;
    }

    getEditorPane(){
        return this._editorPane;
    }

}

export default TextualEditor;