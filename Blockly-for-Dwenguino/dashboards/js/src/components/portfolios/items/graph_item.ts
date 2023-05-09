/**
 * @author Tom Neutens <tomneutens@gmail.com>
 */

import { LitElement, css, html, CSSResultGroup } from "lit";
import {customElement, property, state} from 'lit/decorators.js';
import { store } from "../../../state/store"
import { msg } from '@lit/localize';
import { connect } from "pwa-helpers"
import { getGoogleMateriaIconsLinkTag } from "../../../util"
import { noselect } from "../../../styles/shared";
import { deletePortfolioItem, PortfolioItemInfo } from "../../../state/features/portfolio_slice";

@customElement("dwengo-graph-portfolio-item")
class PortfolioItem extends connect(store)(LitElement) {
    @property({type: Object}) 
    item: PortfolioItemInfo | null = null 
    @property({type: String})
    portfolioUUID = ""

    @state() showDialog = false

    private itemToIconMap = {
        "TextItem": "text_fields",
        "BlocklyProgSequenceItem": "code_blocks",
        "SocialRobotDesignItem": "draw",
        "default": "unknown_med"
    }

    mapItemToElement(){
        const itemType: string = this.item?.__t || ""
        switch(itemType){
            case "TextItem":
                return html`<dwengo-portfolio-text-item portfolioUUID=${this.portfolioUUID} item=${JSON.stringify(this.item)}></dwengo-portfolio-text-item>`
            case "BlocklyProgSequenceItem":
                return html`<dwengo-portfolio-blockly-code-item portfolioUUID=${this.portfolioUUID} item=${JSON.stringify(this.item)}></dwengo-portfolio-blockly-code-item>`
            case "SocialRobotDesignItem":
                return html`<dwengo-portfolio-socialrobot-design-item portfolioUUID=${this.portfolioUUID} item=${JSON.stringify(this.item)}></dwengo-portfolio-socialrobot-design-item>`
            default:    
                return html`${msg("Unknown item type")}`
        }
    }

    protected render() {
        return html`
            <div 
                @mouseup=${this.onMouseUp}
                class="container noselect">
                ${getGoogleMateriaIconsLinkTag()}
                <div class="item_header">
                    <span class="material-symbols-outlined portfolio_item_handle"
                        @mousedown=${this.onMouseDown}
                    >
                        drag_indicator
                    </span>
                    <span class="material-symbols-outlined portfolio_add_feedback">
                        ${this.itemToIconMap[this.item?.__t || "default"]}
                    </span>
                    <span 
                        class="material-symbols-outlined portfolio_add_feedback"
                        @click=${this.handleItemDetailClick}>
                            info
                    </span>
                    <span class="material-symbols-outlined portfolio_add_feedback">
                        rate_review
                    </span>
                    
                </div>
            </div>
            ${this.showDialog ? this.renderItemDetailModal() : ""}
            
        `
    }



    handleItemDetailClick(e){
        const itemType: string = this.item?.__t || ""
        switch(itemType){
            case "TextItem":
                this.showDialog = true
            case "BlocklyProgSequenceItem":
                return html`<dwengo-portfolio-blockly-code-item portfolioUUID=${this.portfolioUUID} item=${JSON.stringify(this.item)}></dwengo-portfolio-blockly-code-item>`
            case "SocialRobotDesignItem":
                console.log("Not supported yet")
            default:    
                return html`${msg("Unknown item type")}`
        }
    }

    renderItemDetailModal(){
        return html`
            <dialog open=true class="item_detail_modal">
                ${this.mapItemToElement()}
            </dialog>`
    }

    onMouseDown(e){
        this.dispatchEvent(
            new CustomEvent(
                "dragHandlerMouseDown", 
                {
                    bubbles: true, 
                    composed: true, 
                    detail: {offsetX: e.offsetX, offsetY: e.offsetY}
                }
            )
        )
    }

    onMouseUp(e) {
        this.dispatchEvent(
            new CustomEvent(
                "dragHandlerMouseUp",
                {
                    bubbles: true,
                    composed: true,
                    detail: {offsetX: e.offsetX, offsetY: e.offsetY}
                }
            )
        )
    }

    static styles: CSSResultGroup = [css`
        .portfolio_item_handle {
            cursor: move;
        }
        .portfolio_add_feedback {
            background-color: var(--theme-accentFillActive);
            border-radius: 2.5px;
            padding: 2.5px;
        }
        `, noselect]

}

export { PortfolioItem }