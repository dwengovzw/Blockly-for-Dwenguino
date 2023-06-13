import { css, CSSResultGroup, html, LitElement, PropertyValueMap, svg } from "lit";
import { store } from "../../state/store"
import { connect } from "pwa-helpers"
import {customElement, property, state, query} from 'lit/decorators.js';
import { createPortfolioItem, MinimalDisplayedPortfolioItemInfo, MinimalPortfolioItemInfo, PortfolioInfo, PortfolioItemInfo, savePortfolioItem, setSelectedPortfolioItems, TextItemInfo } from "../../state/features/portfolio_slice";
import { msg } from "@lit/localize";

import { LitInfiniteViewer } from "lit-infinite-viewer";

import "./items/text_item"
import "./items/blockly_item"
import "./items/socialrobot_design_item"
import "./items/graph_item"
import { UserInfo } from "../../state/features/user_slice";
import { borderStyle, buttonStyles } from "../../styles/shared";
import { getGoogleMateriaIconsLinkTag } from "../../util";
import { getAllowedItemsForRoles, getAllowedItemsForSourceItemType, ITEMTYPES } from "../../../../../../backend/config/itemtypes.config";
import { NotificationMessageType, setNotificationMessage } from "../../state/features/notification_slice";

@customElement("dwengo-graph-portfolio")
class GraphDashboard extends connect(store)(LitElement){
    
    @property({type: Object}) 
    userInfo: UserInfo | null = store.getState().user
    @property({type: Object}) 
    portfolioProp: PortfolioInfo | null = store.getState().portfolio.selectedPortfolio
    @state() portfolio: PortfolioInfo | null = null

    @state()
    movingItem: PortfolioItemInfo | null = null
    movingItemClickOffset = {
        x: 0,
        y: 0
    }
    @state()
    addItemContextMenuInfo = {
        show: false,
        x: 0,
        y: 0, 
        sourceItemUUID: null
    }
    @state()
    deleteConnectionLineContextMenuInfo = {
        show: false,
        x: 0,
        y: 0,
        fromUUID: "",
        toUUID: "",
    }

    @query(".viewport")
    viewportRef!: HTMLElement

    @state()
    connectionDragInfo = {
        dragging: false,
        start: {
            x: 0,
            y: 0
        },
        end: {
            x: 0,
            y: 0
        }
    }

    droppedOnViewport = false

    protected willUpdate(changedProperties: PropertyValueMap<this>) {
        if (changedProperties.has("portfolioProp")){
            this.portfolio = structuredClone(this.portfolioProp)
            // Map children to items in the portfolio.
            if (!this.portfolio) return
            this.portfolio.items = this.portfolio.items.map(item => {
                let mappedChildren = item.children.map(childItem => {
                        return this.portfolio?.items.find(item => item.uuid === childItem.uuid)
                    })
                item.children = mappedChildren.filter(item => item) as PortfolioItemInfo[]
                return item
            })
        }
    }

    touchEndHandler(e: TouchEvent) {
        this.onMouseUp()
    }
    mouseUpHandler(e: MouseEvent) {
        this.onMouseUp()
    }
    mouseMoveHandler(e: MouseEvent) {
        this.onMouseMove(e)
    }
    firstUpdated(_changedProperties: PropertyValueMap<this>) {  
        super.firstUpdated(_changedProperties);
        window.addEventListener("touchend", this.touchEndHandler.bind(this))
        window.addEventListener("mouseup", this.mouseUpHandler.bind(this))
        window.addEventListener('mousemove', this.mouseMoveHandler.bind(this));
    }

    disconnectedCallback() {
        window.removeEventListener("touchend", this.touchEndHandler)
        window.removeEventListener("mouseup", this.mouseUpHandler)
        window.removeEventListener('mousemove', this.mouseMoveHandler);
        super.disconnectedCallback();
    }


