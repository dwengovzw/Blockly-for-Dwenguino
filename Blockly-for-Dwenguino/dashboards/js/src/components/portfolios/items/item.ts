/**
 * @author Tom Neutens <tomneutens@gmail.com>
 */

import { LitElement, css, html, CSSResultGroup } from "lit";
import {customElement, property, state} from 'lit/decorators.js';
import { store } from "../../../state/store"
import { msg } from '@lit/localize';
import { connect } from "pwa-helpers"
import { getGoogleMateriaIconsLinkTag } from "../../../util"
import { PortfolioItemInfo } from "../../../state/features/portfolio_slice";

import "./text_item"
import "./droptarget"

@customElement("dwengo-portfolio-item")
class PortfolioItem extends connect(store)(LitElement) {
    @property({type: Object}) 
    item: PortfolioItemInfo | null = null
    @property({type: Number}) index = 0

    @state() draggable: boolean = false
    @state() hidden: boolean = false
    @state() x: number = 0
    @state() y: number = 0

    // TODO: Rethink this approach
    mapItemToElement(){
        const itemType: string = this.item?.__t || ""
        switch(itemType){
            case "TextItem":
                return html`<dwengo-portfolio-text-item item=${JSON.stringify(this.item)}></dwengo-portfolio-text-item>`
            // TODO: add other item types
            default:    
                return html`${msg("Unknown item type")}`
        }
    }

    handleDrag(e){
        

    }

    protected render() {
        console.log("Rendering....");
        return html`
            <div class="container ${this.hidden ? "hidden" : "shown"}">
                ${getGoogleMateriaIconsLinkTag()}
                <dwengo-drop-target index=${this.index}></dwengo-drop-target>
                <div class="portfolio_item"
                    draggable="${this.draggable}"
                    @dragstart=${ e => { 
                            e.dataTransfer.effectAllowed = "move";
                            e.dataTransfer.setData("text/plain", JSON.stringify(this.index));
                            setTimeout(_ => { this.hidden = true }, 0)
                        }
                    }
                    @dragend=${ _ => { this.draggable = false; this.hidden = false }}
                    @dragover=${ e => {
                        e.preventDefault();
                        return false
                    }}
                    >
                    <span class="material-symbols-outlined portfolio_item_handle"
                        @mousedown=${_ => this.draggable = true}>
                        drag_indicator
                    </span>
                    <div class="portfolio_item_content">
                        ${this.mapItemToElement()}
                    </div>
                </div>
            </div>
        `
    }

    static styles?: CSSResultGroup = css`
        .portfolio_item{
            display: flex;
            align-items: center;
            column-gap: 0.75rem;
            padding: 0.5rem;
            border-radius: 0.5rem;
            margin: 0.5rem;
            background-color: var(--theme-neutralFillRest);
        }
        .portfolio_item_handle {
            cursor: move;
        }
        .portfolio_item_content {
            display: inline-block;
        }
        .hidden {
            display: none;
        }
        
        `

}