import { ajaxPrefilter } from "jquery";
import BindMethods from "../utils/bindmethods.js"
import LayoutConfig from "./layout_config.js";
import FileIOController from "../utils/file_io_controller.js";

class SerialMonitor{
    $_containerId = null;
    $_container = null;
    $_contentContainer = null;
    $_headerContainerId = "serial_monitor_header_container";
    $_headerContainer = null;
    $_serialDataMenuContainer = null;
    $_logOutputContainerId = "serial_monitor_log_output_container";
    $_logOutputContainer = null;
    $_footerContainerId = "serial_monitor_footer_container";
    $_footerContainer = null;
    $_connectButton = null;
    $_disConnectButton = null;
    $_sendDataTextArea = null;
    $_sendButton = null;
    $_downloadCSVButton = null;
    $_serialConnected = false;
    $_baudRate = 9600;
    $_serialBaudRates = {
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
    $_serialDataTrace = [""];
    $_port = null;
    $_sendDataQueue = [];
    $_readBuffer = [];
    $_currentOutputLineContainer = null;
    $_serialDataTypes = {
        "string": "string",
        "byte": "byte",
       /* "int": "int",
        "long": "long"*/
    }
    $_currentSerialDataType = this.$_serialDataTypes.string;
    $_serialDisplayTypes = {
        "dec": 10,
        "bin": 2,
        "oct": 8,
        "hex": 16
    }
    $_currentSerialDisplayType = this.$_serialDisplayTypes.dec;
    $_byteInterpreter = {
        "string": (value) => {
            let strValue = String.fromCharCode(value);
            if (strValue == "\n"){
                this.serialReadBufferPrintLn();
            } else {
                this.serialReadBufferPrint(strValue);
            }
        },
        "byte": (value) => {
            this.serialReadBufferPrint(value.toString(this.$_currentSerialDisplayType ));
            this.serialReadBufferPrintLn();
        },
        "int": (value) => {  // Javascript uses 32 bit integers, Arduino 16 bit integers => padding required
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
        "long": (value) => {
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
    

    constructor(containerId){
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
            if (baudRate == this.$_baudRate){
                newOption.attr("selected", true);
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
        this.$_disConnectButton.attr("disabled", true).css({"margin": "0 5px"});
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
                this.$_disConnectButton.attr("disabled", false);
                this.$_connectButton.attr("disabled", true);
                this.$_sendButton.attr("disabled", false);
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
            this.handleWriteSerialValue(this.$_sendDataTextArea.val());
        });
        this.$_downloadCSVButton.on("click", () => {
            FileIOController.download("data.csv", this.$_serialDataTrace.join(";"));
        })
        let self = this;
        this.$_serialDataTypeMenu.on("change", function(e){
            self.$_currentSerialDataType = self.$_serialDataTypes[e.target.value];
        })
        this.$_serialDataDisplayTypeMenu.on("change", function(e){
            self.$_currentSerialDisplayType = self.$_serialDisplayTypes[e.target.value];
        })
        this.$_serialBaudRateMenu.on("change", async function(e){
            await self.disconnect(); // Can only change baud rate at connection time => reconnect 
            self.$_baudRate = self.$_serialBaudRates[e.target.value];
        })
    }

    async disconnect(){
        this.$_serialConnected = false;
        this.$_disConnectButton.attr("disabled", true);
        this.$_connectButton.attr("disabled", false);
        this.$_sendButton.attr("disabled", true);
        this.$_port = null;
    }

    async handleWriteSerialValue(value){
        let valueArray = [];
        if (this.$_currentSerialDataType == this.$_serialDataTypes.byte){ // When sending bytes check if input is in byte format => send as byte
            let parsedValue = parseInt(value, this.$_currentSerialDisplayType);
            if (!Number.isNaN(parsedValue) && parsedValue >= -128 && parsedValue <= 256 ){
                valueArray.push(parsedValue);
            } else {  // If it does not fit in the byte format => send as array of characters
                valueArray = value.split("");
                valueArray = valueArray.map((str) => { return str.charCodeAt(0)});
            }
        } else { // When sent as string => send as array of characters with newline at end.
            valueArray = `${value}\n`.split("");
            valueArray = valueArray.map((str) => { return str.charCodeAt(0)});
        }
        console.log(valueArray)
        console.log(`Writing value: ${value}`)
        this.$_sendDataQueue.push(...valueArray);
    }

    handleNewSerialValue(value){
        this.$_byteInterpreter[this.$_currentSerialDataType](value);
    }

    serialReadBufferPrint(value){
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
        navigator.serial.requestPort({ filters: [{ usbVendorId }]}).then( async (port) => {
            // Connect to `port` or add it to the list of available ports.
            await port.open({baudRate: this.$_baudRate});
            this.$_serialConnected = true;
            while (port.readable && !stopped) {
                const reader = port.readable.getReader();
                const writer = port.writable.getWriter();
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
                    value.forEach((element) => { this.handleNewSerialValue(element); });
                    if (this.$_sendDataQueue.length > 0){
                        let nextOnQueue = this.$_sendDataQueue.shift()
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
        }).catch((e) => {
            // The user didn't select a port.
            print("Error")
        });
    }

    setupWebSerial(){
        if (navigator.serial){
            navigator.serial.addEventListener('connect', (e) => {
                // Connect to `e.target` or add it to a list of available ports.
                console.log("Serial device connected: " + e.target)
            });
            
            navigator.serial.addEventListener('disconnect', (e) => {
                console.log("Serial device disconnected: " + e.target)
                this.disconnect();
            });
            
            navigator.serial.getPorts().then((ports) => {
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

    setSerialDisplayType(type){

    }


}

export default SerialMonitor