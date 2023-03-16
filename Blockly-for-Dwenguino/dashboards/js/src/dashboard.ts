import { LitElement, css, html, CSSResultGroup, unsafeCSS } from "lit";
import { customElement, state } from "lit/decorators.js"; // needs .js to transpile
import { Router } from "@lit-labs/router"
import { store } from "./state/store"
import { connect } from "pwa-helpers"

import "./components/header";
import "./components/intro_page"
import "./components/notify"
import "./components/user/welcome"
import "./components/menu"
import "./components/user/profile"
import "./components/classes/classes"
import "./components/classes/class"
import "./components/classes/student_classes"
import "./components/savedprograms/list"

// Polyfill URLPattern
import {URLPattern} from "urlpattern-polyfill";
// @ts-ignore: Property 'UrlPattern' does not exist 
globalThis.URLPattern = URLPattern

@customElement("dwengo-dashboard")
class Dashboard extends connect(store)(LitElement) {
    private urlPrefixRegex: RegExp = /^((http[s]?|ftp):\/)?\/?([^:\/\s]+)(\/(.*))$/
    private urlPrefixArray: RegExpMatchArray | null = globalSettings?.hostname?.match(this.urlPrefixRegex)
    private urlPrefix: string = this.urlPrefixArray ? this.urlPrefixArray[4] : ""

    @state() selectedId: string = "home"

    private router = new Router(this, [
        {path: `${this.urlPrefix}/dashboard`, enter: async () => {this.selectedId = "home"; return true}, render: () => html`<dwengo-welcome-page></dwengo-welcome-page>`},
        {path: `${this.urlPrefix}/dashboard/home`, enter: async () => {this.selectedId = "home"; return true}, render: () => html`<dwengo-welcome-page></dwengo-welcome-page>`},
        {path: `${this.urlPrefix}/dashboard/profile`, enter: async () => {this.selectedId ="profile"; return true}, render: () => html`<dwengo-profile-page></dwengo-profile-page>`},
        {path: `${this.urlPrefix}/dashboard/classes*`, enter: async () => {this.selectedId = "classgroups"; return true}, render: () => html`<dwengo-classes-page></dwengo-classes-page>`},
        {path: `${this.urlPrefix}/dashboard/studentclasses`, enter: async () => {this.selectedId = "studentclassgroups"; return true}, render: () => html`<dwengo-student-classes-page></dwengo-student-classes-page>`},
        //{path: `${this.urlPrefix}/dashboard/class/:uuid`, render: ({uuid}) => html`<dwengo-class-page uuid="${uuid}"></dwengo-class-page>`},
        {path: `${this.urlPrefix}/dashboard/savedprograms`, enter: async () => {this.selectedId = "savedprograms"; return true}, render: ({uuid}) => html`<dwengo-saved-programs-list></dwengo-saved-programs-list>`}
    ]);

    createRenderRoot() {
        return this; // turn off shadow dom to access external styles
      }

    @state() loggedIn: boolean = false;

    stateChanged(state: any): void {
        this.loggedIn = state.user.loggedIn
    }

    protected render() {
        return html`<dwengo-notify></dwengo-notify>
                    <dwengo-menu selectedId="${this.selectedId}">
                        ${this.loggedIn ? html`${this.router.outlet()}` : html`<dwengo-intro-page></dwengo-intro-page>`}
                    </dwengo-menu>`
                    
    }

    static styles?: CSSResultGroup = css`
        
        :host {
            display: flex;
            flex-direction: row;
            align-items: stretch;
        }
        dwengo-welcome-page {
            flex-grow: 1;
        }
        dwengo-profile-page {
            flex-grow: 1;
        }
        dwengo-classes-page {
            flex-grow: 1;
        }
        dwengo-class-page {
            flex-grow: 1;
        }
        
    `
}


export default Dashboard