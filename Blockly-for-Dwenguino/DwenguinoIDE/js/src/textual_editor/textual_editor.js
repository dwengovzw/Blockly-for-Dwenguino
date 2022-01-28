import * as monaco from 'monaco-editor';

class TextualEditor {
    containerId = null;   // The id of the container div element into which the text editor has to be injected;
    editor = null;
    /**
     * containerId String id of the container into which the text editor has to be injected.
     */
    constructor(containerId){
        this.containerId = containerId;
    }

    renderEditor(code){
        let editorElement = $(`#${this.containerId}`); // Find the container element using jQuery
        editorElement.empty();  // Empty the element
        this.editor = monaco.editor.create(editorElement.get(0), {  // Add editor to element
            value: code.replace(/(\r\n|\r|\n){2}/g, '$1').replace(/(\r\n|\r|\n){3,}/g, '$1\n').trim(),
            language: 'cpp',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            readOnly: false,
            theme: 'vs-dark'
        });
        this.editor.getAction('editor.action.format').run()

    }

    getCurrentCode(){
        return this.editor.getValue();
    }

}

export default TextualEditor;