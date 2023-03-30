/**
 * @author Tom Neutens <tomneutens@gmail.com>
 */

import { LitElement, css, html, CSSResultGroup } from "lit";
import {customElement, property, state} from 'lit/decorators.js';
import { store } from "../../../state/store"
import { msg } from '@lit/localize';
import { connect } from "pwa-helpers"
import { getGoogleMateriaIconsLinkTag } from "../../../util"
import { TextItemInfo } from "../../../state/features/portfolio_slice";


@customElement("dwengo-portfolio-text-item")
class PortfolioTextItem extends connect(store)(LitElement) {
    @property({type: Object}) 
    item: TextItemInfo | null = null

    protected render() {
        return html`
            <div class="portfolio_text_item" dragable=true>
                ${this.item?.name}
            </div>
        `
    }

    static styles?: CSSResultGroup = css`
       
    `

}

export { PortfolioTextItem }