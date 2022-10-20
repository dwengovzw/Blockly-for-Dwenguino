import BindMethods from "../utils/bindmethods.js"
import LayoutConfig from "./layout_config.js";
import { TabInfo }   from "./tab_info.js"
import DwenguinoBlockly from "../dwenguino_blockly.js";

class EditorPane{
    _containerId = null;
    _headerId = null;
    _editorId = null;
    _editor = null;
    _tabHeaderContainer = null;
    _tabHeaderContainerId = null;
    $_container = null;
    $_editorPaneEditorContainer = null;
    $_headerContainer = null;
    $_tabsInfo = [];
    $_selectedTab = null;

    constructor(containerId){
        BindMethods(this);
        this._containerId = containerId;

        this._headerId = "editor_pane_header";
        this._editorId = "editor_pane_editor"
        this._tabHeaderContainerId = "editor_pane_tab_header_container"

        this.$_container = $("#" + this._containerId);
        this.$_container.empty()
        this.$_headerContainer = $("<div>").attr("id", this._headerId).css({display: "flex"});

        this._tabHeaderContainer = $("<div>").attr("id", this._tabHeaderContainerId).attr("class", "tab");
        this._tabHeaderContainer.css({overflow_x: "scroll", display: "flex", flex_direction: "row"});

        this.$_headerContainer.append(this._tabHeaderContainer);

        //this.$_editorPaneEditorContainer = $("<div>").attr("id", this._editorId);
        this.$_editorPaneEditorContainer = $("<div>").attr("id", this._editorId);
        
        this.$_container.append(this.$_headerContainer);
        this.$_container.append(this.$_editorPaneEditorContainer);

        this.initStyle();
    }
    /**
     * @brief Set the style of the editor pane
     */
    initStyle(){
        this.$_container.css({"display": "flex", "flex-direction": "column", "background-color": LayoutConfig.backgroundColor, "color": LayoutConfig.foregroundColor, "padding-right": "1px"});
        this.$_headerContainer.css({"height": LayoutConfig.paneHeaderHeight, "padding-left": "10px", "padding-top": "5px", "font-weight": "bold", "border-bottom": `solid ${LayoutConfig.borderColor} 1px`, "border-top": `solid ${LayoutConfig.borderColor} 1px`});
        this.$_editorPaneEditorContainer.css({"flex-grow": "1", "padding-top": "10px"});
    }

    selectTab(tabInfo){
        this.$_selectedTab = tabInfo;
        $(".tabcontent").css({display: "none"});
        $(`#${tabInfo.getEditorContainerId()}`).css({display: "block"});
        $(".tablinks").css({"background-color": "rgba(255, 255, 255, 0.1)"});
        $(`#${tabInfo.getTabId()}`).css({"background-color": "rgba(255, 255, 255, 0.3)"});
        tabInfo.renderEditor();
    }

    openTab(code = "", title=null){
        let newTabInfo = new TabInfo(code, title);
        this.$_tabsInfo.push(newTabInfo);
        this.addTabHeader(newTabInfo);
        this.addTabContentPane(newTabInfo);
        this.selectTab(newTabInfo);
    }

    closeTabs(){
        for (let tabInfo in this.$_tabsInfo){
            this.closeTab(tabInfo);
        }
        this.$_tabsInfo = [];
    }

    closeTab(tabInfo){
        $(`#${tabInfo.getTabId()}`).remove();
        $(`#${tabInfo.getEditorContainerId()}`).remove();
        this.$_tabsInfo = this.$_tabsInfo.filter((ti) => ti.getTabId() != tabInfo.getTabId()); // Filter out the tabInfo tab
        // if the closed tab was open and there are tabs left, switch to first tab
        if (this.$_selectedTab.getTabId() == tabInfo.getTabId() && this.$_tabsInfo.length >=1){
            this.selectTab(this.$_tabsInfo[0]); // Switch to first tab
            this.$_selectedTab = this.$_tabsInfo[0]
        }
        
    }

    addTabHeader(tabInfo){
        let tabHtml = $("<span>").attr("id", tabInfo.getTabId()).attr("class", "tablinks")
        let tabText = $("<span>").html(tabInfo.getTitle());
        let tabTextEditField = $("<textarea>").attr("rows", 1).attr("cols", 20);
        let tabCloseButton = $("<img>");

        tabHtml.css({display: "flex", padding: "0 5px", margin: "0 5px", "flex-direction": "row", "justify-content": "space-between", "border-radius": "5px 5px 0 0", "background-color": "rgba(255, 255, 255, 0.3)", "align-items": "center"})
        tabTextEditField.css({display: "none"});
        tabCloseButton.attr("src", `${DwenguinoBlockly.basepath}DwenguinoIDE/img/icons/xmark-solid.svg`).css({width: "18px", height: "18px", "margin-left": "5px", "z-index": "30"})

        tabText.on("click", (e) => {
            this.selectTab(tabInfo);
        })

        tabCloseButton.on("click", (e) => {
            this.closeTab(tabInfo);
        })

        tabText.on("dblclick", (e) => {
            let oldText = tabText.text();
            tabTextEditField.val(oldText);
            tabText.css({display: "none"});
            tabTextEditField.css({display: "inline"});
        })

        tabTextEditField.on("focusout", (e) => {
            let newText = tabTextEditField.val();
            tabInfo.setTitle(newText);
            tabText.text(newText);
            tabText.css({display: "inline"});
            tabTextEditField.css({display: "none"});
        })

        tabHtml.append(tabText);
        tabHtml.append(tabTextEditField);
        tabHtml.append(tabCloseButton);
        this._tabHeaderContainer.append(tabHtml);
    }

    addTabContentPane(tabInfo){
        let tabContentHtml = $("<div>").attr("id", tabInfo.getEditorContainerId()).attr("class", "tabcontent");
        tabContentHtml.css({width: "100%", height: "100%"});
        this.$_editorPaneEditorContainer.append(tabContentHtml);
    }

    getCurrentCode(){
        return this.$_selectedTab ? this.$_selectedTab.getCode() : "";
    }

    getCurrentTabName(){
        return this.$_selectedTab ? this.$_selectedTab.getTitle() : "No file selected";
    }

   
}

export default EditorPane;