    render() {
        return html`
            ${getGoogleMateriaIconsLinkTag()}
            <lit-infinite-viewer class="root viewer">
                <div 
                    class="viewport"
                    @contextmenu=${(e: MouseEvent) => {
                        console.log(e)
                        this.addItemContextMenuInfo = {
                            show: true,
                            x: e.clientX - this.viewportRef.getBoundingClientRect().x,
                            y: e.clientY - this.viewportRef.getBoundingClientRect().y, 
                            sourceItemUUID: null
                        }
                        e.preventDefault()
                        e.stopPropagation()
                    }}
                    @dragover=${(e: DragEvent) => {
                        e.preventDefault()
                        e.stopPropagation()
                    }}
                    @dragenter=${(e: DragEvent) => {
                        e.preventDefault()
                        e.stopPropagation()
                    }}
                    @drop=${(e) => {
                        this.onViewPortDrop(e)
                    }}>
                        ${this.portfolio?.items.map(item => {
                            return html`
                                ${this.renderPortfolioItem(item)}
                            `
                        })}
                        ${this.renderAddItemContextMenu()}
                        ${this.renderDeleteConnectionLineContextMenu()}
                        ${this.renderSvgGrid()}
                        ${this.renderConnectionLines(this.portfolio?.items || [])}
                        ${this.renderConnectionLine()}
                </div>
            </lit-infinite-viewer>
        `
    }
 
    renderDeleteConnectionLineContextMenu() {
        if (this.deleteConnectionLineContextMenuInfo.show){
            return html`
                <div class="context_menu" style="left:${this.deleteConnectionLineContextMenuInfo.x}px;top:${this.deleteConnectionLineContextMenuInfo.y}px">
                    <div class="delete_connection_line_context_menu_header">
                        <button class="delete_connection_line_context_menu_close_button dwengo-button" @click=${() => {
                            this.deleteConnectionLineContextMenuInfo.show = false
                            this.requestUpdate()
                        }} >
                            <span class="dwengo-button-icon material-symbols-outlined">
                                close
                            </span>
                        </button>
                    </div>
                    <div class="delete_connection_line_context_menu_item dwengo-button dwengo-button-icon" @click=${() => this.handleDeleteConnectionClick()}>
                        ${msg("DELETE")}
                    </div>
                </div>
            `
        } else {
            return html``
        }
    }


    // TODO: make items shown dynamic based on the role of the user
    renderAddItemContextMenu() {
        if (this.addItemContextMenuInfo.show){
            return html`
                <div class="context_menu" style="left:${this.addItemContextMenuInfo.x}px;top:${this.addItemContextMenuInfo.y}px">
                    <div class="add_item_context_menu_header">
                        <button class="add_item_context_menu_close_button dwengo-button" @click=${() => {
                            this.closeAddItemContextMenu()
                        }}>
                            <span class="dwengo-button-icon material-symbols-outlined">
                                close
                            </span>
                        </button>
                    </div>
                    <div class="add_item_context_menu_content">
                    ${getAllowedItemsForRoles(this.userInfo?.roles || [])
                        .filter(itemType => (getAllowedItemsForSourceItemType(this.portfolio?.items.find(item => item.uuid === this.addItemContextMenuInfo.sourceItemUUID)?.__t) || ITEMTYPES.None).includes(itemType))
                            .map(itemType => {
                                return html`
                                    <div class="add_item_context_menu_item dwengo-button dwengo-button-icon" @click=${(e) => this.onAddItemContextMenuClick(e, itemType)}>
                                        ${msg(itemType)}
                                    </div>
                                `
                    })}
                    </div>
                    <div class="add_item_context_menu_footer></div>
                </div>
            `
        } else {
            return ""
        }
    }

    renderConnectionLine() {
        if (this.connectionDragInfo.dragging){
            const xEnd = this.connectionDragInfo.end.x - this.connectionDragInfo.start.x
            const yEnd = this.connectionDragInfo.end.y - this.connectionDragInfo.start.y
            return html`
                <svg class="line drag_line" style="transform: translate(${this.connectionDragInfo.start.x}px, ${this.connectionDragInfo.start.y}px);left:0;right:0">
                    <defs>
                        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#6DA037" stroke="#6DA037" />
                        </marker>
                    </defs>
                    <line x1="0" y1="0" x2="${xEnd/2}" y2="${yEnd/2}" stroke="#6DA037" stroke-width="1" marker-end="url(#arrowhead)" />
                    <line x1="${xEnd/2}" y1="${yEnd/2}" x2="${xEnd}" y2="${yEnd}" stroke="#6DA037" stroke-width="1" />
                </svg>
            `
        } else { 
            return html``
        }
    }

