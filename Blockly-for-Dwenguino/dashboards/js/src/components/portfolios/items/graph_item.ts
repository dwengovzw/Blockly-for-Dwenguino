/**
 * @author Tom Neutens <tomneutens@gmail.com>
 */

import { LitElement, css, html, CSSResultGroup, PropertyValueMap } from "lit";
import {customElement, property, state, query} from 'lit/decorators.js';
import { store } from "../../../state/store"
import { msg } from '@lit/localize';
import { connect } from "pwa-helpers"
import { getGoogleMateriaIconsLinkTag } from "../../../util"
import { noselect } from "../../../styles/shared";
import { deletePortfolioItem, PortfolioItemInfo } from "../../../state/features/portfolio_slice";
import { buttonStyles, iconStyle } from "../../../styles/shared";

@customElement("dwengo-graph-portfolio-item")
class PortfolioItem extends connect(store)(LitElement) {
    @property({type: Object}) 
    item: PortfolioItemInfo | null = null 
    @property({type: String})
    portfolioUUID = ""

    @query(".item_detail_modal")
    itemDetailModal!: HTMLDialogElement

    private itemToIconMap = {
        "TextItem": "text_fields",
        "BlocklyProgSequenceItem": "code_blocks",
        "SocialRobotDesignItem": "draw",
        "default": "unknown_med"
    }

    protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
        super.firstUpdated(_changedProperties);
        this.itemDetailModal.addEventListener("click", (e) => {
            if(e.target === this.itemDetailModal){
                this.itemDetailModal.close()
            }
        })
        window.addEventListener("mouseup", (e) => {
            this.onMouseUp(e)
        })
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
            <div class="container noselect">
                ${getGoogleMateriaIconsLinkTag()}
                <div class="item_header">
                    <span class="material-symbols-outlined portfolio_item_handle"
                        @mousedown=${this.onMouseDown}
                    >
                        drag_indicator
                    </span>
                    <span class="material-symbols-outlined dwengo-icon">
                        ${this.itemToIconMap[this.item?.__t || "default"]}
                    </span>
                    <span 
                        class="material-symbols-outlined dwengo-icon"
                        @click=${this.handleItemDetailClick}>
                            info
                    </span>
                    <span class="material-symbols-outlined dwengo-icon">
                        rate_review
                    </span>
                    <span class="material-symbols-outlined  dwengo-icon">
                        adjust
                    </span>
                </div>
            </div>
            ${this.renderItemDetailModal()}
            
        `
    }



    handleItemDetailClick(e){
        const itemType: string = this.item?.__t || ""
        switch(itemType){
            case "TextItem":
            case "BlocklyProgSequenceItem":
                this.itemDetailModal.showModal()
                break
            case "SocialRobotDesignItem":
                console.log("Not supported yet")
                break
            default:    
                return html`${msg("Unknown item type")}`
        }
    }

    renderItemDetailModal(){
        return html`
            <dialog class="item_detail_modal">
                <div class="dialog_content_container">
                    <div class="dialog_header">
                        <form method="dialog">
                            <button type="submit" autofocus class="dwengo-button">
                                <span class="dwengo-button-icon material-symbols-outlined">
                                    close
                                </span>
                            </button>
                        </form>
                    </div>
                    <div class="dialog_content">
                        ${this.mapItemToElement()}
                    </div>
                </div>
                
                
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

        .item_detail_modal {
            padding: 0;
        }
        .portfolio_item_handle {
            cursor: move;
        }
        .dialog_content_container {
            min-width: 60vw;
            margin: 1rem;
        }
        .dialog_header {
            display: flex;
            position: absolute;
            justify-content: flex-end;
            width: calc(100% - 2rem);
            height: 35px;
        }
        `, noselect, buttonStyles, iconStyle]

}

export { PortfolioItem }