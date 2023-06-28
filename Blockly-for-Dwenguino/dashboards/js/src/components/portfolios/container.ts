import { css, CSSResultGroup, html, LitElement } from "lit";
import { store } from "../../state/store"
import { connect } from "pwa-helpers"
import {customElement, property } from 'lit/decorators.js';
import { Routes } from "@lit-labs/router";

import "./edit"
import "./graph_portfolio"
import { getMyPortfolios, getMyStudentPortfolios, getPortfolio } from "../../state/features/portfolio_slice";
import { localized } from "@lit/localize";

@localized()
@customElement("dwengo-dashboard-page-container")
class DashboardPageContainer extends connect(store)(LitElement){


    @property({type: Object})
    portfolioState: any = store.getState().portfolio
    @property({type: Object})
    userInfo: any = store.getState().user

    private _routes = new Routes(this, [
        {
            path: '/mine', 
            enter: async (params) => {
                store.dispatch(getMyPortfolios())
                return true
            }, 
            render: () => html`<dwengo-portfolios-list></dwengo-portfolios-list>`
        },
        {
            path: '/sharedWithMe', 
            enter: async (params) => {
                store.dispatch(getMyStudentPortfolios())
                return true
            }, 
            render: () => html`<dwengo-portfolios-list></dwengo-portfolios-list>`
        },
        {
            path: '/edit/:uuid', 
            enter: async ({uuid}) => {
                if (!uuid){
                    return false
                }
                store.dispatch(getPortfolio(uuid))
                return true
            },
            render: ({uuid}) => html`
            <dwengo-graph-portfolio 
                .userInfo=${this.userInfo}
                .portfolioProp=${this.portfolioState.selectedPortfolio}>
            </dwengo-graph-portfolio>`},
        /*{path: '/edit/:uuid', render: ({uuid}) => html`<dwengo-edit-dashboard uuid=${uuid}></dwengo-edit-dashboard>`},*/
    ]);
    
    protected render() {
        return this._routes.outlet()
    }

    static styles?: CSSResultGroup = css`
    `
}