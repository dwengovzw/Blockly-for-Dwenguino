import { css, CSSResultGroup, html, LitElement, PropertyValueMap } from "lit";
import { ref, Ref, createRef } from 'lit/directives/ref.js';
import { store } from "../../state/store"
import { connect } from "pwa-helpers"
import {customElement, property, state, query} from 'lit/decorators.js';
import { createPortfolioItem, getPortfolio, MinimalPortfolioItemInfo, PortfolioInfo, PortfolioItemInfo, savePortfolioItem, setSelectedPortfolioItems } from "../../state/features/portfolio_slice";
import { msg } from "@lit/localize";

import { LitMoveable } from "lit-moveable";

import "./items/moveable_item"

@customElement("dwengo-graph-dashboard")
class GraphDashboard extends connect(store)(LitElement){
    @property() uuid: string = ""
    @state() portfolio: PortfolioInfo | null = null

    @query(".container")
    container!: HTMLElement;

    stateChanged(state: any): void{
        console.log(state)
        this.portfolio = structuredClone(state.portfolio.selectedPortfolio)
    }

    connectedCallback(): void {
        super.connectedCallback()
        store.dispatch(getPortfolio(this.uuid))
    }

    render() {
        return html`
            <div class="root">
                <div class="container">
                <dwengo-moveable-item
                    x="10"
                    y="10"
                    width="100"
                    height="100">
                    <span>Slot content</span>
                </dwengo-moveable-item>     
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
 
    .root {
        position: relative;
    }

     `
}
