import BindMethods from "../utils/bindmethods.js"
import * as monaco from 'monaco-editor';

export { TabInfo }

class TabInfo{
    _tabId = 0;
    _tabTitle = ""
    _editorContainerId = ""
    _code = ""
    _editor = null;

    constructor(code = "", title=null){
        BindMethods(this);
        this._tabId = crypto.randomUUID();
        this._tabTitle = title ? title : DwenguinoBlocklyLanguageSettings.translate(["defaultTabTitle"]);
        this._editorContainerId = `editor_${this._tabId}`;
        this._code = code;
        
    }

    renderEditor(){
        if (!this._editor){
            this._editor = monaco.editor.create(document.getElementById(this._editorContainerId), {  // Add editor to element
                value: this._code,
                language: 'cpp',
                roundedSelection: false,
                scrollBeyondLastLine: false,
                readOnly: false,
                theme: 'vs-dark',
                //automaticLayout: true,
            });
        }else{
            this._editor.getModel().setValue(this._code)
        }

    }

    getEditor(){
        return this._editor;
    }

    getTabId(){
        return this._tabId;
    }

    setTabId(id){
        this._tabId = id;
    }

    getTitle(){
        return this._tabTitle;
    }

    setTitle(title){
        this._tabTitle = title;
    }

    getEditorContainerId(){
        return this._editorContainerId;
    }

    setEditorContainerId(editorContainerId){
        this._editorContainerId = editorContainerId;
    }

    getCode(){
        if (this._editor){
            this._code = this._editor.getValue();
            return this._code;
        } else {
            return ""
        }
        
    }

    setCode(code){
        let cleanedCode = code.replace(/(\r\n|\r|\n){2}/g, '$1').replace(/(\r\n|\r|\n){3,}/g, '$1\n').trim();
        this._code = cleanedCode;
        this._editor.getModel().setValue(cleanedCode)
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