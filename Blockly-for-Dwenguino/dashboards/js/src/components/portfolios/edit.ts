import { css, CSSResultGroup, html, LitElement } from "lit";
import { store } from "../../state/store"
import { connect } from "pwa-helpers"
import {customElement, property, state} from 'lit/decorators.js';
import { createPortfolioItem, getPortfolio, MinimalPortfolioItemInfo, PortfolioInfo, PortfolioItemInfo, savePortfolioItem, setSelectedPortfolioItems } from "../../state/features/portfolio_slice";
import { msg } from "@lit/localize";

import "./items/item"
import "./items/droptarget"
import '@vaadin/button';

@customElement("dwengo-edit-dashboard")
class EditDashboard extends connect(store)(LitElement){

    @property() uuid: string = ""

    @state() portfolio: PortfolioInfo | null
    @state() showAddItem: boolean = false
    @state()
    itemTypes = [
        {value: "TextItem", label: msg("Text item")},
        {value: "ImageItem", label: msg("Image item")},
    ]

    private selectedItemType: string = this.itemTypes[0].value

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

    handleAddItem(){
        console.log(this.selectedItemType);
        let newItem: MinimalPortfolioItemInfo = {
            __t: this.selectedItemType,
            name: "New item",
        }
        store.dispatch(createPortfolioItem(this.uuid, newItem))
        this.showAddItem = false
    }

    renderAddItemDialog(){
        return html`
        <mwc-dialog 
            open="${this.showAddItem}"
            @closed=${_ => this.showAddItem = false }>
            <select 
                name="itemTypes" 
                id="itemTypes"
                @change="${(e: any) => {this.selectedItemType = e.target.value}}">
                    ${this.itemTypes.map((itemType) => {
                        return html`<option value="${itemType.value}">${itemType.label}</option>`
                    })}
            </select>
            <vaadin-button theme="primary" @click="${() => {this.handleAddItem()}}" slot="primaryAction" dialogAction="close">
                ${msg("Add")}
            </vaadin-button>
            <vaadin-button theme="primary" @click="${() => {this.showAddItem = false}}" slot="secondaryAction" dialogAction="close">
                ${msg("Cancel")}
            </vaadin-button>
        </mwc-dialog>
        `
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
                        portfolioUUID=${this.portfolio?.uuid}
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
            <div class="button_container">
                <vaadin-button theme="primary" @click="${() => {this.showAddItem = true}}">
                    ${msg("Add item")}
                </vaadin-button>
            </div>
            ${this.showAddItem ? this.renderAddItemDialog() : html``}
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