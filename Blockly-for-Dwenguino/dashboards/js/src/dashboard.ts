import { LitElement, css, html, CSSResultGroup, unsafeCSS } from "lit";
import { customElement, state } from "lit/decorators.js"; // needs .js to transpile
import { Router } from "@lit-labs/router"
import { store } from "./state/store"
import { connect } from "pwa-helpers"

import "./components/header";
import "./components/intro_page"
import "./components/notify"
import "./components/content_page"
import "./components/welcome"

// Polyfill URLPattern
import {URLPattern} from "urlpattern-polyfill";
// @ts-ignore: Property 'UrlPattern' does not exist 
globalThis.URLPattern = URLPattern

@customElement("dwengo-dashboard")
class Dashboard extends connect(store)(LitElement) {
    private urlPrefixRegex: RegExp = /^((http[s]?|ftp):\/)?\/?([^:\/\s]+)(\/(.*))$/
    private urlPrefixArray: RegExpMatchArray | null = globalSettings?.hostname?.match(this.urlPrefixRegex)
    private urlPrefix: string = this.urlPrefixArray ? this.urlPrefixArray[4] : ""

    private router = new Router(this, [
        { path: `${this.urlPrefix}/dashboard`, render: () => {return html`<dwengo-welcome-page></dwengo-welcome-page>` }},
        { path: `${this.urlPrefix}/dashboard/*`, render: () => {return html`<dwengo-content-page></dwengo-content-page>` }},
    ]);

    createRenderRoot() {
        return this; // turn off shadow dom to access external styles
      }

    static styles?: CSSResultGroup = [ css``]

    @state() loggedIn: boolean = false;

    stateChanged(state: any): void {
        this.loggedIn = state.user.loggedIn
    }

    protected render() {
        return html`<dwengo-notify></dwengo-notify>
                    <dwengo-menu>
                        ${this.loggedIn ? this.router.outlet() : html`<dwengo-intro-page></dwengo-intro-page>`}
                    </dwengo-menu>`
                    
    }
}


export default Dashboard