    renderConnectionLines(items){
        return html`
        ${items.map(item => {
            let startPoint = {
                x: item.displayInformation.width/2,
                y: item.displayInformation.height/2
            }
            return html`${item.children.map(child => {
                if (!child) return html``
                let endPoint = {
                    x: (child.displayInformation.x - item.displayInformation.x)+child.displayInformation.width/2,
                    y: (child.displayInformation.y - item.displayInformation.y)+child.displayInformation.height/2
                }
                let midPoint = {
                    x: startPoint.x + (endPoint.x - startPoint.x) / 2,
                    y: startPoint.y + (endPoint.y - startPoint.y) / 2
                }
                return html`
                    <svg class="line" style="transform: translate(${item.displayInformation.x}px, ${item.displayInformation.y}px);left:0;right:0">
                        <defs>
                            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                                <polygon points="0 0, 10 3.5, 0 7" />
                            </marker>
                        </defs>
                        <line 
                            class="portfolio-connection-line"
                            @click=${(e) => this.handleConnectionLineClick(e, item.uuid, child.uuid)}
                            x1="${startPoint.x}" 
                            y1="${startPoint.y}" 
                            x2="${midPoint.x}" 
                            y2="${midPoint.y}" 
                            stroke="black" 
                            stroke-width="3"
                            marker-end="url(#arrowhead)" />
                        <line 
                            class="portfolio-connection-line"
                            @click=${(e) => this.handleConnectionLineClick(e, item.uuid, child.uuid)}
                            x1="${midPoint.x}" 
                            y1="${midPoint.y}" 
                            x2="${endPoint.x}" 
                            y2="${endPoint.y}" 
                            stroke="black" 
                            stroke-width="3" />
                    </svg>
                `
            })}
            `
        })}`
    }

    renderSvgGrid() {
        return html`
            <svg width="100%" height="100%" style="position: absolute; top: 0; left: 0;">
                <defs>
                    <pattern id="smallGrid" width="8" height="8" patternUnits="userSpaceOnUse">
                        <path d="M 8 0 L 0 0 0 8" fill="none" stroke="gray" stroke-width="0.25"/>
                    </pattern>
                    <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
                        <rect width="80" height="80" fill="url(#smallGrid)"/>
                        <path d="M 80 0 L 0 0 0 80" fill="none" stroke="gray" stroke-width="1"/>
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
        `
    }

    // TODO: set item size and position based on portfolio item info
    renderPortfolioItem(item: PortfolioItemInfo){
        return html`
        <div 
            @dragHandlerMouseDown=${(e) => {this.onMouseDown(e, item)}}
            @dragHandlerMouseUp=${(e) => {this.onMouseUp()}}
            @connectionDragStarted=${(e) => {this.onConnectionDragStarted(e, item)}}
            @connectionDragStopped=${(e) => {this.onConnectionDragStopped(e, item)}}
            @connectionDragging=${(e) => {this.onConnectionDragging(e, item)}}
            @connectionDragDrop=${(e) => {this.onConnectionDragDrop(e, item)}}
            class="target dwengo-border ${(this.userInfo?.roles.includes("teacher") && item.needsTeacherAttention) || (this.userInfo?.roles.includes("student") && item.needsStudentAttention) ? "needs_attention" : ""}"
            style=${`display:inline-block;
                     width:${item.displayInformation.width}px;
                     height:${item.displayInformation.height}px;
                     transform: translate(${item.displayInformation.x}px, ${item.displayInformation.y}px)`}   >
                     <dwengo-graph-portfolio-item .userInfo=${this.userInfo} .portfolioUUID=${this.portfolio?.uuid} .item=${item}></dwengo-graph-portfolio-item>
        </div>
       
        `
    }

        // TODO: Rethink this approach
    mapItemToElement(item){
        const itemType: string = item?.__t || ""
        switch(itemType){
            case "TextItem":
                return html`<dwengo-portfolio-text-item .portfolioUUID=${this.portfolio?.uuid} .item=${item}></dwengo-portfolio-text-item>`
            case "BlocklyProgSequenceItem":
                return html`<dwengo-portfolio-blockly-code-item .portfolioUUID=${this.portfolio?.uuid} .item=${item}></dwengo-portfolio-blockly-code-item>`
            case "SocialRobotDesignItem":
                return html`<dwengo-portfolio-socialrobot-design-item .portfolioUUID=${this.portfolio?.uuid} .item=${item}></dwengo-portfolio-socialrobot-design-item>`
            default:    
                return html`${msg("Unknown item type")}`
        }
    }

