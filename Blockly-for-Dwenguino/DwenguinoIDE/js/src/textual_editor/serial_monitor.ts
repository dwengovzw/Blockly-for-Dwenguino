import BindMethods from "../utils/bindmethods.js"
import LayoutConfig from "./layout_config";
import FileIOController from "../utils/file_io_controller.js";

class SerialMonitor{
    $_containerId:string = "";
    $_container:JQuery<HTMLElement>;
    $_contentContainer:JQuery<HTMLElement>;
    $_headerContainerId:string = "serial_monitor_header_container";
    $_headerContainer:JQuery<HTMLElement>;
    $_serialDataMenuContainer:JQuery<HTMLElement>;
    $_serialDataTypeMenu: JQuery<HTMLElement>;
    $_serialBaudRateMenu: JQuery<HTMLElement>;
    $_serialDataDisplayTypeMenu: JQuery<HTMLElement>;
    $_logOutputContainerId:string = "serial_monitor_log_output_container";
    $_logOutputContainer:JQuery<HTMLElement>;
    $_footerContainerId:string = "serial_monitor_footer_container";
    $_footerContainer:JQuery<HTMLElement>;
    $_connectButton:JQuery<HTMLElement>;
    $_disConnectButton:JQuery<HTMLElement>;
    $_sendDataTextArea:JQuery<HTMLElement>;
    $_sendButton:JQuery<HTMLElement>;
    $_downloadCSVButton:JQuery<HTMLElement>;
    $_serialConnected:boolean = false;
    $_baudRate:number = 9600;
    $_serialBaudRates:any = {
        "300": 300,
        "600": 600,
        "1200": 1200,
        "2400": 2400,
        "4800": 4800,
        "9600": 9600,
        "14400": 14400,
        "19200": 19200,
        "28800":28800,
        "38400": 38400,
        "57600": 57600,
        "115200": 115200
    }
    $_serialDataTrace:string[] = [""];
    $_port:SerialPort|null = null;
    $_sendDataQueue:number[] = [];
    $_readBuffer:number[] = [];
    $_currentOutputLineContainer:JQuery<HTMLElement>;
    $_serialDataTypes:any = {
        "string": "string",
        "byte": "byte",
       /* "int": "int",
        "long": "long"*/
    }
    $_currentSerialDataType = this.$_serialDataTypes.string;
    $_serialDisplayTypes:any = {
        "dec": 10,
        "bin": 2,
        "oct": 8,
        "hex": 16
    }
    $_currentSerialDisplayType = this.$_serialDisplayTypes.dec;
    $_byteInterpreter:any = {
        "string": (value:number) => {
            let strValue = String.fromCharCode(value);
            if (strValue == "\n"){
                this.serialReadBufferPrintLn();
            } else {
                this.serialReadBufferPrint(strValue);
            }
        },
        "byte": (value:number) => {
            this.serialReadBufferPrint(value.toString(this.$_currentSerialDisplayType ));
            this.serialReadBufferPrintLn();
        },
        "int": (value:number) => {  // Javascript uses 32 bit integers, Arduino 16 bit integers => padding required
            this.$_readBuffer.push(value);
            if (this.$_readBuffer.length >= 2){
                let bytes = this.$_readBuffer;
                this.$_readBuffer = [];
                let sign = bytes[0] & (1 << 7);
                let combined = ((bytes[0] & 0xFF) << 8) | (bytes[1] & 0xFF);
                combined = sign ? 0xFFFF0000 & combined : combined;  // Add ones to beginning for sign in two complement representation
                this.serialReadBufferPrint(combined.toString(this.$_currentSerialDisplayType ))
                this.serialReadBufferPrintLn();
            }
        },
        "long": (value:number) => {
            this.$_readBuffer.push(value);
            if (this.$_readBuffer.length >= 4){
                let bytes = this.$_readBuffer;
                this.$_readBuffer = [];
                let combined = ((bytes[0] & 0xFF) << 24) | ((bytes[1] & 0xFF) << 16) | ((bytes[2] & 0xFF) << 8) | (bytes[3] & 0xFF);
                this.serialReadBufferPrint(combined.toString(this.$_currentSerialDisplayType ));
                this.serialReadBufferPrintLn();
            } 
        }
    }
    

