import { LitElement, css, html, CSSResultGroup } from "lit";
import { customElement, state } from "lit/decorators.js"; // needs .js to transpile
import { Router } from "@lit-labs/router"
import { store } from "./state/store"
import { connect } from "pwa-helpers"

import "./components/header";
import "./components/intro_page"
import "./components/notify"
import "./components/content_page"

@customElement("dwengo-dashboard")
class Dashboard extends connect(store)(LitElement) {
    private router = new Router(this, [
        { path: "/dashboard", render: () => {return html`<dwengo-content-page></dwengo-content-page>` }},
        { path: '/dashboard/*', render: () => {return html`<dwengo-content-page></dwengo-content-page>` }},
    ]);

    static styles?: CSSResultGroup = css``

    @state() loggedIn: boolean = false;

    stateChanged(state: any): void {
        this.loggedIn = state.user.loggedIn
    }

    protected render() {
        return html`<dwengo-notify></dwengo-notify>
                    <dwengo-header></dwengo-header>
                    ${this.loggedIn ? this.router.outlet() : html`<dwengo-intro-page></dwengo-intro-page>`}`
    }
}


export default Dashboard