    onAddItemContextMenuClick(e: MouseEvent, type: string) {
        let sourceItem = this.portfolio?.items.filter(item => item.uuid === this.addItemContextMenuInfo.sourceItemUUID)[0]
        switch(type){
            case ITEMTYPES.TextItem:
                const newItem: MinimalDisplayedPortfolioItemInfo = {
                    __t: ITEMTYPES.TextItem,
                    name: msg("New text item"),
                    children: [],
                    displayInformation: {
                        x: this.addItemContextMenuInfo.x,
                        y: this.addItemContextMenuInfo.y,
                    },
                }
                // sourceItem?.children.push(newItem)
                // this.requestUpdate()
                if (this.portfolio){
                    store.dispatch(createPortfolioItem(this.portfolio?.uuid, newItem, sourceItem))
                }
                break
            case ITEMTYPES.BlocklyProgram:
                const newBlocklyItem: MinimalDisplayedPortfolioItemInfo = {
                    __t: ITEMTYPES.BlocklyProgram,
                    name: msg("New text item"),
                    children: [],
                    displayInformation: {
                        x: this.addItemContextMenuInfo.x,
                        y: this.addItemContextMenuInfo.y,
                    },
                }
                if (this.portfolio){
                    store.dispatch(createPortfolioItem(this.portfolio?.uuid, newBlocklyItem, sourceItem))
                }
                break
            default:
                console.log(`Item type ${type} not implemented yet.`)
        }
        this.closeAddItemContextMenu()
    }

    closeAddItemContextMenu() {
        this.addItemContextMenuInfo.show = false
        this.addItemContextMenuInfo.sourceItemUUID = null
        this.addItemContextMenuInfo = structuredClone(this.addItemContextMenuInfo)
        this.connectionDragInfo.dragging = false
        this.connectionDragInfo = { ...this.connectionDragInfo }
    }

    handleConnectionLineClick(e: MouseEvent, fromUUID: string, toUUID: string) {
        this.deleteConnectionLineContextMenuInfo = {
            show: true,
            fromUUID: fromUUID,
            toUUID: toUUID,
            x: e.clientX - this.viewportRef.getBoundingClientRect().x,
            y: e.clientY - this.viewportRef.getBoundingClientRect().y,
        }
    }

    handleDeleteConnectionClick() {
        this.deleteConnectionLineContextMenuInfo.show = false
        let sourceItem = this.portfolio?.items.filter(item => item.uuid === this.deleteConnectionLineContextMenuInfo.fromUUID)[0]
        if (!sourceItem || !this.portfolio) return
        sourceItem.children = sourceItem.children.filter(child => child.uuid !== this.deleteConnectionLineContextMenuInfo.toUUID)
        store.dispatch(savePortfolioItem(this.portfolio?.uuid, sourceItem))
        this.portfolio = structuredClone(this.portfolio)
    }

    onConnectionDragStarted(e: any, item: PortfolioItemInfo) {
        let curentPosition = {
            x: e.detail.dragStartX - this.viewportRef.getBoundingClientRect().x,
            y: e.detail.dragStartY - this.viewportRef.getBoundingClientRect().y
        }
        this.droppedOnViewport = false
        this.connectionDragInfo = {
            dragging: true,
            start: curentPosition,
            end: curentPosition
        }
    }

    onConnectionDragging(e: any, item: PortfolioItemInfo) {
        let curentPosition = {
            x: e.detail.dragX - this.viewportRef.getBoundingClientRect().x,
            y: e.detail.dragY - this.viewportRef.getBoundingClientRect().y
        }
        this.connectionDragInfo.end = curentPosition
        this.connectionDragInfo = { ...this.connectionDragInfo }
    }

    onConnectionDragStopped(e: any, item: PortfolioItemInfo) {
        if (!this.droppedOnViewport) {
            this.closeAddItemContextMenu()
        }
    }

