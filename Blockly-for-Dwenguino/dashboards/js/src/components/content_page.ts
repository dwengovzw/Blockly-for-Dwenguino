/**
 * @author Tom Neutens <tomneutens@gmail.com>
 */

import { LitElement, css, html, CSSResultGroup } from "lit";
import {customElement, state} from 'lit/decorators.js';
import { store } from "../state/store"
import { msg } from '@lit/localize';
import { connect } from "pwa-helpers"
import { getGoogleMateriaIconsLinkTag } from "../util"
import { Router, Routes } from "@lit-labs/router"

import "./menu"
import "./welcome"
import "./profile"
import "./classes/classes"
import "./classes/class"
import "./savedprograms/list"



@customElement("dwengo-content-page")
class ContentPage extends connect(store)(LitElement) {
    
    private router = new Routes(this, [
        {path: 'home', render: () => html`<dwengo-welcome-page></dwengo-welcome-page>`},
        {path: 'profile', render: () => html`<dwengo-profile-page></dwengo-profile-page>`},
        {path: 'classes', render: () => html`<dwengo-classes-page></dwengo-classes-page>`},
        {path: 'class/:uuid', render: ({uuid}) => html`<dwengo-class-page uuid="${uuid}"></dwengo-class-page>`},
        {path: 'savedprograms', render: ({uuid}) => html`<dwengo-saved-programs-list></dwengo-saved-programs-list>`}
    ]);
    
    stateChanged(state: any): void {
        
    }

    constructor(){
        super();
    }

    
    protected render() {
        return html`
            <dwengo-menu></dwengo-menu>
            <div class="main_page">${this.router.outlet()}</div>
        `
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
        .main_page {
            padding: 1rem;
            width: 100%;
            box-sizing: border-box;
            margin: 30px auto;
            max-width: 1366px;
        }
    `
}

export default ContentPage