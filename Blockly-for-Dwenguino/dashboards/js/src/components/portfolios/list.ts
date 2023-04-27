/**
 * @author Tom Neutens <tomneutens@gmail.com>
 */

import { LitElement, css, html, CSSResultGroup } from "lit";
import {customElement, property, state} from 'lit/decorators.js';
import { store } from "../../state/store"
import { msg } from '@lit/localize';
import { connect } from "pwa-helpers"
import { getGoogleMateriaIconsLinkTag } from "../../util"
import { PortfolioInfo, getMyPortfolios, getPortfolios } from "../../state/features/portfolio_slice";


import { columnBodyRenderer } from '@vaadin/grid/lit.js';
import '@vaadin/grid';

@customElement('dwengo-portfolios-list')
class DwengoPortfoliosList extends connect(store)(LitElement) {
    @state() portfolios: PortfolioInfo[] = []

    stateChanged(state: any){
        this.portfolios = structuredClone(state.portfolio.portfolioList)
    }

    connectedCallback(): void {
        super.connectedCallback()
    }

    protected render() {
        return html`
        ${getGoogleMateriaIconsLinkTag()}
        <vaadin-grid .items="${this.portfolios}">
                <vaadin-grid-sort-column
                    path="name"
                    header="${msg("Name")}"
                    ${columnBodyRenderer(
                        (portfolio: PortfolioInfo) => html`
                        <span class="portfolio_name_container" style="display: flex;align-items: center;column-gap: 1rem;">
                            <span class="material-symbols-outlined portfolio_icon">
                                ${portfolio.shared ? html`group` : html`menu_book`}
                            </span>
                            <span>${portfolio.name}</span> 
                        </span>`,
                            
                        []
                    )}
                    >
                </vaadin-grid-sort-column>
                <vaadin-grid-sort-column flex-grow="10" path="description" header="${msg("Description")}"></vaadin-grid-sort-column>
                <vaadin-grid-sort-column 
                    path="lastEdited"
                    header="${msg("Edited")}"
                    ${columnBodyRenderer(
                        (portfolio: PortfolioInfo) => html`
                            ${new Date(portfolio.lastEdited).toLocaleDateString()}`,
                        []
                    )}
                    >
                </vaadin-grid-sort-column>
                <vaadin-grid-column
                auto-width
                flex-grow="0"
                ${columnBodyRenderer(
                    (portfolio: PortfolioInfo) => html`
                        <a href="${globalSettings.hostname}/dashboard/portfolios/edit/${portfolio.uuid}">
                            <vaadin-button 
                                theme="primary" 
                                class="item">
                                <span class="material-symbols-outlined">
                                    edit
                                </span>
                            </vaadin-button>
                        </a>`,
                    []
                )}
                ></vaadin-grid-column>
            </vaadin-grid>`
    }
    static styles?: CSSResultGroup = css`
        portfolio_name_container {
            display: flex;
            align-items: center;
            row-gap: 5px;
        }

    `

}

export { DwengoPortfoliosList }


