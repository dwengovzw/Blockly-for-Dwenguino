import { css, CSSResultGroup, html, LitElement, PropertyValueMap } from "lit";
import { ref, Ref, createRef } from 'lit/directives/ref.js';
import { store } from "../../state/store"
import { connect } from "pwa-helpers"
import {customElement, property, state, query} from 'lit/decorators.js';
import { createPortfolioItem, getPortfolio, MinimalPortfolioItemInfo, PortfolioInfo, PortfolioItemInfo, savePortfolioItem, setSelectedPortfolioItems } from "../../state/features/portfolio_slice";
import { msg } from "@lit/localize";
import { MouseController } from "../util/mouse_controller";

import { LitMoveable } from "lit-moveable";
import { LitInfiniteViewer } from "lit-infinite-viewer";

import "./items/text_item"
import "./items/blockly_item"
import "./items/socialrobot_design_item"
import "./items/graph_item"

@customElement("dwengo-graph-dashboard")
class GraphDashboard extends connect(store)(LitElement){
    @property() uuid: string = ""
    @state() portfolio: PortfolioInfo | null = null

    movingItem: PortfolioItemInfo | null = null
    movingItemClickOffset = {
        x: 0,
        y: 0
    }
    private mouse: MouseController = new MouseController(this)

    numberOfItems: number = 0
    itemTargets: Map<String, HTMLElement> = new Map()

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

    constructor(){
        super()
        if (customElements.get("lit-moveable") == undefined){
            customElements.define("lit-moveable", LitMoveable)
        }
    }

    stateChanged(state: any): void{
        this.portfolio = structuredClone(state.portfolio.selectedPortfolio)
        this.numberOfItems = this.portfolio?.items.length || 0
        this.itemTargets = new Map()
    }

    connectedCallback(): void {
        super.connectedCallback()
        store.dispatch(getPortfolio(this.uuid))
    }

    requestUpdate(){
        if (this.movingItem){
            const mousePosInViewPort = {
                x: this.mouse.pos.x - this.viewportRef.getBoundingClientRect().x,
                y: this.mouse.pos.y - this.viewportRef.getBoundingClientRect().y
            }
            this.movingItem.displayInformation.x = mousePosInViewPort.x - this.movingItemClickOffset.x
            this.movingItem.displayInformation.y = mousePosInViewPort.y - this.movingItemClickOffset.y
        }
        super.requestUpdate()
    }

    render() {
        return html`
            <lit-infinite-viewer class="root viewer">
                <div class="viewport">
                    ${this.portfolio?.items.map(item => {
                        return html`
                            ${this.renderPortfolioItem(item)}
                        `
                    })}
                    ${this.renderConnectionLines(this.portfolio?.items || [])}
                    ${this.renderSvgGrid()}
                    ${this.renderConnectionLine()}
                </div>
            </lit-infinite-viewer>
        `
    }

