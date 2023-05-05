import { css, CSSResultGroup, html, LitElement, PropertyValueMap } from "lit";
import { ref, Ref, createRef } from 'lit/directives/ref.js';
import { store } from "../../state/store"
import { connect } from "pwa-helpers"
import {customElement, property, state, query} from 'lit/decorators.js';
import { createPortfolioItem, getPortfolio, MinimalPortfolioItemInfo, PortfolioInfo, PortfolioItemInfo, savePortfolioItem, setSelectedPortfolioItems } from "../../state/features/portfolio_slice";
import { msg } from "@lit/localize";

import { LitMoveable } from "lit-moveable";
import { LitInfiniteViewer } from "lit-infinite-viewer";

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
            <lit-infinite-viewer class="root">
                    ${this.portfolio?.items.map(item => {
                        return html`
                            ${this.renderPortfolioItem(item)}
                        `
                    })}
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
                ${item.name}
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
            .renderDirections=${["sw","se"]}
        ></lit-moveable>
        `
    }

    onDrag(e, item: PortfolioItemInfo) {
        e.detail.target.style.transform = e.detail.transform;
    }

    onResize(e, item: PortfolioItemInfo) {
        e.detail.target.style.width = `${e.detail.width}px`
        e.detail.target.style.height = `${e.detail.height}px`
        e.detail.target.style.transform = e.detail.drag.transform
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
        margin: 5px;
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
