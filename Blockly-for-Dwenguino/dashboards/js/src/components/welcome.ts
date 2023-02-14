/**
 * @author Tom Neutens <tomneutens@gmail.com>
 */

import { LitElement, css, html, CSSResultGroup } from "lit";
import {customElement, state} from 'lit/decorators.js';
import { store } from "../state/store"
import { msg } from '@lit/localize';
import { connect } from "pwa-helpers"
import { getGoogleMateriaIconsLinkTag } from "../util"
import { UserInfo } from "../state/features/user_slice"

import "./menu"



@customElement("dwengo-welcome-page")
class WelcomePage extends connect(store)(LitElement) {
    
    @state() userInfo: UserInfo | null = null

    stateChanged(state: any): void {
        this.userInfo = state.user
    }

    constructor(){
        super();
    }

    
    protected render() {
        return html`
            <h1>${msg("Welcome")} ${this.userInfo?.firstname} ${this.userInfo?.lastname}
        `
    }

    static styles?: CSSResultGroup = css`
        :host {
            background-color: var(--theme-neutralFocusInnerAccent);
            padding: var(--theme-main-page-margin);
            margin: 0;
        }
    `
}

export default WelcomePage