    constructor(containerId:string){
        BindMethods(this);
        this.$_containerId = containerId;
        this.$_container = $(`#${containerId}`);

        this.initElements();
        this.initStyle();
        this.setupWebSerial();
        this.initInteraction();
    }

    initElements(){
        this.$_contentContainer = $("<div>");

        this.$_headerContainer = $("<div>").attr("id", this.$_headerContainerId);
        this.$_headerContainer.append($("<span>").text(DwenguinoBlocklyLanguageSettings.translate(['serial_monitor'])));

        let serialDataTypeMenuId = "serial_data_type_menu_select";
        this.$_serialDataTypeMenu = $("<select>").attr("name", serialDataTypeMenuId).attr("id", serialDataTypeMenuId);
        for (let dataType in this.$_serialDataTypes){
            this.$_serialDataTypeMenu.append($("<option>").attr("value", dataType).text(dataType));
        }

        let serialDataDisplayTypeMenuId = "serial_data_type_menu_select";
        this.$_serialDataDisplayTypeMenu = $("<select>").attr("name", serialDataDisplayTypeMenuId).attr("id", serialDataDisplayTypeMenuId);
        for (let dataDisplayType in this.$_serialDisplayTypes){
            this.$_serialDataDisplayTypeMenu.append($("<option>").attr("value", dataDisplayType).text(dataDisplayType));
        }

        let serialBaudRateMenuId = "serial_data_type_menu_select";
        this.$_serialBaudRateMenu = $("<select>").attr("name", serialBaudRateMenuId).attr("id", serialBaudRateMenuId);
        for (let baudRate in this.$_serialBaudRates){
            let newOption = $("<option>").attr("value", baudRate).text(baudRate);
            if (baudRate == this.$_baudRate.toString()){
                newOption.prop("selected", true);
            }
            this.$_serialBaudRateMenu .append(newOption);
        }

        this.$_serialDataMenuContainer = $("<span>");
        this.$_serialDataMenuContainer.append($("<span>").text(DwenguinoBlocklyLanguageSettings.translate(["serial_monitor_data_type_setting"])));
        this.$_serialDataMenuContainer.append(this.$_serialDataTypeMenu);
        this.$_serialDataMenuContainer.append($("<span>").text(DwenguinoBlocklyLanguageSettings.translate(["serial_monitor_data_display_setting"])));
        this.$_serialDataMenuContainer.append(this.$_serialDataDisplayTypeMenu);
        this.$_serialDataMenuContainer.append($("<span>").text(DwenguinoBlocklyLanguageSettings.translate(["serial_monitor_baud_rate_setting"])));
        this.$_serialDataMenuContainer.append(this.$_serialBaudRateMenu);

        this.$_headerContainer.append(this.$_serialDataMenuContainer);

        this.$_logOutputContainer = $("<div>").attr("id", this.$_logOutputContainerId);
        this.$_currentOutputLineContainer = $("<div>");
        this.$_logOutputContainer.prepend(this.$_currentOutputLineContainer);

        this.$_footerContainer = $("<div>").attr("id", this.$_footerContainerId);

        this.$_connectButton = $("<button>").text(DwenguinoBlocklyLanguageSettings.translate(['connect']));
        this.$_disConnectButton = $("<button>").text(DwenguinoBlocklyLanguageSettings.translate(['disConnect']));
        this.$_sendDataTextArea = $("<textarea>").attr("rows", 1).attr("class", "no_scrollbars").attr("placeholder", DwenguinoBlocklyLanguageSettings.translate(["serial_monitor_send_field_placeholder"]));
        this.$_sendButton = $("<button>").text(DwenguinoBlocklyLanguageSettings.translate(['send']));
        this.$_downloadCSVButton = $("<button>").attr("class", "fas fa-download")

        this.$_footerContainer.append(this.$_connectButton)
        this.$_footerContainer.append(this.$_disConnectButton)
        this.$_footerContainer.append(this.$_sendDataTextArea)
        this.$_footerContainer.append(this.$_sendButton)
        this.$_footerContainer.append(this.$_downloadCSVButton)
        
        this.$_contentContainer.append(this.$_headerContainer);
        this.$_contentContainer.append(this.$_logOutputContainer);
        this.$_contentContainer.append(this.$_footerContainer);

        this.$_container.append(this.$_contentContainer);
    }

