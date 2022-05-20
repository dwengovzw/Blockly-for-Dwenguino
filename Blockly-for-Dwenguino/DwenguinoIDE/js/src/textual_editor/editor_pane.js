import BindMethods from "../utils/bindmethods.js"
import * as monaco from 'monaco-editor';
import LayoutConfig from "./layout_config.js";

class EditorPane{
    _containerId = null;
    _headerId = null;
    _editorId = null;
    _editor = null;
    $_container = null;
    $_editorPaneEditorContainer = null;
    $_headerContainer = null;

    constructor(containerId){
        BindMethods(this);
        this._containerId = containerId;

        this._headerId = "editor_pane_header";
        this._editorId = "editor_pane_editor"

        this.$_container = $("#" + this._containerId);
        this.$_headerContainer = $("<div>").attr("id", this._headerId);
        this.$_headerContainer.html("Editor");

        this.$_editorPaneEditorContainer = $("<div>").attr("id", this._editorId);
        
        this.$_container.append(this.$_headerContainer);
        this.$_container.append(this.$_editorPaneEditorContainer);

        this.initStyle();
 
        this.registerCompletionProviders();
    }
    /**
     * @brief Set the style of the editor pane
     */
    initStyle(){
        this.$_container.css({"display": "flex", "flex-direction": "column", "background-color": LayoutConfig.backgroundColor, "color": LayoutConfig.foregroundColor, "padding-right": "1px"});
        this.$_headerContainer.css({"height": LayoutConfig.paneHeaderHeight, "padding-left": "10px", "padding-top": "5px", "font-weight": "bold", "border-bottom": `solid ${LayoutConfig.borderColor} 1px`, "border-top": `solid ${LayoutConfig.borderColor} 1px`});
        this.$_editorPaneEditorContainer.css({"flex-grow": "1", "padding-top": "10px"});
    }

    renderEditor(code){
        let cleanedCode = code.replace(/(\r\n|\r|\n){2}/g, '$1').replace(/(\r\n|\r|\n){3,}/g, '$1\n').trim();
        if (!this._editor){
            this._editor = monaco.editor.create(document.getElementById(this._editorId), {  // Add editor to element
                value: cleanedCode,
                language: 'cpp',
                roundedSelection: false,
                scrollBeyondLastLine: false,
                readOnly: false,
                theme: 'vs-dark',
                //automaticLayout: true,
            });
        }else{
            this._editor.getModel().setValue(cleanedCode)
        }

    }

    getCurrentCode(){
        return this._editor.getValue();
    }

    createGlobalDependencyProposals(range){
        return [
            {
                label: 'digitalWrite',
                kind: monaco.languages.CompletionItemKind.Function,
                documentation: "digitalWrite(pin, value);",
                insertText: 'digitalWrite',
                range: range
            },
            {
                label: "initDwenguino",
                kind: monaco.languages.CompletionItemKind.Function,
                documentation: "Initialization routine for the Dwenguino board. Enables LEDS, enables all switches and sets BUZZER. Additionally the LCD is initialized by this function.",
                insertText: "initDwenguino",
                range: range
            },
            {
                label: "DCMotor",
                kind: monaco.languages.CompletionItemKind.Class,
                documentation: "DC Motor Class",
                insertText: "DCMotor",
                range: range
            },
            {
                label: "DCMotor",
                kind: monaco.languages.CompletionItemKind.Function,
                documentation: "DC Motor Class constructor",
                insertText: "DCMotor",
                range: range
            },
            {
                label: "DCMotor",
                kind: monaco.languages.CompletionItemKind.Function,
                documentation: "DC Motor Class constructor. DCMotor(uint8_t motor_PWM_pin, uint8_t motor_DIR_pin)",
                insertText: "DCMotor",
                range: range
            }
            ,
            {
                label: "init",
                kind: monaco.languages.CompletionItemKind.Function,
                documentation: "DC Motor init function",
                insertText: "init",
                range: range
            },
            {
                label: "setSpeed",
                kind: monaco.languages.CompletionItemKind.Function,
                documentation: "DC Motor set speed",
                insertText: "setSpeed",
                range: range
            }
        ]
    }

   

    createDCmotorDependencyProposals(range){

    }

    registerCompletionProviders(){
        monaco.languages.registerCompletionItemProvider('cpp', {
            provideCompletionItems: (model, position) => {
                var word = model.getWordUntilPosition(position);
                var range = {
                    startLineNumber: position.lineNumber,
                    endLineNumber: position.lineNumber,
                    startColumn: word.startColumn,
                    endColumn: word.endColumn
                };
                return {
                    suggestions: this.createGlobalDependencyProposals(range)
                };
            }
        });
    }
}

export default EditorPane;