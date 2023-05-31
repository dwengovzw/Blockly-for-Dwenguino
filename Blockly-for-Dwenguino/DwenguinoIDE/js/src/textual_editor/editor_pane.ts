import BindMethods from "../utils/bindmethods.js"
import LayoutConfig from "./layout_config";
import { TabInfo }   from "./tab_info"
import DwenguinoBlockly from "../dwenguino_blockly.js";

class EditorPane{
    _containerId:string = "";
    _headerId:string = "editor_pane_header";
    _editorId:string = "editor_pane_editor";
    _editor:JQuery<HTMLElement>;
    _tabSavedIndicatorId:string = "textual_editor_tab_saved_indicator";
    _tabHeaderContainer:JQuery<HTMLElement>;
    _tabHeaderContainerId:string = "editor_pane_tab_header_container";
    $_container:JQuery<HTMLElement>;
    $_editorPaneEditorContainer:JQuery<HTMLElement>;
    $_headerContainer:JQuery<HTMLElement>;
    $_tabsInfo:TabInfo[] = [];
    $_selectedTab:TabInfo|null = null;
    $_hasBecomeUnsavedEventListeners:Function[] = [];

    constructor(containerId:string){
        BindMethods(this);
        this._containerId = containerId;

        this.$_container = $("#" + this._containerId);
        this.$_container.empty()
        this.$_headerContainer = $("<div>").attr("id", this._headerId).css({display: "flex"});

        this._tabHeaderContainer = $("<div>").attr("id", this._tabHeaderContainerId).attr("class", "tab");
        this._tabHeaderContainer.css(
            {
                width: "100%",
                height: "100%",
                "overflow-x": "scroll", 
                display: "flex", 
                "flex-direction": "row", 
                "&::-webkit-scrollbar": "{display: 'none', width: 'none'}", 
                "-ms-overflow-style": "none", 
                "scrollbar-width": "none"
            });

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

    selectTab(tabInfo:TabInfo){
        this.$_selectedTab = tabInfo;
        $(".tabcontent").css({display: "none"});
        $(`#${tabInfo.getEditorContainerId()}`).css({display: "block"});
        $(".tablinks").css({"background-color": "rgba(255, 255, 255, 0.1)"});
        $(`#${tabInfo.getTabId()}`).css({"background-color": "rgba(255, 255, 255, 0.2)"});
        
    }

    openTab(code:string = "", title:string|null=null){
        let newTabInfo = new TabInfo(code, title);
        newTabInfo.addOnSavedStateChangedListener(this.handleTabSavedStateChanged);
        this.$_tabsInfo.push(newTabInfo);
        this.addTabHeader(newTabInfo);
        this.addTabContentPane(newTabInfo);
        this.selectTab(newTabInfo);
        newTabInfo.renderEditor();
    }

    handleTabSavedStateChanged(saved:boolean){
        if (!saved){
            this.$_hasBecomeUnsavedEventListeners.forEach((func) => func());
        }
    }

    addOnHasBecomeUnsavedEventListener(func:Function){
        this.$_hasBecomeUnsavedEventListeners.push(func);
    }

    removeOnHasBecomeUnsavedEventListener(func:Function){
        this.$_hasBecomeUnsavedEventListeners = this.$_hasBecomeUnsavedEventListeners.filter((f) => f != func);
    }

    closeTabs(notify=true){
        this.$_tabsInfo.forEach((tabInfo:TabInfo) => this.closeTab(tabInfo, notify))
        this.$_tabsInfo = [];
    }

    closeTab(tabInfo:TabInfo, notify=true){
        if (!tabInfo.getSaved()){
            if (notify){
                let confirmed = confirm(DwenguinoBlocklyLanguageSettings.translate(["confirm_close"]));
                if (!confirmed){
                    return;
                }
            }
        }
        $(`#${tabInfo.getTabId()}`).remove();
        $(`#${tabInfo.getEditorContainerId()}`).remove();
        this.$_tabsInfo = this.$_tabsInfo.filter((ti) => ti.getTabId() != tabInfo.getTabId()); // Filter out the tabInfo tab
        // if the closed tab was open and there are tabs left, switch to first tab
        if (this.$_selectedTab && this.$_selectedTab.getTabId() == tabInfo.getTabId() && this.$_tabsInfo.length >=1){
            this.selectTab(this.$_tabsInfo[0]); // Switch to first tab
            this.$_selectedTab = this.$_tabsInfo[0]
        }
        
    }

    addTabHeader(tabInfo:TabInfo){
        let tabHtml = $("<span>").attr("id", tabInfo.getTabId()).attr("class", "tablinks")
        let tabSavedIndicator = $("<span>").attr("class", this._tabSavedIndicatorId).prop("display", false).text("*");
        let tabText = $("<span>").html(tabInfo.getTitle());
        let tabTextEditField = $("<textarea>").attr("rows", 1).attr("cols", 20);
        let tabCloseButton = $("<img>");

        tabHtml.css({display: "flex", padding: "0 5px", margin: "0 5px", "flex-direction": "row", "justify-content": "space-between", "border-radius": "5px 5px 0 0", "background-color": "rgba(255, 255, 255, 0.2)", "align-items": "center"})
        tabTextEditField.css({display: "none", "background-color": "transparent", color: "inherit", "overflow": "hidden", border: "none", outline: "none", resize: "none", "box-shadow": "none"});
        tabCloseButton.attr("src", `${DwenguinoBlockly.basepath}DwenguinoIDE/img/icons/xmark-solid.svg`).css({width: "18px", height: "18px", "margin-left": "5px", "z-index": "30"})

        // Listen for saved state changes and hide star accordingly
        tabInfo.addOnSavedStateChangedListener((savedState:boolean) => { 
            tabSavedIndicator.prop("hidden", savedState);
        })

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
            tabTextEditField.select();
        })

        let handleFinishEditing = (e:any) => {
            let newText = tabTextEditField.val();
            if (newText !== undefined){
                tabInfo.setTitle(newText as string);
                tabText.text(newText as string);
                tabText.css({display: "inline"});
                tabTextEditField.css({display: "none"});
            }
            
        }

        tabTextEditField.on("focusout", (e) => {
            handleFinishEditing(e);
        })

        tabTextEditField.on("keydown", (e) => {
            if (e.key == "Enter"){
                e.preventDefault();
                handleFinishEditing(e)
            } else if (e.key == "Escape"){ // hide textarea but do not update text
                e.preventDefault();
                let oldText = tabText.text();
                tabTextEditField.val(oldText); // Set the text that was in the tab back into the textfield
                tabText.css({display: "inline"});
                tabTextEditField.css({display: "none"});
            }
        })

        tabHtml.append(tabSavedIndicator);
        tabHtml.append(tabText);
        tabHtml.append(tabTextEditField);
        tabHtml.append(tabCloseButton);
        this._tabHeaderContainer.append(tabHtml);
    }

    addTabContentPane(tabInfo:TabInfo){
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

    saveCurrentTab(){
        if (this.$_selectedTab){ 
            this.$_selectedTab.setSaved(true);
        };
    }

    saveAllTabs(){
        this.$_tabsInfo.forEach((tabInfo:TabInfo) => tabInfo.setSaved(true));
    }

    getCurrentTabData() {
        return this.$_tabsInfo.map((tabInfo) => {
            return {
                code: tabInfo.getCode(),
                title: tabInfo.getTitle()
            }
        })
    }

   
}

export default EditorPane;