    initStyle(){
        this.$_contentContainer.css({
            "display": "flex",
            "flex-direction": "column",
            "justify-content": "space-between",
            "align-items": "stretch",
            "color": LayoutConfig.foregroundColor,
            "background-color": LayoutConfig.backgroundColor,
            "border-left": `solid 1px ${LayoutConfig.foregroundColor}`,
            "border-top": `solid 1px ${LayoutConfig.borderColor}`,
            "height": "100%",
        });
        this.$_headerContainer.css({
            "padding": "5px 10px",
            "width": "100%",
            "border-bottom": `solid 1px ${LayoutConfig.borderColor}`,
            "display": "flex",
            "align-content": "space-between",
            "justify-content": "space-between"
        })
        this.$_sendDataTextArea.css({
            "width": "100%",
            "flex-grow": "1",
            "overflow": "hidden", 
            "border": "none", 
            "outline": "none", 
            "resize": "none", 
            "box-shadow": "none"
        })
        this.$_footerContainer.css({
            "width": "100%",
            "display": "flex",
            "flex-direction": "row",
            "justify-content": "space-between",
            "padding": "5px",
            "border-top": `solid 1px ${LayoutConfig.borderColor}`
        })
        this.$_logOutputContainer.css({
            "flex-grow": "1",
            "overflow-y": "scroll",
            "overflow-x": "hidden",
            "padding": "10px",
        })
        this.$_sendButton.css({"margin": "0 5px"});
        this.$_connectButton.css({"margin": "0 5px"});
        this.$_disConnectButton.prop("disabled", true).css({"margin": "0 5px"});
        this.$_serialDataTypeMenu.css({"color": "inherit", "background-color": "inherit", "border": "none", "margin": "0 5px"});
        this.$_serialDataTypeMenu.children().css({"color": "inherit", "background-color": "inherit"})
        this.$_serialDataDisplayTypeMenu.css({"color": "inherit", "background-color": "inherit", "border": "none", "margin": "0 5px"});
        this.$_serialDataDisplayTypeMenu.children().css({"color": "inherit", "background-color": "inherit"});
        this.$_serialBaudRateMenu.css({"color": "inherit", "background-color": "inherit", "border": "none", "margin": "0 5px"})
        this.$_serialBaudRateMenu.children().css({"color": "inherit", "background-color": "inherit"});
    }

    initInteraction(){
        this.$_connectButton.on("click", () => {
            if ("serial" in navigator){
                this.$_disConnectButton.prop("disabled", false);
                this.$_connectButton.prop("disabled", true);
                this.$_sendButton.prop("disabled", false);
                this.serialConnectButtonHandler();
                this.$_serialDataTrace = [""];
                this.$_logOutputContainer.empty();
                this.$_currentOutputLineContainer = $("<div>");
                this.$_logOutputContainer.prepend(this.$_currentOutputLineContainer);
            } else {
                window.alert(DwenguinoBlocklyLanguageSettings.translate(["serial_not_supported"]));
            }
        })
        this.$_disConnectButton.on("click", async () => {
            this.disconnect();
        });
        this.$_sendButton.on("click", async () => {
            let value = this.$_sendDataTextArea.val()
            if (value !== undefined){
                this.handleWriteSerialValue(value.toString());
            }
        });
        this.$_downloadCSVButton.on("click", () => {
            FileIOController.download("data.csv", this.$_serialDataTrace.join(";"));
        })
        let self = this;
        this.$_serialDataTypeMenu.on("change", function(e){
            if (e.target instanceof HTMLInputElement)
                self.$_currentSerialDataType = self.$_serialDataTypes[e.target.value];
        })
        this.$_serialDataDisplayTypeMenu.on("change", function(e){
            if (e.target instanceof HTMLInputElement)
                self.$_currentSerialDisplayType = self.$_serialDisplayTypes[e.target.value];
        })
        this.$_serialBaudRateMenu.on("change", async function(e){
            await self.disconnect(); // Can only change baud rate at connection time => reconnect 
            if (e.target instanceof HTMLInputElement)
                self.$_baudRate = self.$_serialBaudRates[e.target.value];
        })
    }

