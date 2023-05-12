/**
 * @author Tom Neutens <tomneutens@gmail.com>
 */

import { LitElement, css, html, CSSResultGroup } from "lit";
import {customElement, property, state} from 'lit/decorators.js';
import { store } from "../../state/store"
import { msg } from '@lit/localize';
import { connect } from "pwa-helpers"
import { getGoogleMateriaIconsLinkTag } from "../../util"
import { UserInfo } from "../../state/features/user_slice"

import "../menu"



@customElement("dwengo-welcome-page")
class WelcomePage extends connect(store)(LitElement) {
    
    @property({type: Object}) 
    userInfo: UserInfo | null = store.getState().user
    
    protected render() {
        return html`
            <h1>${msg("Welcome")} ${this.userInfo?.firstname} ${this.userInfo?.lastname}
        `
    }

    static styles?: CSSResultGroup = css`
        :host {
            padding: var(--theme-main-page-margin);
            margin: 0;
        }
    `
}

export default WelcomePage