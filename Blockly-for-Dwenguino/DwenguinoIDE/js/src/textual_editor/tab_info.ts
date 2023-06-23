import BindMethods from "../utils/bindmethods.js"
import * as monaco from 'monaco-editor';

var intellisensSuggestionsCreated = false;

export { TabInfo }

type OnSaveStateChangedListener = (saveState: boolean) => void;

class TabInfo{
    _tabId:string;
    _tabTitle:string = ""
    _editorContainerId:string = ""
    _code:string = ""
    _editor:monaco.editor.IStandaloneCodeEditor;
    _saved:boolean = false;
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

        if (!intellisensSuggestionsCreated){
            this.registerCompletionProviders();
            intellisensSuggestionsCreated = true;
        }
        
        
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
            // Many thanks to gpt for this.
            { label: 'pinMode', kind: monaco.languages.CompletionItemKind.Function, insertText: 'pinMode(${1:pin}, ${2:mode});', documentation: 'Configures the specified pin to behave either as an input or an output.', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet },
            { label: 'digitalWrite', kind: monaco.languages.CompletionItemKind.Function, insertText: 'digitalWrite(${1:pin}, ${2:value});', documentation: 'Writes a HIGH or LOW value to a digital pin.', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet },
            { label: 'digitalRead', kind: monaco.languages.CompletionItemKind.Function, insertText: 'digitalRead(${1:pin});', documentation: 'Reads the value from a specified digital pin.', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet },
            { label: 'analogReference', kind: monaco.languages.CompletionItemKind.Function, insertText: 'analogReference(${1:type});', documentation: 'Sets the reference voltage for analog input (default is the system voltage).', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet },
            { label: 'analogRead', kind: monaco.languages.CompletionItemKind.Function, insertText: 'analogRead(${1:pin});', documentation: 'Reads the value from the specified analog pin.', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet },
            { label: 'analogWrite', kind: monaco.languages.CompletionItemKind.Function, insertText: 'analogWrite(${1:pin}, ${2:value});', documentation: 'Writes an analog value (PWM wave) to a pin.', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet },
            { label: 'tone', kind: monaco.languages.CompletionItemKind.Function, insertText: 'tone(${1:pin}, ${2:frequency}, ${3:duration});', documentation: 'Generates a square wave of the specified frequency on a pin.', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet },
            { label: 'noTone', kind: monaco.languages.CompletionItemKind.Function, insertText: 'noTone(${1:pin});', documentation: 'Stops the generation of a square wave on a pin.', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet },
            { label: 'delay', kind: monaco.languages.CompletionItemKind.Function, insertText: 'delay(${1:milliseconds});', documentation: 'Pauses the program for the specified time (in milliseconds).', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet },
            { label: 'millis', kind: monaco.languages.CompletionItemKind.Function, insertText: 'millis();', documentation: 'Returns the number of milliseconds since the Arduino board began running the current program.', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet },
            { label: 'micros', kind: monaco.languages.CompletionItemKind.Function, insertText: 'micros();', documentation: 'Returns the number of microseconds since the Arduino board began running the current program.', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet },
            { label: 'pulseIn', kind: monaco.languages.CompletionItemKind.Function, insertText: 'pulseIn(${1:pin}, ${2:value}, ${3:timeout});', documentation: 'Reads a pulse (either HIGH or LOW) on a pin and returns its duration in microseconds.', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet },
            { label: 'shiftOut', kind: monaco.languages.CompletionItemKind.Function, insertText: 'shiftOut(${1:dataPin}, ${2:clockPin}, ${3:bitOrder}, ${4:value});', documentation: 'Shifts out a byte of data one bit at a time.', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet },
            { label: 'shiftIn', kind: monaco.languages.CompletionItemKind.Function, insertText: 'shiftIn(${1:dataPin}, ${2:clockPin}, ${3:bitOrder});', documentation: 'Shifts in a byte of data one bit at a time.', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet },
            { label: 'attachInterrupt', kind: monaco.languages.CompletionItemKind.Function, insertText: 'attachInterrupt(${1:interrupt}, ${2:functionName}, ${3:mode});', documentation: 'Configures an interrupt to be triggered on a specific pin.', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet },
            { label: 'detachInterrupt', kind: monaco.languages.CompletionItemKind.Function, insertText: 'detachInterrupt(${1:interrupt});', documentation: 'Turns off the interrupt on the specified pin.', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet },
            { label: 'noInterrupts', kind: monaco.languages.CompletionItemKind.Function, insertText: 'noInterrupts();', documentation: 'Disables interrupts (pauses interrupt service routines).', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet },
            { label: 'interrupts', kind: monaco.languages.CompletionItemKind.Function, insertText: 'interrupts();', documentation: 'Enables interrupts (resumes interrupt service routines).', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet },
            { label: 'Serial', kind: monaco.languages.CompletionItemKind.Module, insertText: 'Serial', documentation: 'The Serial object allows communication with a computer or other devices.' },
            { label: 'Serial.begin', kind: monaco.languages.CompletionItemKind.Function, insertText: 'Serial.begin(${1:baudRate});', documentation: 'Sets the data rate in bits per second (baud) for serial data transmission.', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet },
            { label: 'Serial.end', kind: monaco.languages.CompletionItemKind.Function, insertText: 'Serial.end();', documentation: 'Ends the serial communication and releases the serial port.', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet },
            { label: 'Serial.available', kind: monaco.languages.CompletionItemKind.Function, insertText: 'Serial.available();', documentation: 'Gets the number of bytes available for reading from the serial port.', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet },
            { label: 'Serial.read', kind: monaco.languages.CompletionItemKind.Function, insertText: 'Serial.read();', documentation: 'Reads incoming serial data.', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet },
            { label: 'Serial.write', kind: monaco.languages.CompletionItemKind.Function, insertText: 'Serial.write(${1:data});', documentation: 'Sends binary data to the serial port.', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet },
            { label: 'EEPROM', kind: monaco.languages.CompletionItemKind.Module, insertText: 'EEPROM', documentation: 'The EEPROM object allows reading and writing of EEPROM memory.', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet },
            { label: 'EEPROM.write', kind: monaco.languages.CompletionItemKind.Function, insertText: 'EEPROM.write(${1:address}, ${2:value});', documentation: 'Writes a byte to the specified EEPROM address.', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet },
            { label: 'EEPROM.read', kind: monaco.languages.CompletionItemKind.Function, insertText: 'EEPROM.read(${1:address});', documentation: 'Reads a byte from the specified EEPROM address.', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet },
            { label: 'random', kind: monaco.languages.CompletionItemKind.Function, insertText: 'random(${1:max});', documentation: 'Generates pseudo-random numbers.', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet },
            { label: 'randomSeed', kind: monaco.languages.CompletionItemKind.Function, insertText: 'randomSeed(${1:seed});', documentation: 'Seeds the random number generator with a value.', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet },
            { label: 'map', kind: monaco.languages.CompletionItemKind.Function, insertText: 'map(${1:value}, ${2:fromLow}, ${3:fromHigh}, ${4:toLow}, ${5:toHigh});', documentation: 'Re-maps a value from one range to another.', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet },
            { label: 'constrain', kind: monaco.languages.CompletionItemKind.Function, insertText: 'constrain(${1:value}, ${2:min}, ${3:max});', documentation: 'Limits a value to a specified range.', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet },
            { label: 'pow', kind: monaco.languages.CompletionItemKind.Function, insertText: 'pow(${1:base}, ${2:exponent});', documentation: 'Calculates the value of a number raised to a power.', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet },
            { label: 'sqrt', kind: monaco.languages.CompletionItemKind.Function, insertText: 'sqrt(${1:value});', documentation: 'Calculates the square root of a number.', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet },
            { label: 'abs', kind: monaco.languages.CompletionItemKind.Function, insertText: 'abs(${1:value});', documentation: 'Returns the absolute value of a number.' },
            { label: 'max', kind: monaco.languages.CompletionItemKind.Function, insertText: 'max(${1:value1}, ${2:value2});', documentation: 'Returns the maximum of two or more numbers.', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet },
            { label: 'min', kind: monaco.languages.CompletionItemKind.Function, insertText: 'min(${1:value1}, ${2:value2});', documentation: 'Returns the minimum of two or more numbers.', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet },
            { label: 'round', kind: monaco.languages.CompletionItemKind.Function, insertText: 'round(${1:value});', documentation: 'Rounds a number to the nearest whole number.', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet },
            { label: 'radians', kind: monaco.languages.CompletionItemKind.Function, insertText: 'radians(${1:degrees});', documentation: 'Converts degrees to radians.', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet },
            { label: 'degrees', kind: monaco.languages.CompletionItemKind.Function, insertText: 'degrees(${1:radians});', documentation: 'Converts radians to degrees.' },
            { label: 'sin', kind: monaco.languages.CompletionItemKind.Function, insertText: 'sin(${1:value});', documentation: 'Calculates the sine of an angle.', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet },
            { label: 'cos', kind: monaco.languages.CompletionItemKind.Function, insertText: 'cos(${1:value});', documentation: 'Calculates the cosine of an angle.', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet },
            { label: 'tan', kind: monaco.languages.CompletionItemKind.Function, insertText: 'tan(${1:value});', documentation: 'Calculates the tangent of an angle.', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet },
            { label: 'isAlpha', kind: monaco.languages.CompletionItemKind.Function, insertText: 'isAlpha(${1:char});', documentation: 'Checks for an alphabetic character.', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet },
            { label: 'isAlphaNumeric', kind: monaco.languages.CompletionItemKind.Function, insertText: 'isAlphaNumeric(${1:char});', documentation: 'Checks for an alphanumeric character.', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet },
            { label: 'isAscii', kind: monaco.languages.CompletionItemKind.Function, insertText: 'isAscii(${1:char});', documentation: 'Checks for a ASCII character.', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet },
            { label: 'isWhitespace', kind: monaco.languages.CompletionItemKind.Function, insertText: 'isWhitespace(${1:char});', documentation: 'Checks for a whitespace character.', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet },
            { label: 'isControl', kind: monaco.languages.CompletionItemKind.Function, insertText: 'isControl(${1:char});', documentation: 'Checks for a control character.', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet },
            { label: 'isDigit', kind: monaco.languages.CompletionItemKind.Function, insertText: 'isDigit(${1:char});', documentation: 'Checks for a digit (0 through 9).', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet },
            { label: 'isGraph', kind: monaco.languages.CompletionItemKind.Function, insertText: 'isGraph(${1:char});', documentation: 'Checks for a printable character that is not a space.', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet },

            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: "initDwenguino()", kind: monaco.languages.CompletionItemKind.Function, documentation: "Initialization routine for the Dwenguino board. Enables LEDS, enables all switches and sets BUZZER. Additionally the LCD is initialized by this function.", insertText: "initDwenguino()", range: range },
             // Control Structures
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: 'if', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'if (${1:condition}) {\n\t${2: // code}\n}', documentation: 'Executes a statement if a specified condition is true.' },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: 'else', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'else {\n\t${1: // code}\n}', documentation: 'Executes a statement if the same if condition is false.' },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: 'else if', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'else if (${1:condition}) {\n\t${2: // code}\n}', documentation: 'Executes a statement if the previous if condition is false and the current condition is true.' },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: 'while', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'while (${1:condition}) {\n\t${2: // code}\n}', documentation: 'Executes a statement repeatedly as long as a specified condition is true.' },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: 'do while', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'do {\n\t${1: // code}\n} while (${2:condition});', documentation: 'Executes a statement repeatedly until the specified condition is false.' },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: 'for', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'for (${1:init}; ${2:condition}; ${3:increment}) {\n\t${4: // code}\n}', documentation: 'Creates a loop that consists of three optional expressions.' },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: 'switch', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'switch (${1:variable}) {\n\tcase ${2:value}:\n\t\t${3: // code}\n\t\tbreak;\n\tdefault:\n\t\t${4: // code}\n}', documentation: 'Evaluates an expression, matching the expression\'s value to a case clause, and executes the statements associated with that case.' },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: 'case', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'case ${1:value}:\n\t${2: // code}\n\tbreak;', documentation: 'Specifies a new constant value as the target for a subsequent case statement.' },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: 'break', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'break;', documentation: 'Terminates the current loop, switch, or label statement and transfers program control to the statement following the terminated statement.' },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: 'continue', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'continue;', documentation: 'Skips the rest of the current iteration and continues to the next iteration of the loop.' },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: 'return', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'return ${1:value};', documentation: 'Exits the current function and returns a value (optional).' },
            
            // Data Types
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: 'boolean', kind: monaco.languages.CompletionItemKind.Class, insertText: 'boolean', documentation: 'A data type that can store either "true" or "false".' },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: 'byte', kind: monaco.languages.CompletionItemKind.Class, insertText: 'byte', documentation: 'An 8-bit data type that can store values from 0 to 255.' },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: 'char', kind: monaco.languages.CompletionItemKind.Class, insertText: 'char', documentation: 'A data type that can store a single character.' },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: 'unsigned char', kind: monaco.languages.CompletionItemKind.Class, insertText: 'unsigned char', documentation: 'An 8-bit unsigned data type that can store values from 0 to 255.' },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: 'word', kind: monaco.languages.CompletionItemKind.Class, insertText: 'word', documentation: 'A data type that can store values from 0 to 65535.' },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: 'unsigned int', kind: monaco.languages.CompletionItemKind.Class, insertText: 'unsigned int', documentation: 'A 16-bit unsigned data type that can store values from 0 to 65535.' },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: 'int', kind: monaco.languages.CompletionItemKind.Class, insertText: 'int', documentation: 'A 16-bit data type that can store values from -32768 to 32767.' },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: 'unsigned long', kind: monaco.languages.CompletionItemKind.Class, insertText: 'unsigned long', documentation: 'A 32-bit unsigned data type that can store values from 0 to 4294967295.' },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: 'long', kind: monaco.languages.CompletionItemKind.Class, insertText: 'long', documentation: 'A 32-bit data type that can store values from -2147483648 to 2147483647.' },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: 'float', kind: monaco.languages.CompletionItemKind.Class, insertText: 'float', documentation: 'A data type that can store floating-point numbers with decimal places.' },

            // DCMotor class
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: 'DCMotor', kind: monaco.languages.CompletionItemKind.Class, insertText: 'DCMotor(${1:motor_PWM_pin}, ${2:motor_DIR_pin});', documentation: 'Constructs a DCMotor object with the specified motor pins.' },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: 'init', kind: monaco.languages.CompletionItemKind.Method, insertText: 'init();', documentation: 'Initializes the DCMotor object.' },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: 'setSpeed', kind: monaco.languages.CompletionItemKind.Method, insertText: 'setSpeed(${1:speed});', documentation: 'Sets the speed of the motor to the specified value.' },
  
            // LCD class
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: 'dwenguinoLCD', kind: monaco.languages.CompletionItemKind.Class, insertText: 'dwenguinoLCD', documentation: 'The default LCD object for the LCD on the Dwenguino board.' },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: 'dwenguinoLCD.clear', kind: monaco.languages.CompletionItemKind.Method, insertText: 'dwenguinoLCD.clear();', documentation: 'Clears the LCD display.' },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: 'dwenguinoLCD.backlightOn', kind: monaco.languages.CompletionItemKind.Method, insertText: 'dwenguinoLCD.backlightOn();', documentation: 'Turns on the backlight of the LCD.' },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: 'dwenguinoLCD.backlightOff', kind: monaco.languages.CompletionItemKind.Method, insertText: 'dwenguinoLCD.backlightOff();', documentation: 'Turns off the backlight of the LCD.' },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: 'dwenguinoLCD.write', kind: monaco.languages.CompletionItemKind.Method, insertText: 'dwenguinoLCD.write(${1:data});', documentation: 'Writes a character to the LCD display.' },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: 'dwenguinoLCD.command', kind: monaco.languages.CompletionItemKind.Method, insertText: 'dwenguinoLCD.command(${1:cmd});', documentation: 'Sends a command to the LCD controller.' },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: 'dwenguinoLCD.setCursor', kind: monaco.languages.CompletionItemKind.Method, insertText: 'dwenguinoLCD.setCursor(${1:col}, ${2:row});', documentation: 'Sets where the next character will be shown on the LCD.' },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: 'dwenguinoLCD.print', kind: monaco.languages.CompletionItemKind.Method, insertText: 'dwenguinoLCD.print(${1:text});', documentation: 'Print string from current cursor position.' },

            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: 'BufferedLCD', kind: monaco.languages.CompletionItemKind.Constructor, insertText: 'BufferedLCD(${1:rs}, ${2:rw}, ${3:enable}, ${4:d0}, ${5:d1}, ${6:d2}, ${7:d3}, ${8:d4}, ${9:d5}, ${10:d6}, ${11:d7}, ${12:data});', documentation: 'Constructs a BufferedLCD object with the specified pins and data.' },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: 'BufferedLCD', kind: monaco.languages.CompletionItemKind.Class, insertText: 'BufferedLCD;', documentation: 'Constructs a BufferedLCD object with the specified pins and data.' },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: 'clear', kind: monaco.languages.CompletionItemKind.Method, insertText: 'clear();', documentation: 'Clears the LCD display.' },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: 'backlightOn', kind: monaco.languages.CompletionItemKind.Method, insertText: 'backlightOn();', documentation: 'Turns on the backlight of the LCD.' },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: 'backlightOff', kind: monaco.languages.CompletionItemKind.Method, insertText: 'backlightOff();', documentation: 'Turns off the backlight of the LCD.' },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: 'write', kind: monaco.languages.CompletionItemKind.Method, insertText: 'write(${1:data});', documentation: 'Writes a character to the LCD display.' },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: 'command', kind: monaco.languages.CompletionItemKind.Method, insertText: 'command(${1:cmd});', documentation: 'Sends a command to the LCD controller.' },

            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: "LiquidCrystal", kind: "class", insertText: "LiquidCrystal", documentation: "The LiquidCrystal class provides methods to control a character LCD display." },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: "LiquidCrystal", kind: "constructor", insertText: "LiquidCrystal(${1:uint8_t rs}, ${2:uint8_t enable}, ${3:uint8_t d0}, ${4:uint8_t d1}, ${5:uint8_t d2}, ${6:uint8_t d3}, ${7:uint8_t d4}, ${8:uint8_t d5}, ${9:uint8_t d6}, ${10:uint8_t d7});", documentation: "Constructs a LiquidCrystal object with 8-bit data mode." },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: "LiquidCrystal", kind: "constructor", insertText: "LiquidCrystal(${1:uint8_t rs}, ${2:uint8_t rw}, ${3:uint8_t enable}, ${4:uint8_t d0}, ${5:uint8_t d1}, ${6:uint8_t d2}, ${7:uint8_t d3}, ${8:uint8_t d4}, ${9:uint8_t d5}, ${10:uint8_t d6}, ${11:uint8_t d7});", documentation: "Constructs a LiquidCrystal object with 8-bit data mode and read/write control." },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: "LiquidCrystal", kind: "constructor", insertText: "LiquidCrystal(${1:uint8_t rs}, ${2:uint8_t rw}, ${3:uint8_t enable}, ${4:uint8_t d0}, ${5:uint8_t d1}, ${6:uint8_t d2}, ${7:uint8_t d3});", documentation: "Constructs a LiquidCrystal object with 4-bit data mode and read/write control." },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: "LiquidCrystal", kind: "constructor", insertText: "LiquidCrystal(${1:uint8_t rs}, ${2:uint8_t enable}, ${3:uint8_t d0}, ${4:uint8_t d1}, ${5:uint8_t d2}, ${6:uint8_t d3});", documentation: "Constructs a LiquidCrystal object with 4-bit data mode." },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: "init", kind: "method", insertText: "init(${1:uint8_t fourbitmode}, ${2:uint8_t rs}, ${3:uint8_t rw}, ${4:uint8_t enable}, ${5:uint8_t d0}, ${6:uint8_t d1}, ${7:uint8_t d2}, ${8:uint8_t d3}, ${9:uint8_t d4}, ${10:uint8_t d5}, ${11:uint8_t d6}, ${12:uint8_t d7});", documentation: "Initializes the LiquidCrystal object." },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: "begin", kind: "method", insertText: "begin(${1:uint8_t cols}, ${2:uint8_t rows}, ${3:uint8_t charsize = LCD_5x8DOTS});", documentation: "Initializes the LCD display with the specified number of columns, rows, and character size." },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: "clear", kind: "method", insertText: "clear();", documentation: "Clears the LCD display." },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: "home", kind: "method", insertText: "home();", documentation: "Sets the LCD cursor to the home position." },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: "noDisplay", kind: "method", insertText: "noDisplay();", documentation: "Turns off the LCD display." },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: "display", kind: "method", insertText: "display();", documentation: "Turns on the LCD display." },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: "noBlink", kind: "method", insertText: "noBlink();", documentation: "Turns off the blinking cursor." },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: "blink", kind: "method", insertText: "blink();", documentation: "Turns on the blinking cursor." },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: "noCursor", kind: "method", insertText: "noCursor();", documentation: "Hides the LCD cursor." },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: "cursor", kind: "method", insertText: "cursor();", documentation: "Shows the LCD cursor." },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: "scrollDisplayLeft", kind: "method", insertText: "scrollDisplayLeft();", documentation: "Scrolls the contents of the display one position to the left." },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: "scrollDisplayRight", kind: "method", insertText: "scrollDisplayRight();", documentation: "Scrolls the contents of the display one position to the right." },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: "leftToRight", kind: "method", insertText: "leftToRight();", documentation: "Sets the text direction from left to right." },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: "rightToLeft", kind: "method", insertText: "rightToLeft();", documentation: "Sets the text direction from right to left." },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: "autoscroll", kind: "method", insertText: "autoscroll();", documentation: "Enables auto-scrolling of the LCD." },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: "noAutoscroll", kind: "method", insertText: "noAutoscroll();", documentation: "Disables auto-scrolling of the LCD." },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: "setRowOffsets", kind: "method", insertText: "setRowOffsets(${1:int row1}, ${2:int row2}, ${3:int row3}, ${4:int row4});", documentation: "Sets the row offsets for the LCD display." },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: "createChar", kind: "method", insertText: "createChar(${1:uint8_t}, ${2:uint8_t[]});", documentation: "Creates a custom character for the LCD display." },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: "setCursor", kind: "method", insertText: "setCursor(${1:uint8_t}, ${2:uint8_t});", documentation: "Sets the cursor position on the LCD display." },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: "write", kind: "method", insertText: "write(${1:uint8_t});", documentation: "Writes a character to the LCD display." },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: "command", kind: "method", insertText: "command(${1:uint8_t});", documentation: "Sends a command to the LCD display." },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: "write", kind: "method", insertText: "write(${1:uint8_t});", documentation: "Writes a character to the LCD display." },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: "send", kind: "method", insertText: "send(${1:uint8_t}, ${2:uint8_t});", documentation: "Sends data or a command to the LCD display." },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: "write4bits", kind: "method", insertText: "write4bits(${1:uint8_t});", documentation: "Writes 4 bits of data to the LCD display." },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: "write8bits", kind: "method", insertText: "write8bits(${1:uint8_t});", documentation: "Writes 8 bits of data to the LCD display." },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: "pulseEnable", kind: "method", insertText: "pulseEnable();", documentation: "Pulses the enable pin to latch data/command to the LCD." },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: "_rs_pin", kind: "property", insertText: "_rs_pin", documentation: "The pin connected to the RS (Register Select) pin of the LCD." },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: "_rw_pin", kind: "property", insertText: "_rw_pin", documentation: "The pin connected to the RW (Read/Write) pin of the LCD." },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: "_enable_pin", kind: "property", insertText: "_enable_pin", documentation: "The pin connected to the enable pin of the LCD." },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: "_data_pins", kind: "property", insertText: "_data_pins", documentation: "An array containing the pins connected to the data lines of the LCD." },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: "_displayfunction", kind: "property", insertText: "_displayfunction", documentation: "The display function mode of the LCD." },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: "_displaycontrol", kind: "property", insertText: "_displaycontrol", documentation: "The display control mode of the LCD." },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: "_displaymode", kind: "property", insertText: "_displaymode", documentation: "The display mode of the LCD." },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: "_initialized", kind: "property", insertText: "_initialized", documentation: "Flag indicating whether the LCD is initialized." },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: "_numlines", kind: "property", insertText: "_numlines", documentation: "The number of lines of the LCD display." },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: "_row_offsets", kind: "property", insertText: "_row_offsets", documentation: "An array containing the row offsets of the LCD display." },

            // Newping sonar class
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: 'NewPing', kind: monaco.languages.CompletionItemKind.Class, insertText: 'NewPing(${1:trigger_pin}, ${2:echo_pin}, ${3:max_cm_distance})', documentation: 'Constructs a NewPing object with the specified trigger pin, echo pin, and maximum distance.' },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: 'ping', kind: monaco.languages.CompletionItemKind.Method, insertText: 'ping(${1:max_cm_distance})', documentation: 'Performs an ultrasonic distance measurement and returns the duration in microseconds.' },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: 'ping_cm', kind: monaco.languages.CompletionItemKind.Method, insertText: 'ping_cm(${1:max_cm_distance})', documentation: 'Performs an ultrasonic distance measurement and returns the distance in centimeters.' },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: 'ping_in', kind: monaco.languages.CompletionItemKind.Method, insertText: 'ping_in(${1:max_cm_distance})', documentation: 'Performs an ultrasonic distance measurement and returns the distance in inches.' },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: 'ping_median', kind: monaco.languages.CompletionItemKind.Method, insertText: 'ping_median(${1:it}, ${2:max_cm_distance})', documentation: 'Performs a median filter of ultrasonic distance measurements and returns the distance in microseconds.' },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: 'convert_cm', kind: monaco.languages.CompletionItemKind.Method, insertText: 'convert_cm(${1:echoTime})', documentation: 'Converts the echo time in microseconds to distance in centimeters.' },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: 'convert_in', kind: monaco.languages.CompletionItemKind.Method, insertText: 'convert_in(${1:echoTime})', documentation: 'Converts the echo time in microseconds to distance in inches.' },

            // Servo class
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: 'Servo', kind: monaco.languages.CompletionItemKind.Class, insertText: 'Servo()', documentation: 'Constructs a Servo object.' },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: 'attach', kind: monaco.languages.CompletionItemKind.Method, insertText: 'attach(${1:pin})', documentation: 'Attaches the servo to the specified pin and returns the channel number or 0 if failure.' },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: 'attach', kind: monaco.languages.CompletionItemKind.Method, insertText: 'attach(${1:pin}, ${2:min}, ${3:max})', documentation: 'Attaches the servo to the specified pin and sets the min and max values for writes.' },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: 'detach', kind: monaco.languages.CompletionItemKind.Method, insertText: 'detach()', documentation: 'Detaches the servo.' },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: 'write', kind: monaco.languages.CompletionItemKind.Method, insertText: 'write(${1:value})', documentation: 'Writes the specified value to the servo. If the value is less than 200, it is treated as an angle; otherwise, it is treated as pulse width in microseconds.' },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: 'writeMicroseconds', kind: monaco.languages.CompletionItemKind.Method, insertText: 'writeMicroseconds(${1:value})', documentation: 'Writes the pulse width in microseconds to the servo.' },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: 'read', kind: monaco.languages.CompletionItemKind.Method, insertText: 'read()', documentation: 'Returns the current pulse width as an angle between 0 and 180 degrees.' },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: 'readMicroseconds', kind: monaco.languages.CompletionItemKind.Method, insertText: 'readMicroseconds()', documentation: 'Returns the current pulse width in microseconds for this servo.' },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: 'attached', kind: monaco.languages.CompletionItemKind.Method, insertText: 'attached()', documentation: 'Returns true if the servo is attached, otherwise false.' },

            // DHT
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: 'dht', kind: monaco.languages.CompletionItemKind.Class, insertText: 'dht()', documentation: 'Constructs a dht object.' },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: 'read11', kind: monaco.languages.CompletionItemKind.Method, insertText: 'read11(${1:pin})', documentation: 'Reads temperature and humidity from a DHT11 sensor connected to the specified pin.' },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: 'read', kind: monaco.languages.CompletionItemKind.Method, insertText: 'read(${1:pin})', documentation: 'Reads temperature and humidity from the DHT sensor connected to the specified pin.' },

            // SPI
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: 'SPIClass', kind: monaco.languages.CompletionItemKind.Class, insertText: 'SPIClass', documentation: 'The SPI class provides methods for initializing and controlling the SPI communication.' },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: 'begin', kind: monaco.languages.CompletionItemKind.Method, insertText: 'begin()', documentation: 'Initializes the SPI library.' },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: 'usingInterrupt', kind: monaco.languages.CompletionItemKind.Method, insertText: 'usingInterrupt(${1:interruptNumber})', documentation: 'Registers an interrupt with the SPI library to prevent conflicts during transactions.' },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: 'notUsingInterrupt', kind: monaco.languages.CompletionItemKind.Method, insertText: 'notUsingInterrupt(${1:interruptNumber})', documentation: 'Unregisters an interrupt with the SPI library.' },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: 'beginTransaction', kind: monaco.languages.CompletionItemKind.Method, insertText: 'beginTransaction(${1:settings})', documentation: 'Configures the SPI bus and gains exclusive access to it for transactions.' },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: 'transfer', kind: monaco.languages.CompletionItemKind.Method, insertText: 'transfer(${1:data})', documentation: 'Writes to the SPI bus and receives data from the MISO pin.' },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: 'transfer16', kind: monaco.languages.CompletionItemKind.Method, insertText: 'transfer16(${1:data})', documentation: 'Writes a 16-bit value to the SPI bus and receives a 16-bit value from the MISO pin.' },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: 'transfer', kind: monaco.languages.CompletionItemKind.Method, insertText: 'transfer(${1:buf}, ${2:count})', documentation: 'Performs a group of transfers on the SPI bus.' },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: 'endTransaction', kind: monaco.languages.CompletionItemKind.Method, insertText: 'endTransaction()', documentation: 'Ends a transaction and releases the SPI bus.' },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: 'end', kind: monaco.languages.CompletionItemKind.Method, insertText: 'end()', documentation: 'Disables the SPI bus.' },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: 'setBitOrder', kind: monaco.languages.CompletionItemKind.Method, insertText: 'setBitOrder(${1:bitOrder})', documentation: 'Sets the bit order for SPI communication. Deprecated; use beginTransaction() instead.' },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: 'setDataMode', kind: monaco.languages.CompletionItemKind.Method, insertText: 'setDataMode(${1:dataMode})', documentation: 'Sets the data mode for SPI communication. Deprecated; use beginTransaction() instead.' },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: 'setClockDivider', kind: monaco.languages.CompletionItemKind.Method, insertText: 'setClockDivider(${1:clockDiv})', documentation: 'Sets the clock divider for SPI communication. Deprecated; use beginTransaction() instead.' },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: 'attachInterrupt', kind: monaco.languages.CompletionItemKind.Method, insertText: 'attachInterrupt()', documentation: 'Enables SPI interrupts. Deprecated; SPI.transfer() automatically handles the interrupt flag.' },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: 'detachInterrupt', kind: monaco.languages.CompletionItemKind.Method, insertText: 'detachInterrupt()', documentation: 'Disables SPI interrupts. Deprecated; SPI.transfer() automatically handles the interrupt flag.' },

            // SoftwareSerial
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: 'SoftwareSerial', kind: monaco.languages.CompletionItemKind.Class, insertText: 'SoftwareSerial', documentation: 'The SoftwareSerial class provides methods for software-based serial communication.' },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: 'begin', kind: monaco.languages.CompletionItemKind.Method, insertText: 'begin(${1:speed})', documentation: 'Initializes the software serial communication at the specified baud rate.' },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: 'listen', kind: monaco.languages.CompletionItemKind.Method, insertText: 'listen()', documentation: 'Starts listening for incoming data on the software serial port.' },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: 'end', kind: monaco.languages.CompletionItemKind.Method, insertText: 'end()', documentation: 'Stops listening and disables the software serial port.' },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: 'isListening', kind: monaco.languages.CompletionItemKind.Method, insertText: 'isListening()', documentation: 'Checks if the software serial port is currently listening.' },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: 'stopListening', kind: monaco.languages.CompletionItemKind.Method, insertText: 'stopListening()', documentation: 'Stops listening for incoming data on the software serial port.' },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: 'overflow', kind: monaco.languages.CompletionItemKind.Method, insertText: 'overflow()', documentation: 'Checks if a buffer overflow occurred since the last read operation.' },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: 'peek', kind: monaco.languages.CompletionItemKind.Method, insertText: 'peek()', documentation: 'Returns the next byte of incoming data without removing it from the buffer.' },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: 'write', kind: monaco.languages.CompletionItemKind.Method, insertText: 'write(${1:byte})', documentation: 'Writes a byte of data to the software serial port.' },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: 'read', kind: monaco.languages.CompletionItemKind.Method, insertText: 'read()', documentation: 'Reads a byte of data from the software serial port.' },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: 'available', kind: monaco.languages.CompletionItemKind.Method, insertText: 'available()', documentation: 'Returns the number of bytes available to read from the software serial port.' },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: 'flush', kind: monaco.languages.CompletionItemKind.Method, insertText: 'flush()', documentation: 'Flushes the receive buffer of the software serial port.' },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: 'handle_interrupt', kind: monaco.languages.CompletionItemKind.Method, insertText: 'handle_interrupt()', documentation: 'Interrupt handler for the software serial communication.' },

            // Wire
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: "TwoWire", kind: "class", insertText: "TwoWire", documentation: "The TwoWire class provides methods to communicate with I2C devices." },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: "begin", kind: "method", insertText: "begin();", documentation: "Initializes the I2C bus with the default frequency." },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: "begin", kind: "method", insertText: "begin(${1:uint8_t});", documentation: "Initializes the I2C bus with the specified frequency." },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: "begin", kind: "method", insertText: "begin(${1:int});", documentation: "Initializes the I2C bus with the specified frequency." },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: "end", kind: "method", insertText: "end();", documentation: "Ends the I2C communication and releases the I2C bus." },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: "setClock", kind: "method", insertText: "setClock(${1:uint32_t});", documentation: "Sets the frequency of the I2C bus." },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: "beginTransmission", kind: "method", insertText: "beginTransmission(${1:uint8_t});", documentation: "Begins a transmission to the specified I2C device address." },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: "beginTransmission", kind: "method", insertText: "beginTransmission(${1:int});", documentation: "Begins a transmission to the specified I2C device address." },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: "endTransmission", kind: "method", insertText: "endTransmission();", documentation: "Ends the I2C transmission and transmits the buffered data." },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: "endTransmission", kind: "method", insertText: "endTransmission(${1:uint8_t});", documentation: "Ends the I2C transmission and transmits the buffered data." },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: "requestFrom", kind: "method", insertText: "requestFrom(${1:uint8_t}, ${2:uint8_t});", documentation: "Requests data from the specified I2C device address." },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: "requestFrom", kind: "method", insertText: "requestFrom(${1:uint8_t}, ${2:uint8_t}, ${3:uint8_t});", documentation: "Requests data from the specified I2C device address." },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: "requestFrom", kind: "method", insertText: "requestFrom(${1:uint8_t}, ${2:uint8_t}, ${3:uint32_t}, ${4:uint8_t}, ${5:uint8_t});", documentation: "Requests data from the specified I2C device address." },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: "requestFrom", kind: "method", insertText: "requestFrom(${1:int}, ${2:int});", documentation: "Requests data from the specified I2C device address." },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: "write", kind: "method", insertText: "write(${1:uint8_t});", documentation: "Writes a byte of data to the I2C bus." },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: "write", kind: "method", insertText: "write(${1:const uint8_t*}, ${2:size_t});", documentation: "Writes an array of data to the I2C bus." },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: "available", kind: "method", insertText: "available();", documentation: "Checks if data is available to be read from the I2C bus." },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: "read", kind: "method", insertText: "read();", documentation: "Reads a byte of data from the I2C bus." },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: "peek", kind: "method", insertText: "peek();", documentation: "Peeks at the next byte of data on the I2C bus without consuming it." },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: "flush", kind: "method", insertText: "flush();", documentation: "Flushes the receive buffer of the I2C bus." },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: "onReceive", kind: "method", insertText: "onReceive(${1:void (*)(int)});", documentation: "Registers a callback function to be called when data is received on the I2C bus." },
            { insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, label: "onRequest", kind: "method", insertText: "onRequest(${1:void (*)(void)});", documentation: "Registers a callback function to be called when a request for data is made on the I2C bus." },

        ]
    }

   

    createDCmotorDependencyProposals(range:any){

    }

    

    registerCompletionProviders(){
        // Create a SnippetController
        var snippetController = {
            // Function to resolve the snippet placeholders
            resolveSnippetVariable: function (variable, snippet, i) {
            // Check if the variable name starts with a number
            if (/^\d/.test(variable)) {
                // If it starts with a number, treat it as a placeholder
                return '${' + variable + '}';
            }
            return null;
            }
        };
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
            },
            snippetCompletionProvider: snippetController
        });
    }
}