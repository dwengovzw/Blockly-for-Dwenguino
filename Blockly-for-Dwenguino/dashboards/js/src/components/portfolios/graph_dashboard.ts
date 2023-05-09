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
                </div>
            </lit-infinite-viewer>
        `
    }

    renderConnectionLines(items){
        return html`
        ${items.map(item => {
            return html`${item.children.map(child => {
                return html`
                    <svg class="line" style="transform: translate(${item.displayInformation.x}px, ${item.displayInformation.y}px);left:0;right:0">
                        <path 
                            id="line_${item.uuid}_${child.uuid}	" 
                            d="M ${item.displayInformation.width/2} ${item.displayInformation.height/2} L ${(child.displayInformation.x - item.displayInformation.x)+child.displayInformation.width/2} ${(child.displayInformation.y - item.displayInformation.y)+child.displayInformation.height/2} Z"
                            stroke="black"
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
            @mousedown=${(e) => {this.onMouseDown(e, item)}}
            @mouseup=${(e) => {this.onMouseUp(e, item)}}
            @touchstart=${(e) => {this.onMouseDown(e, item)}}
            @touchend=${(e) => {this.onMouseUp(e, item)}}
            class="target"
            style=${`display:inline-block;
                     width:${item.displayInformation.width}px;
                     height:${item.displayInformation.height}px;
                     transform: translate(${item.displayInformation.x}px, ${item.displayInformation.y}px)`}   >
                     <dwengo-graph-portfolio-item portfolioUUID=${this.portfolio?.uuid} item=${JSON.stringify(item)}></dwengo-graph-portfolio-item>
        </div>
       
        `
    }

    onMouseDown(e: MouseEvent, item: PortfolioItemInfo){
        this.movingItemClickOffset = {
            x: e.offsetX,
            y: e.offsetY
        }
        this.movingItem = item
        
    }
    onMouseUp(e: MouseEvent, item: PortfolioItemInfo){
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