    async disconnect(){
        this.$_serialConnected = false;
        this.$_disConnectButton.prop("disabled", true);
        this.$_connectButton.prop("disabled", false);
        this.$_sendButton.prop("disabled", true);
        this.$_port = null;
    }

    async handleWriteSerialValue(value:string){
        let valueArray:number[] = [];
        if (this.$_currentSerialDataType == this.$_serialDataTypes.byte){ // When sending bytes check if input is in byte format => send as byte
            let parsedValue = parseInt(value, this.$_currentSerialDisplayType);
            if (!Number.isNaN(parsedValue) && parsedValue >= -128 && parsedValue <= 256 ){
                valueArray.push(parsedValue);
            } else {  // If it does not fit in the byte format => send as array of characters
                valueArray = value.split("").map((str) => { return str.charCodeAt(0)});
            }
        } else { // When sent as string => send as array of characters with newline at end.
            valueArray = `${value}\n`.split("").map((str) => { return str.charCodeAt(0)});
        }
        console.log(valueArray)
        console.log(`Writing value: ${value}`)
        this.$_sendDataQueue.push(...valueArray);
    }

    handleNewSerialValue(value:number){
        this.$_byteInterpreter[this.$_currentSerialDataType](value);
    }

    serialReadBufferPrint(value:string){
        this.$_currentOutputLineContainer.text(this.$_currentOutputLineContainer.text() + value)
        this.$_serialDataTrace[this.$_serialDataTrace.length-1] = this.$_serialDataTrace[this.$_serialDataTrace.length-1] + value;
    }

    serialReadBufferPrintLn(){
        this.$_currentOutputLineContainer = $("<div>");
        this.$_logOutputContainer.prepend(this.$_currentOutputLineContainer);
        this.$_serialDataTrace.push("");
    }


    async serialConnectButtonHandler(){
        const usbVendorId = 0Xd3e0;
        let stopped = false
        navigator.serial.requestPort({ filters: [{ usbVendorId }]}).then( async (port:SerialPort) => {
            // Connect to `port` or add it to the list of available ports.
            await port.open({baudRate: this.$_baudRate});
            this.$_serialConnected = true;
            while (port.readable && port.writable && !stopped) {
                const reader:ReadableStreamDefaultReader<Uint8Array> = port.readable.getReader();
                const writer:WritableStreamDefaultWriter<Uint8Array> = port.writable.getWriter();
                this.$_port = port;
                try {
                  while (true && !stopped) {
                    const { value, done } = await reader.read();
                    if (!this.$_serialConnected || done) {
                        reader.cancel();
                        //writer.close();
                        writer.releaseLock();
                        // |reader| has been canceled.
                        console.log("Reader has been closed");
                        stopped = true;
                    }
                    if (value){
                        value.forEach((element) => { this.handleNewSerialValue(element); });
                    }
                    
                    if (this.$_sendDataQueue.length > 0){
                        let nextOnQueue = this.$_sendDataQueue.shift() as number
                        let data = new Uint8Array([nextOnQueue]);
                        await writer.write(data);
                    }
                  }
                } catch (error) {
                  // Handle |error|…
                  this.$_port = null;                  
                } finally {
                  this.$_port = null;
                  reader.releaseLock();
                }
              }
              port.close();    
        }).catch((e:any) => {
            // The user didn't select a port.
            console.log("Error")
        });
    }

    setupWebSerial(){
        if (navigator.serial){
            navigator.serial.addEventListener('connect', (e:any) => {
                // Connect to `e.target` or add it to a list of available ports.
                console.log("Serial device connected: " + e.target)
            });
            
            navigator.serial.addEventListener('disconnect', (e:any) => {
                console.log("Serial device disconnected: " + e.target)
                this.disconnect();
            });
            
            navigator.serial.getPorts().then((ports:SerialPort[]) => {
            // Initialize the list of available ports with `ports` on page load.
                console.log(`The available ports are ${ports}`)
            });
        }
        
        
    }

    getSerialDisplayTypes(){
        return this.$_serialDisplayTypes.keys()
    }

    getSerialDataTypes(){
        return this.$_serialDataTypes.keys();
    }

}

export default SerialMonitor