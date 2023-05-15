import { css, CSSResultGroup, html, LitElement, PropertyValueMap, PropertyValues } from "lit";
import { ref, Ref, createRef } from 'lit/directives/ref.js';
import { store } from "../../state/store"
import { connect } from "pwa-helpers"
import {customElement, property, state, query} from 'lit/decorators.js';
import { createPortfolioItem, getPortfolio, MinimalPortfolioItemInfo, PortfolioInfo, PortfolioItemInfo, savePortfolioItem, setSelectedPortfolioItems } from "../../state/features/portfolio_slice";
import { msg } from "@lit/localize";

import { LitInfiniteViewer } from "lit-infinite-viewer";

import "./items/text_item"
import "./items/blockly_item"
import "./items/socialrobot_design_item"
import "./items/graph_item"
import { UserInfo } from "../../state/features/user_slice";
import { buttonStyles } from "../../styles/shared";
import { getGoogleMateriaIconsLinkTag } from "../../util";

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
        y: 0
    }
    numberOfItems: number = 0

    @query(".viewport")
    viewportRef!: HTMLElement

    @query(".root") 
    containerRef!: LitInfiniteViewer

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

    scrollOptions: any = {
        container: () => this.containerRef,
        threshold: 20,
        getScrollPosition: () => {
            return [
                this.containerRef?.scrollLeft,
                this.containerRef?.scrollTop,
            ];
        }
    };

    protected willUpdate(changedProperties: PropertyValueMap<this>) {
        if (changedProperties.has("portfolioProp")){
            this.portfolio = structuredClone(this.portfolioProp)
        }
    }
    firstUpdated(_changedProperties: PropertyValueMap<this>) {  
        super.firstUpdated(_changedProperties);
        window.addEventListener("touchend", (e) => {
            this.onMouseUp()
        })
        window.addEventListener("mouseup", (e) => {
            this.onMouseUp()
        })
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));
    }

    disconnectedCallback() {
        window.removeEventListener("touchend", (e) => {
            this.onMouseUp()
        })
        window.removeEventListener("mouseup", (e) => {
            this.onMouseUp()
        })
        window.removeEventListener('mousemove', this.onMouseMove);
        super.disconnectedCallback();
    }


    render() {
        return html`
            ${getGoogleMateriaIconsLinkTag()}
            <lit-infinite-viewer class="root viewer">
                <div 
                    class="viewport"
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
                        ${this.renderConnectionLines(this.portfolio?.items || [])}
                        ${this.renderSvgGrid()}
                        ${this.renderConnectionLine()}
                        ${this.renderAddItemContextMenu()}
                </div>
            </lit-infinite-viewer>
        `
    }
 

    // TODO: make items shown dynamic based on the role of the user
    renderAddItemContextMenu() {
        if (this.addItemContextMenuInfo.show){
            return html`
                <div class="add_item_context_menu" style="left:${this.addItemContextMenuInfo.x}px;top:${this.addItemContextMenuInfo.y}px">
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
                        <div class="add_item_context_menu_item dwengo-button dwengo-button-icon" @click=${() => this.onAddItemContextMenuClick("text")}>
                            ${msg("TEXT")}
                        </div>
                        <div class="add_item_context_menu_item dwengo-button dwengo-button-icon" @click=${() => this.onAddItemContextMenuClick("blockly")}>
                            ${msg("BLOCKLY")}
                        </div>
                        <div class="add_item_context_menu_item dwengo-button dwengo-button-icon" @click=${() => this.onAddItemContextMenuClick("socialrobot_design")}>
                            ${msg("SOCIAL_ROBOT_DESIGN")}
                        </div>
                        <div class="add_item_context_menu_item dwengo-button dwengo-button-icon" @click=${() => this.onAddItemContextMenuClick("graph")}>
                            ${msg("FEEDBACK")}
                        </div>
                    </div>
                    <div class="add_item_context_menu_footer></div>
                </div>
            `
        } else {
            return ""
        }
    }

    onAddItemContextMenuClick(type: string) {
        console.log("adding item ", type);
        this.closeAddItemContextMenu()
        // const item = createPortfolioItem(type)
        // this.portfolio?.items.push(item)
        // this.portfolio = structuredClone(this.portfolio)
        // this.numberOfItems++
        // this.requestUpdate()
    }

    closeAddItemContextMenu() {
        this.addItemContextMenuInfo.show = false
        this.addItemContextMenuInfo = structuredClone(this.addItemContextMenuInfo)
        this.connectionDragInfo.dragging = false
        this.connectionDragInfo = { ...this.connectionDragInfo }
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
                            x1="${startPoint.x}" 
                            y1="${startPoint.y}" 
                            x2="${midPoint.x}" 
                            y2="${midPoint.y}" 
                            stroke="black" 
                            stroke-width="1"
                            marker-end="url(#arrowhead)" />
                        <line 
                            x1="${midPoint.x}" 
                            y1="${midPoint.y}" 
                            x2="${endPoint.x}" 
                            y2="${endPoint.y}" 
                            stroke="black" 
                            stroke-width="1" />
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
            class="target"
            style=${`display:inline-block;
                     width:${item.displayInformation.width}px;
                     height:${item.displayInformation.height}px;
                     transform: translate(${item.displayInformation.x}px, ${item.displayInformation.y}px)`}   >
                     <dwengo-graph-portfolio-item .userInfo=${this.userInfo} .portfolioUUID=${this.portfolio?.uuid} .item=${item}></dwengo-graph-portfolio-item>
        </div>
       
        `
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
        this.droppedOnViewport = true
        console.log("Drop on viewport")
        console.log(e);
        this.addItemContextMenuInfo = {
            x: e.clientX - this.viewportRef.getBoundingClientRect().x,
            y: e.clientY - this.viewportRef.getBoundingClientRect().y,
            show: true
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
        border: 1px solid var(--theme-accentFillSelected);
        box-sizing: border-box;
        overflow: hidden;
        background-color: white;
        z-index: 1;
        padding: 4px;
    }
    .line {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: visible;
    }
    .drag_line {
        color: var(--theme-accentFillSelected);
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
    .add_item_context_menu {
        position: absolute;
        background-color: var(--theme-white);
        border-color: var(--theme-accentFillSelected);
        border-style: solid;
        border-width: 1px;
        border-radius: 5px;
        padding: 2px;
        min-width: 200px;
        box-shadow: 0px 0px 10px var(--theme-accentFillSelected);
    }
    .add_item_context_menu_header{
        display: flex;
        flex-direction: row-reverse;
    }
    .add_item_context_menu_item {
        padding: 2.5px 5px;
    }
     `, buttonStyles]
}