    onConnectionDragDrop(e: any, item: PortfolioItemInfo) {
        this.connectionDragInfo.dragging = false;
        let startItem = this.portfolio?.items.find(i => i.uuid === e.detail.fromItemUUID)
        let endItem = this.portfolio?.items.find(i => i.uuid === e.detail.toItemUUID)
        if (startItem && endItem) {
            startItem.children.push(endItem)
            startItem = { ...startItem }
        }
        this.connectionDragInfo = { ...this.connectionDragInfo }
    }
    
    onViewPortDrop(e: DragEvent) {
        if (!e.dataTransfer){
            store.dispatch(setNotificationMessage(msg("No data transfer found"), NotificationMessageType.ERROR, 3000))
            return
        }
        let fromItemUUID = JSON.parse(e.dataTransfer.getData("text/plain"))
        this.droppedOnViewport = true
        console.log("Drop on viewport")
        console.log(e);
        this.addItemContextMenuInfo = {
            x: e.clientX - this.viewportRef.getBoundingClientRect().x,
            y: e.clientY - this.viewportRef.getBoundingClientRect().y,
            show: true,
            sourceItemUUID: fromItemUUID
        }
        e.preventDefault()
        e.stopPropagation()
    }

    onMouseDown(e: CustomEvent, item: PortfolioItemInfo){
        this.movingItemClickOffset = {
            x: e.detail.offsetX,
            y: e.detail.offsetY
        }
        this.movingItem = item
        
    }

    onMouseMove(e: MouseEvent){
        if (this.movingItem){
            let newPosition = {
                x: e.clientX - this.viewportRef.getBoundingClientRect().x - this.movingItemClickOffset.x,
                y: e.clientY - this.viewportRef.getBoundingClientRect().y - this.movingItemClickOffset.y
            }
            this.movingItem.displayInformation.x = newPosition.x
            this.movingItem.displayInformation.y = newPosition.y
            this.movingItem = { ...this.movingItem }
        }
    }

    onMouseUp(){
        if (this.movingItem && this.portfolio?.uuid){
            store.dispatch(savePortfolioItem(this.portfolio?.uuid, this.movingItem))
        }
        this.movingItem = null
    }



    static styles: CSSResultGroup = [css`
     .root {
        position: relative;
        width: 100%;
        height: calc(100vh - 112px);
        display: inline-block;
     }
     .container {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        display: inline-block;
        border: 1px solid rgb(204, 204, 204);
        overflow: hidden;
     }
     .target {
        position: absolute;
        box-sizing: border-box;
        overflow: hidden;
        background-color: white;
        z-index: 1;
        padding: 4px;
    }
    .needs_attention {
        border-color: var(--theme-accentForegroundHighlight) !important;
        box-shadow: 0px 0px 20px var(--theme-accentFillSelected) !important;
    }
    .line {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: visible;
    }
    .portfolio-connection-line{
        cursor: pointer;
        z-index: 500;
        pointer-events: painted;
    }
    .drag_line {
        color: var(--theme-accentFillSelected);
    }
    svg {
        pointer-events: none;
    }
    .viewport {
        width: 100%;
        height: 100%;
        position: absolute;
    }

    .moveable-control.moveable-origin {
        border-color: transparent!important;
    }

    .moveable-control.moveable-direction {
        border: none;
        visibility: visible!important;
        background-color: var(--theme-accentFillSelected);
    }   
    .moveable-control.moveable-direction.moveable-nw {
        visibility: hidden!important;
    }   

    .moveable-control.moveable-direction.moveable-ne {
        visibility: hidden!important;
    }
    
    .moveable-line.moveable-direction {
        background-color: var(--theme-accentFillSelected);
    }

    .moveable-line.moveable-direction.moveable-edge.moveable-n {
        border-top-right-radius: 5px;
        border-top-left-radius: 5px;
        border-top: 20px solid var(--theme-accentFillSelected);
    }
  
    .context_menu {
        position: absolute;
        background-color: var(--theme-white);
        border-color: var(--theme-accentFillSelected);
        border-style: solid;
        border-width: 1px;
        border-radius: 5px;
        padding: 2px;
        min-width: 200px;
        box-shadow: 0px 0px 10px var(--theme-accentFillSelected);
        z-index: 100;
    }
    .add_item_context_menu_header{
        display: flex;
        flex-direction: row-reverse;
    }
    .add_item_context_menu_item {
        padding: 2.5px 5px;
    }
     `, buttonStyles, borderStyle]
}
