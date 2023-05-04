import { css, CSSResultGroup, html, LitElement } from "lit";
import { store } from "../../state/store"
import { connect } from "pwa-helpers"
import {customElement } from 'lit/decorators.js';
import { Routes } from "@lit-labs/router";

import "./edit"
import "./graph_dashboard"
import { getMyPortfolios, getMyStudentPortfolios } from "../../state/features/portfolio_slice";

@customElement("dwengo-dashboard-page-container")
class DashboardPageContainer extends connect(store)(LitElement){


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
        {path: '/edit/:uuid', render: ({uuid}) => html`<dwengo-graph-dashboard uuid=${uuid}></dwengo-graph-dashboard>`},
        /*{path: '/edit/:uuid', render: ({uuid}) => html`<dwengo-edit-dashboard uuid=${uuid}></dwengo-edit-dashboard>`},*/
    ]);
    
    protected render() {
        return this._routes.outlet()
    }

    static styles?: CSSResultGroup = css`
    `
}