/**
 * @author Tom Neutens <tomneutens@gmail.com>
 */

import { LitElement, css, html, CSSResultGroup } from "lit";
import {customElement, property, state} from 'lit/decorators.js';
import { store } from "../../../state/store"
import { msg } from '@lit/localize';
import { connect } from "pwa-helpers"
import { getGoogleMateriaIconsLinkTag } from "../../../util"
import { deletePortfolioItem, PortfolioItemInfo } from "../../../state/features/portfolio_slice";

@customElement("dwengo-graph-portfolio-item")
class PortfolioItem extends connect(store)(LitElement) {
    @property({type: Object}) 
    item: PortfolioItemInfo | null = null 
    @property({type: String})
    portfolioUUID = ""

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
            <div class="container">
                ${getGoogleMateriaIconsLinkTag()}
                ${this.mapItemToElement()}
            </div>
        `
    }
}

export { PortfolioItem }