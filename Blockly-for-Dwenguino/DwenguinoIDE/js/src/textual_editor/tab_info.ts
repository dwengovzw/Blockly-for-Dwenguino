import BindMethods from "../utils/bindmethods.js"
import * as monaco from 'monaco-editor';

export { TabInfo }

type OnSaveStateChangedListener = (saveState: boolean) => void;

class TabInfo{
    _tabId:string;
    _tabTitle:string = ""
    _editorContainerId:string = ""
    _code:string = ""
    _editor:monaco.editor.IStandaloneCodeEditor;
    _saved:boolean = true;
    _onSaveStateChangedListeners:OnSaveStateChangedListener[] = [];

    static $_FALLBACKUUID = 0;

    constructor(code = "", title:string|null=null){
        BindMethods(this);
        // Fallback in non secure context. In non secure contexts the randomUUID function does not exist.
        if (crypto.randomUUID){
            this._tabId = crypto.randomUUID();
        }else{
            this._tabId = TabInfo.getFallbackId().toString();
        }
        
        this._tabTitle = title ? title : DwenguinoBlocklyLanguageSettings.translate(["defaultTabTitle"]);
        this._editorContainerId = `editor_${this._tabId}`;
        this._code = code;
        
    }

    // Fallback in non secure context. 
    static getFallbackId(){
        let currentId = TabInfo.$_FALLBACKUUID;
        TabInfo.$_FALLBACKUUID += 1;
        return currentId;
    }

    addOnSavedStateChangedListener(func: OnSaveStateChangedListener){
        this._onSaveStateChangedListeners.push(func);
    }

    renderEditor(){
        if (!this._editor){
            let container:HTMLElement = document.getElementById(this._editorContainerId) as HTMLElement
            this._editor = monaco.editor.create(container, {  // Add editor to element
                value: this._code,
                language: 'cpp',
                roundedSelection: false,
                scrollBeyondLastLine: false,
                readOnly: false,
                theme: 'vs-dark',
                //automaticLayout: true,
            });
        }else{
            let model = this._editor.getModel();
            if (model){
                model.setValue(this._code)
            }else{
                console.error("No text model found;")
            }
            
        }
        let txtModel = this._editor.getModel();
        if (txtModel){
            txtModel.onDidChangeContent((e) => {
                this.setSaved(false);
            })
        } else {
            console.error("Failed to add content change listener. Editor text model is null");
        }
        
    }

    getEditor():monaco.editor.IStandaloneCodeEditor{
        return this._editor;
    }

    getTabId():string{
        return this._tabId;
    }

    setTabId(id:string){
        this._tabId = id;
    }

    getTitle():string{
        return this._tabTitle;
    }

    setTitle(title:string){
        this._tabTitle = title;
    }

    getEditorContainerId():string{
        return this._editorContainerId;
    }

    setEditorContainerId(editorContainerId:string){
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

    setCode(code:string){
        let cleanedCode = code.replace(/(\r\n|\r|\n){2}/g, '$1').replace(/(\r\n|\r|\n){3,}/g, '$1\n').trim();
        this._code = cleanedCode;
        this._editor.getModel() ? (this._editor.getModel() as monaco.editor.ITextModel).setValue(cleanedCode) : null
        this.setSaved(false);
    }

    setSaved(saved:boolean){
        if (this._saved != saved){
            this._onSaveStateChangedListeners.forEach((listener) => listener(saved)); // Notify listerners of save state change.
        }
        this._saved = saved;
    }

    getSaved(){
        return this._saved;
    }

    createGlobalDependencyProposals(range:any){
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

   

    createDCmotorDependencyProposals(range:any){

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