    renderConnectionLine() {
        if (this.connectionDragInfo.dragging){
            console.log(this.connectionDragInfo)
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
                let endPoint = {
                    x: (child.displayInformation.x - item.displayInformation.x)+child.displayInformation.width/2,
                    y: (child.displayInformation.y - item.displayInformation.y)+child.displayInformation.height/2
                }
                let midPoint = {
                    x: startPoint.x + (endPoint.x - startPoint.x) / 2,
                    y: startPoint.y + (endPoint.y - startPoint.y) / 2
                }
                console.log(startPoint, endPoint, midPoint)
                return html`
                    <svg class="line" style="transform: translate(${item.displayInformation.x}px, ${item.displayInformation.y}px);left:0;right:0">
                        <defs>
                            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                                <polygon points="0 0, 10 3.5, 0 7" />
                            </marker>
                        </defs>
                        <line x1="${startPoint.x}" y1="${startPoint.y}" x2="${midPoint.x}" y2="${midPoint.y}" stroke="black" stroke-width="1" marker-end="url(#arrowhead)" />
                        <line x1="${midPoint.x}" y1="${midPoint.y}" x2="${endPoint.x}" y2="${endPoint.y}" stroke="black" stroke-width="1" />
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
            @dragHandlerMouseUp=${(e) => {this.onMouseUp(e, item)}}
            @connectionDragStarted=${(e) => {this.onConnectionDragStarted(e, item)}}
            @connectionDragStopped=${(e) => {this.onConnectionDragStopped(e, item)}}
            @connectionDragEnded=${(e) => {this.onConnectionDragEnded(e, item)}}
            @connectionDragging=${(e) => {this.onConnectionDragging(e, item)}}
            class="target"
            style=${`display:inline-block;
                     width:${item.displayInformation.width}px;
                     height:${item.displayInformation.height}px;
                     transform: translate(${item.displayInformation.x}px, ${item.displayInformation.y}px)`}   >
                     <dwengo-graph-portfolio-item portfolioUUID=${this.portfolio?.uuid} item=${JSON.stringify(item)}></dwengo-graph-portfolio-item>
        </div>
       
        `
    }

    onConnectionDragStarted(e: any, item: PortfolioItemInfo) {
        console.log("Drag start");
        console.log(`clientX: ${e.detail.dragStartX}, clientY: ${e.detail.dragStartY}`);
        console.log(`clientX: ${this.viewportRef.getBoundingClientRect().x}, offsetY: ${this.viewportRef.getBoundingClientRect().y}`)
        let curentPosition = {
            x: e.detail.dragStartX - this.viewportRef.getBoundingClientRect().x,
            y: e.detail.dragStartY - this.viewportRef.getBoundingClientRect().y
        }
        this.connectionDragInfo = {
            dragging: true,
            start: curentPosition,
            end: curentPosition
        }
    }

    onConnectionDragging(e: any, item: PortfolioItemInfo) {
        console.log("Dragging");
        console.log(`clientX: ${e.detail.dragX}, clientY: ${e.detail.dragY}`);
        console.log(`clientX: ${this.viewportRef.getBoundingClientRect().x}, offsetY: ${this.viewportRef.getBoundingClientRect().y}`)
        let curentPosition = {
            x: e.detail.dragX - this.viewportRef.getBoundingClientRect().x,
            y: e.detail.dragY - this.viewportRef.getBoundingClientRect().y
        }
        this.connectionDragInfo.end = curentPosition
        this.connectionDragInfo = { ...this.connectionDragInfo }
    }

    onConnectionDragStopped(e: any, item: PortfolioItemInfo) {
        this.connectionDragInfo.dragging = false
        this.connectionDragInfo = { ...this.connectionDragInfo }
    }

    onConnectionDragEnded(e: any, item: PortfolioItemInfo) {
        console.log("Drag end");
        console.log(`clientX: ${e.detail.dragEndX}, clientY: ${e.detail.dragEndY}`);
        console.log(`clientX: ${this.viewportRef.getBoundingClientRect().x}, offsetY: ${this.viewportRef.getBoundingClientRect().y}`)
        this.connectionDragInfo.dragging = false
        this.connectionDragInfo = { ...this.connectionDragInfo }
    }


    onMouseDown(e: CustomEvent, item: PortfolioItemInfo){
        this.movingItemClickOffset = {
            x: e.detail.offsetX,
            y: e.detail.offsetY
        }
        this.movingItem = item
        
    }
    onMouseUp(e: CustomEvent, item: PortfolioItemInfo){
        this.movingItem = null
    }



    // TODO: Rethink this approach
    mapItemToElement(item){
        const itemType: string = item?.__t || ""
        switch(itemType){
            case "TextItem":
                return html`<dwengo-portfolio-text-item portfolioUUID=${this.portfolio?.uuid} item=${JSON.stringify(item)}></dwengo-portfolio-text-item>`
            case "BlocklyProgSequenceItem":
                return html`<dwengo-portfolio-blockly-code-item portfolioUUID=${this.portfolio?.uuid} item=${JSON.stringify(item)}></dwengo-portfolio-blockly-code-item>`
            case "SocialRobotDesignItem":
                return html`<dwengo-portfolio-socialrobot-design-item portfolioUUID=${this.portfolio?.uuid} item=${JSON.stringify(item)}></dwengo-portfolio-socialrobot-design-item>`
            default:    
                return html`${msg("Unknown item type")}`
        }
    }

    static styles: CSSResultGroup = css`
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
        padding: 5px;
        background-color: white;
        z-index: 1;
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
     `
}
