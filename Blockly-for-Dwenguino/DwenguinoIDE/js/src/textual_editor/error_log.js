import BindMethods from "../utils/bindmethods.js"
import LayoutConfig from "./layout_config.js";

class ErrorLog{
    containerId = null;
    $_container = null;
    $_headerContainer = null;
    $_logOutputContainer = null;
    constructor(containerId){
        BindMethods(this);
        this.containerId = containerId;
        this.$_container = $("#" + this.containerId);

        this.$_headerContainer = $("<div>");
        this.$_headerContainer.html("Output");

        this.$_logOutputContainer = $("<div>");
        
        this.$_container.append(this.$_headerContainer);
        this.$_container.append(this.$_logOutputContainer);
        
        this.initStyle();
    }

    /**
     * @brief Set the style of the error pane
     */
    initStyle(){
        this.$_container.css({"background-color": LayoutConfig.backgroundColor, "color": LayoutConfig.foregroundColor});
        this.$_container.css({"position": "relative", "border-left": `solid 1px ${LayoutConfig.foregroundColor}`});
        this.$_logOutputContainer.attr("class", "no_scrollbars");
        this.$_logOutputContainer.css({"position": "absolute", "bottom": "0", "top": LayoutConfig.paneHeaderHeight, "left": "0px", "right": "0px", "padding": "5px 20px", "overflow": "scroll", "scrollbar-color": LayoutConfig.foregroundColor, "scrollbar-width": "thin"});
        this.$_headerContainer.css({"height": LayoutConfig.paneHeaderHeight, "padding-left": "10px", "padding-top": "5px", "font-weight": "bold", "border-bottom": `solid ${LayoutConfig.borderColor} 1px`, "border-top": `solid ${LayoutConfig.borderColor} 1px`});
    }

    /**
     * @brief Set the text of the editor view
     * @param {string} logText Text to be written inside the error log view
     */
    setContent(logText){
        this.$_logOutputContainer.empty();
        logText.split(/\r?\n/).forEach(lineText => {
            let lineElem = $("<div>");
            lineElem.css({"color": this.getColorForLine(lineText)})
            lineElem.text(lineText);
            this.$_logOutputContainer.append(lineElem);
        })
        //this.$_logOutputContainer.html(logText.replace(/\n/g, "<br />"));
    }

    getColorForLine(lineText){
        let colorMap = {
            "error": "red",
            "waring": "yellow"
        }
        for (const key of Object.keys(colorMap)){
            if (lineText.toLowerCase().includes(key)){
                return colorMap[key];
            }
        }
        return "#8bab42"
    }

    /**
     * @brief Clears the content of the error log
     */
    clearContent(){
        this.$_logOutputContainer.text("");
    }
}

export default ErrorLog;