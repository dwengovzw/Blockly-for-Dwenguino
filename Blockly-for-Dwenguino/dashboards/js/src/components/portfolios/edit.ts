import { css, CSSResultGroup, html, LitElement } from "lit";
import { store } from "../../state/store"
import { connect } from "pwa-helpers"
import {customElement, property, state} from 'lit/decorators.js';
import { getPortfolio, PortfolioInfo, PortfolioItemInfo } from "../../state/features/portfolio_slice";
import { msg } from "@lit/localize";

import "./items/item"

@customElement("dwengo-edit-dashboard")
class EditDashboard extends connect(store)(LitElement){

    @property() uuid: string = ""

    @state() portfolio: PortfolioInfo | null

    constructor(){
        super()
        this.portfolio = null
        
    }

    stateChanged(state: any){
        console.log(state)
        this.portfolio = structuredClone(state.portfolio.selectedPortfolio)
    }

    connectedCallback(): void {
        super.connectedCallback()
        store.dispatch(getPortfolio(this.uuid))
    }

    protected render() {
        return html`
            <h1>${this.portfolio?.name}</h1>
            <span class="material-symbols-outlined portfolio_icon">
                ${this.portfolio?.shared ? html`group` : html``}
            </span>
            <p>${this.portfolio?.description}</p>
            <div class="item_list_container"
                >
                ${this.portfolio?.items.map( item => html`
                    <dwengo-portfolio-item 
                        item="${JSON.stringify(item)}">
                        @drag=${e => null}
                    </dwengo-portfolio-item>`)}
            </div>
            `
    }

    static styles?: CSSResultGroup = css`
        .item_list_container{
            display: flex;
            flex-direction: column;
            gap: 1rem;
            justify-content: center;
            align-items: stretch;
        }
    `
}