import { css, CSSResultGroup, html, LitElement } from "lit";
import { store } from "../../state/store"
import { connect } from "pwa-helpers"
import {customElement, property, state} from 'lit/decorators.js';
import { getPortfolio, PortfolioInfo, PortfolioItemInfo, setSelectedPortfolioItems } from "../../state/features/portfolio_slice";
import { msg } from "@lit/localize";

import "./items/item"
import "./items/droptarget"

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

    updateOrder(fromIndex, toIndex){
        console.log("Update order!");
        console.log(fromIndex, toIndex)
        if (!this.portfolio) return
        let newItems: PortfolioItemInfo[] = []
        for (const [i, value] of this.portfolio?.items?.entries()) {
            if (i == fromIndex){
                continue    // Skip the item that is being moved
            }
            if (i == toIndex){
                newItems.push(this.portfolio?.items[fromIndex]) // Add the item that is being moved
            }
            newItems.push(value)    // Add the other items
        }
        if (toIndex == this.portfolio?.items.length){
            newItems.push(this.portfolio?.items[fromIndex]) // Add the item that is being moved
        }
        store.dispatch(setSelectedPortfolioItems(newItems))
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
                ${this.portfolio?.items.map( (item, index) => html`
                    <dwengo-portfolio-item 
                        index=${index}
                        item="${JSON.stringify(item)}"
                        @orderchanged=${e => {
                            this.updateOrder(e.detail.fromIndex, e.detail.toIndex)
                            return false
                        }}>
                    </dwengo-portfolio-item>`)}
                    <dwengo-drop-target 
                        index=${this.portfolio?.items.length}
                        @orderchanged=${e => {
                            this.updateOrder(e.detail.fromIndex, e.detail.toIndex)
                            return false
                        }}
                    ></dwengo-drop-target>
            </div>
            `
    }

    static styles?: CSSResultGroup = css`
        .item_list_container{
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: stretch;
        }
    `
}