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
    $_byteInterpretationSetting = "short";
    $_byteInterpreter = {
        "char": (value) => {
            return String.fromCharCode(value);
        },
        "short": (value) => {
            return value.toString()
        },
        "hex": (value) => {
            return value.toString(16)
        }, 
        "bin": (value) => {
            return value.toString(2)
        },
        "oct": (value) => {
            return value.toString(2)
        }
    }
    $_serialDataTrace = [];
    $_port = null;
    $_sendDataQueue = [];

    constructor(containerId){
        BindMethods(this);
        this.$_containerId = containerId;
        this.$_container = $(`#${containerId}`);

        this.$_contentContainer = $("<div>");

        this.$_headerContainer = $("<div>").attr("id", this.$_headerContainerId);
        this.$_headerContainer.text(DwenguinoBlocklyLanguageSettings.translate(['serial_monitor']));

        this.$_logOutputContainer = $("<div>").attr("id", this.$_logOutputContainerId);;

        this.$_footerContainer = $("<div>").attr("id", this.$_footerContainerId);

        this.$_connectButton = $("<button>").text(DwenguinoBlocklyLanguageSettings.translate(['connect']));
        this.$_disConnectButton = $("<button>").text(DwenguinoBlocklyLanguageSettings.translate(['disConnect']));
        this.$_sendDataTextArea = $("<textarea>").attr("rows", 1).attr("class", "no_scrollbars").text("Enter the data you want to send to the µC");
        this.$_sendButton = $("<button>").text(DwenguinoBlocklyLanguageSettings.translate(['send']));
        this.$_downloadCSVButton = $("<button>").attr("class", "db_menu_item fas fa-download")

        this.$_footerContainer.append(this.$_connectButton)
        this.$_footerContainer.append(this.$_disConnectButton)
        this.$_footerContainer.append(this.$_sendDataTextArea)
        this.$_footerContainer.append(this.$_sendButton)
        this.$_footerContainer.append(this.$_downloadCSVButton)
        
        this.$_contentContainer.append(this.$_headerContainer);
        this.$_contentContainer.append(this.$_logOutputContainer);
        this.$_contentContainer.append(this.$_footerContainer);

        this.$_container.append(this.$_contentContainer);

        this.initStyle();
        this.setupWebSerial();
        this.initInteraction();
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
            "border-bottom": `solid 1px ${LayoutConfig.borderColor}`
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
    }

    initInteraction(){
        this.$_connectButton.on("click", () => {
            if ("serial" in navigator){
                this.$_disConnectButton.attr("disabled", false);
                this.$_connectButton.attr("disabled", true);
                this.$_sendButton.attr("disabled", false);
                this.serialConnectButtonHandler();
                this.$_serialDataTrace = [];
                this.$_logOutputContainer.empty();
            } else {
                window.alert(DwenguinoBlocklyLanguageSettings.translate(["serial_not_supported"]));
            }
        })
        this.$_disConnectButton.on("click", async () => {
            this.$_serialConnected = false;
            this.$_disConnectButton.attr("disabled", true);
            this.$_connectButton.attr("disabled", false);
            this.$_sendButton.attr("disabled", true);
            this.$_port = null;
        });
        this.$_sendButton.on("click", async () => {
            this.handleWriteSerialValue(this.$_sendDataTextArea.val());
        });
        this.$_downloadCSVButton.on("click", () => {
            FileIOController.download("data.csv", this.$_serialDataTrace.join(";"));
        })
    }

    async handleWriteSerialValue(value){
        let valueArray = `${value}\n`.split("");
        valueArray = valueArray.map((str) => {console.log(str.charCodeAt(0)); return str.charCodeAt(0)});
        console.log(valueArray)
        console.log(`Writing value: ${value}`)
        this.$_sendDataQueue.push(...valueArray);
    }

    handleNewSerialValue(value){
        console.log(`Value: ${this.$_byteInterpreter[this.$_byteInterpretationSetting](value[0])}`)
        let interpretedValue = this.$_byteInterpreter[this.$_byteInterpretationSetting](value[0]);
        this.$_logOutputContainer.prepend($("<div>").text(interpretedValue));
        this.$_serialDataTrace.push(interpretedValue);
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
                        writer.releaseLock()
                        writer.close();
                        // |reader| has been canceled.
                        console.log("Reader has been closed");
                        stopped = true;
                    }
                    this.handleNewSerialValue(value);
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
                this.$_serialConnected = false;
            });
            
            navigator.serial.getPorts().then((ports) => {
            // Initialize the list of available ports with `ports` on page load.
                console.log(`The available ports are ${ports}`)
            });
        }
        
        
    }


}

export default SerialMonitor