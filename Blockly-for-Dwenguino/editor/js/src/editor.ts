import { LitElement, css, html, CSSResultGroup } from "lit";
import { customElement, state } from "lit/decorators.js"; // needs .js to transpile

import "./components/menu_bar/menu"
import "../../../dashboards/js/src/components/notify"
import { store } from "./state/store"
import { connect } from "pwa-helpers"

// Polyfill URLPattern
import {URLPattern} from "urlpattern-polyfill";
// @ts-ignore: Property 'UrlPattern' does not exist 
globalThis.URLPattern = URLPattern

@customElement("dwengo-editor")
class DwengoEditor extends connect(store)(LitElement) {

    @state() globalState: any = store.getState()

    createRenderRoot() {
        return this; // turn off shadow dom to access external styles
    }

    stateChanged(state: any): void {
        this.globalState = state
    }

    protected render() {
        return html`
        
        <dwengo-notify .notificationState=${this.globalState.notification}></dwengo-notify>
        <div class="content">
            <dwengo-editor-menu .editorState=${this.globalState.editorState}></dwengo-editor-menu>
            ${this.globalState.editorState.view === "blocks" ? html`
            <div class="graphical_editor">
                <h1>Graphical editor</h1>
            </div>
            ` : html`
                <div class="textual_editor">
                    <h1>Textual editor</h1>
                </div>
            `}
        </div>
        `
    }

    static styles?: CSSResultGroup = css`
        .content {
            display: flex;
            flex-direction: column;
            align-items: stretch;
        }
        
    `
}


export default DwengoEditor