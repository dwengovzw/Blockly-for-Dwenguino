import { css, CSSResultGroup, html, LitElement, PropertyValueMap } from "lit";
import { ref, Ref, createRef } from 'lit/directives/ref.js';
import { store } from "../../state/store"
import { connect } from "pwa-helpers"
import {customElement, property, state, query} from 'lit/decorators.js';
import { createPortfolioItem, getPortfolio, MinimalPortfolioItemInfo, PortfolioInfo, PortfolioItemInfo, savePortfolioItem, setSelectedPortfolioItems } from "../../state/features/portfolio_slice";
import { msg } from "@lit/localize";

import { LitMoveable } from "lit-moveable";
import { LitInfiniteViewer } from "lit-infinite-viewer";

import "./items/text_item"
import "./items/blockly_item"
import "./items/socialrobot_design_item"

@customElement("dwengo-graph-dashboard")
class GraphDashboard extends connect(store)(LitElement){
    @property() uuid: string = ""
    @state() portfolio: PortfolioInfo | null = null

    numberOfItems: number = 0
    itemTargets: Map<String, HTMLElement> = new Map()

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


    render() {
        return html`
            <lit-infinite-viewer class="root viewer">
                <div class="viewport">
                    ${this.portfolio?.items.map(item => {
                        return html`
                            ${this.renderPortfolioItem(item)}
                        `
                    })}
                    ${this.portfolio?.items.map(item => {
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
                    })}
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
                </div>
            </lit-infinite-viewer>
        `
    }

    // TODO: set item size and position based on portfolio item info
    renderPortfolioItem(item: PortfolioItemInfo){
        return html`
        <div class="target"
            ${ref((el: Element | undefined) => {
                    if (this.numberOfItems !== this.itemTargets.size){ //Only add if not all items are added yet
                        if (el) { // Only add if element is not undefined
                            this.itemTargets.set(item.uuid, el as HTMLElement)
                            if (this.numberOfItems == this.itemTargets.size){ // If all items are added, rerender to update moveable
                                // Rerender
                                this.requestUpdate()
                            }
                        }
                    }
                })
            }
            style=${`display:inline-block;
                     width:${item.displayInformation.width}px;
                     height:${item.displayInformation.height}px;
                     transform: translate(${item.displayInformation.x}px, ${item.displayInformation.y}px)`}   >
                ${this.mapItemToElement(item)}
        </div>
        <lit-moveable
            .scrollable=${true}
            .scrollOptions=${this.scrollOptions}
            .target=${this.itemTargets.get(item.uuid)}
            .litDraggable=${false}
            .resizable=${true}
            .edgeDraggable=${true}
            .zoom=${0.5}
            @litDrag=${(e) => { this.onDrag(e, item)}}
            @litResize=${(e) => { this.onResize(e, item)}}
            @litResizeEnd=${(e) => { this.onResizeEnd(e, item)}}
            .renderDirections=${["sw","se"]}
        ></lit-moveable>
        `
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

    onDrag(e, item: PortfolioItemInfo) {
        //e.detail.target.style.transform = e.detail.transform;
        // Update item position
        item.displayInformation.x = e.detail.translate[0]
        item.displayInformation.y = e.detail.translate[1]
        this.requestUpdate()
    }

    onResizeEnd(e, item: PortfolioItemInfo) {
        // Update item size and position
        item.displayInformation.width = e.detail.lastEvent.width
        item.displayInformation.height = e.detail.lastEvent.height
        item.displayInformation.x = e.detail.lastEvent.drag.translate[0]
        item.displayInformation.y = e.detail.lastEvent.drag.translate[1]
        this.requestUpdate()
    }

    onResize(e, item: PortfolioItemInfo) {
        e.detail.target.style.width = `${e.detail.width}px`
        e.detail.target.style.height = `${e.detail.height}px`
        e.detail.target.style.transform = e.detail.drag.transform
        // Update item size and position
        //item.displayInformation.width = e.detail.width
        //item.displayInformation.height = e.detail.height
        //item.displayInformation.x = e.detail.translate[0]
        //item.displayInformation.y = e.detail.translate[1]
        this.requestUpdate()
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
