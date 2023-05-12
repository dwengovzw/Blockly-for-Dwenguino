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
import "./components/portfolios/list"
import "./components/portfolios/container"

// Polyfill URLPattern
import {URLPattern} from "urlpattern-polyfill";
import { getAllClassGroups } from "./state/features/class_group_slice";
import { getAllStudentClassGroups } from "./state/features/student_class_group_slice";
// @ts-ignore: Property 'UrlPattern' does not exist 
globalThis.URLPattern = URLPattern

@customElement("dwengo-dashboard")
class Dashboard extends connect(store)(LitElement) {
    private urlPrefixRegex: RegExp = /^((http[s]?|ftp):\/)?\/?([^:\/\s]+)(\/(.*))$/
    private urlPrefixArray: RegExpMatchArray | null = globalSettings?.hostname?.match(this.urlPrefixRegex)
    private urlPrefix: string = this.urlPrefixArray ? this.urlPrefixArray[4] : ""

    @state() selectedId: string = "home"

    @state() globalState: any = store.getState()

    private router = new Router(this, [
        {
            path: `${this.urlPrefix}/dashboard`, 
            enter: async () => {
                this.selectedId = "home"; 
                return true
            }, 
            render: () => html`<dwengo-welcome-page .userInfo=${this.globalState.user}></dwengo-welcome-page>`
        },
        {
            path: `${this.urlPrefix}/dashboard/home`, 
            enter: async () => {this.selectedId = "home"; return true}, 
            render: () => html`<dwengo-welcome-page .userInfo=${this.globalState.user}></dwengo-welcome-page>`
        },
        {
            path: `${this.urlPrefix}/dashboard/profile`, 
            render: () => html`<dwengo-profile-page .userInfo=${this.globalState.user}></dwengo-profile-page>`,
            enter: async () => {
                this.selectedId ="profile"; 
                return true
            }, 
        },
        {
            path: `${this.urlPrefix}/dashboard/classes*`, 
            enter: async () => {
                this.selectedId = "classgroups"; 
                store.dispatch(getAllClassGroups()); 
                return true
            }, 
            render: () => html`<dwengo-classes-page
                                    .groups=${this.globalState.classGroup.groups}
                                    .currentGroup=${this.globalState.classGroup.currentGroup}
                                    .assignmentGroups=${this.globalState.assignments.groups}></dwengo-classes-page>`
        },
        {
            path: `${this.urlPrefix}/dashboard/studentclasses`, 
            enter: async () => {
                this.selectedId = "studentclassgroups"; 
                store.dispatch(getAllStudentClassGroups()); 
                return true
            }, 
            render: () => html`
                <dwengo-student-classes-page 
                    .groups=${this.globalState.studentClassGroup.groups} 
                    .pending=${this.globalState.studentClassGroup.pending}>
                </dwengo-student-classes-page>`
        },
        {
            path: `${this.urlPrefix}/dashboard/savedprograms`, 
            enter: async () => {
                this.selectedId = "savedprograms"; 
                return true
            }, 
            render: ({uuid}) => html`<dwengo-saved-programs-list
                    .savedPrograms=${this.globalState.savedPrograms.programs}>
                </dwengo-saved-programs-list>`
        },
        {
            path: `${this.urlPrefix}/dashboard/portfolios*`, 
            enter: async () => {
                this.selectedId = "portfolios"; 
                return true
            }, 
            render: ({uuid}) => html`
                <dwengo-dashboard-page-container
                    .userInfo=${this.globalState.user}
                    .portfolioState=${this.globalState.portfolio}>
                </dwengo-dashboard-page-container>`
        },
    ]);

    createRenderRoot() {
        return this; // turn off shadow dom to access external styles
      }


    stateChanged(state: any): void {
        this.globalState = state
    }

    protected render() {
        console.log(this.globalState.notification);
        return html`<dwengo-notify .notificationState=${this.globalState.notification}></dwengo-notify>
                    <dwengo-menu 
                        .userInfo=${this.globalState.user}
                        .loading=${this.globalState.notification.loading}
                        .selectedId="${this.selectedId}">
                        ${this.globalState.user.loggedIn ? html`${this.router.outlet()}` : html`<dwengo-intro-page></dwengo-intro-page>`}
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