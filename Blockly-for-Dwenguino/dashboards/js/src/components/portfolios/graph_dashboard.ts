import { css, CSSResultGroup, html, LitElement, PropertyValueMap } from "lit";
import { ref, Ref, createRef } from 'lit/directives/ref.js';
import { store } from "../../state/store"
import { connect } from "pwa-helpers"
import {customElement, property, state, query} from 'lit/decorators.js';
import { createPortfolioItem, getPortfolio, MinimalPortfolioItemInfo, PortfolioInfo, PortfolioItemInfo, savePortfolioItem, setSelectedPortfolioItems } from "../../state/features/portfolio_slice";
import { msg } from "@lit/localize";

import { LitMoveable } from "lit-moveable";

@customElement("dwengo-graph-dashboard")
class GraphDashboard extends connect(store)(LitElement){
    @property() uuid: string = ""
    @state() portfolio: PortfolioInfo | null = null

    @query('.target')
    target!: HTMLElement;
    @query(".container")
    container!: HTMLElement;
    translation = [0, 0]

    maxWidth: any = "400px";
    maxHeight: any = "400px";
    minWidth: any = "50px";
    minHeight: any = "40px";
    resizable: any = true;
    keepRatio: any = false;
    throttleResize: any = 1;
    renderDirections: any = ["nw","n","ne","w","e","sw","s","se"];

    constructor(){
        super()
        if (customElements.get("lit-moveable") == undefined){
            customElements.define("lit-moveable", LitMoveable)
        }
    }

    stateChanged(state: any): void{
        console.log(state)
        this.portfolio = structuredClone(state.portfolio.selectedPortfolio)
        
    }

    connectedCallback(): void {
        super.connectedCallback()
        store.dispatch(getPortfolio(this.uuid))
    }

    onDrag(e) {
        e.detail.target.style.transform = e.detail.transform;
        this.translate = e.detail.beforeTranslate;
    }

    onResize(e) {
        const beforeTranslate = e.detail.drag.beforeTranslate
        e.detail.target.style.width = `${e.detail.width}px`
        e.detail.target.style.height = `${e.detail.height}px`
        e.detail.target.style.transform = `translate(${beforeTranslate[0]}px, ${beforeTranslate[1]}px)`
        this.translation = beforeTranslate
    }

    onDragStart(e) {
        e.detail.set(this.translation)
    }

    onResizeStart(e) {
        e.detail.dragStart && e.detail.dragStart.set(this.translation);
    }

    render() {
        return html`
            <div class="root">
                <div class="container">
                    <div class="target">
                            Target
                    </div>
                    <lit-moveable
                      .target=${this.target}
                      .litDraggable=${true}
                      .throttleDrag=${1}
                      .edgeDraggable=${false}
                      .startDragRotate=${0}
                      .throttleDragRotate=${0}
                      .resizable=${this.resizable}
                      .keepRatio=${this.keepRatio}
                      @litDrag=${this.onDrag}
                      .renderDirections=${this.renderDirections}
                      @litResize=${this.onResize}
                  ></lit-moveable>
            </div>
        `
    }

    static styles: CSSResultGroup = css`
     .container {
        position: relative;
        width: 100%;
        height: 90vh;
        overflow: hidden;
        border: 1px solid #ccc;
     }
     .margin .root {
            position: static;
        }
        .description {
            padding: 10px;
        }
        .root {
            position: relative;
        }

        .target {
            position: absolute;
            width: 100px;
            height: 100px;
            top: 150px;
            left: 100px;
            line-height: 100px;
            font-weight: bold;
            border: 1px solid #333;
            box-sizing: border-box;
            overflow: hidden;
        }
        
        
        
       
        
        
        /* pos guidelines */
        .moveable-normal.red {
            background: red!important;
        }
        /* gap guidelines */
        .moveable-gap.red {
            background: red!important;
        }
        /* When snapped to an element in elementGuidelines */
        .moveable-bold.red {
            background: red!important;
        }
        /* A dashed line between target and element */
        .moveable-dashed.red {
            border-top-color: red!important;
            border-left-color: red!important;
        }
        
        /* pos guidelines */
        .moveable-normal.green {
            background: green!important;
        }
        /* gap guidelines */
        .moveable-gap.green {
            background: green!important;
        }
        /* When snapped to an element in elementGuidelines */
        .moveable-bold.green {
            background: green!important;
        }
        /* A dashed line between target and element */
        .moveable-dashed.green {
            border-top-color: green!important;
            border-left-color: green!important;
        }
     `
}
