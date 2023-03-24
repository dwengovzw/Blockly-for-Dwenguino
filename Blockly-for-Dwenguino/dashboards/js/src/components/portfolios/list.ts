/**
 * @author Tom Neutens <tomneutens@gmail.com>
 */

import { LitElement, css, html, CSSResultGroup } from "lit";
import {customElement, property, state} from 'lit/decorators.js';
import { store } from "../../state/store"
import { msg } from '@lit/localize';
import { connect } from "pwa-helpers"
import { getGoogleMateriaIconsLinkTag } from "../../util"
import { PortfolioItemInfo, getMyPortfolios } from "../../state/features/portfolio_slice";


@customElement('dwengo-portfolios-list')
class DwengoPortfoliosList extends connect(store)(LitElement) {
    @state() portfolios: PortfolioItemInfo[] = []

    stateChanged(state: any){
        this.portfolios = structuredClone(state.portfolio.portfolioList)
    }

    connectedCallback(): void {
        super.connectedCallback()
        store.dispatch(getMyPortfolios())
    }

    protected render() {
        return html`
        <ul>
            ${this.portfolios.map((portfolio) => html`
                <li>
                    <a href="/portfolio/${portfolio.uuid}">${portfolio.name}</a>
                </li>
            `)}
        </ul>`
    }

}

export { DwengoPortfoliosList }


