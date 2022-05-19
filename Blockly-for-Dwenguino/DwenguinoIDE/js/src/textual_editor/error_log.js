import BindMethods from "../utils/bindmethods.js"

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
        this.$_container.css({"background-color": "#1e1e1e", "color": "#8bab42"});
        this.$_container.css({"border-left": "solid 1px #8bab42"});
        this.$_logOutputContainer.css({"padding": "5px 20px"});
        this.$_headerContainer.css({"padding-left": "10px", "padding-top": "5px", "font-weight": "bold", "border-bottom": "solid gray 1px", "border-top": "solid gray 1px"});
    }

    /**
     * @brief Set the text of the editor view
     * @param {string} logText Text to be written inside the error log view
     */
    setContent(logText){
        this.$_logOutputContainer.html(logText.replace(/\n/g, "<br />"));
    }

    /**
     * @brief Clears the content of the error log
     */
    clearContent(){
        this.$_logOutputContainer.text("");
    }
}

export default ErrorLog;