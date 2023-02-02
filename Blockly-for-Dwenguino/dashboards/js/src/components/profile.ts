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
import "@material/mwc-textfield"
import "@material/mwc-button"




@customElement("dwengo-profile-page")
class Profile extends connect(store)(LitElement) {
    @state() userInfo: UserInfo | null = null

    stateChanged(state: any): void {
        this.userInfo = state.user
    }

    constructor(){
        super();
    }

    
    protected render() {
        return html`
            <h1>${msg("Profile")} ${this.userInfo?.firstname} ${this.userInfo?.lastname}</h1>
            <div class="profile-info">
                <div><mwc-textfield outlined label="${msg("Firstname")}" type="text" value="${this.userInfo?.firstname}"></mwc-textfield></div>
                <div><mwc-textfield outlined label="${msg("Lastname")}" type="text" value="${this.userInfo?.lastname}"></mwc-textfield></div>
                <div><mwc-textfield outlined label="${msg("Email")}" type="email" value="${this.userInfo?.email}"></mwc-textfield></div>
                <div><mwc-textfield outlined label="${msg("Birthdate")}" type="date" value= "${this.userInfo?.birthdate}"></mwc-textfield></div>
                <div><mwc-textfield outlined label="${msg("You are logged in with")}" type="text" disabled="true" value= "${this.userInfo?.platform}"></mwc-textfield></div>
                <mwc-button outlined>${msg("Save")}</mwc-button>
            </div>
        `
    }

    static styles?: CSSResultGroup = css`
        :host{
            background-color: var(--theme-neutralFocusInnerAccent);
            padding: var(--theme-main-page-margin);
            margin: 0;
        }

        mwc-textfield {
            --mdc-theme-primary: var(--theme-accentFillSelected);
        }
        mwc-button {
            --mdc-theme-primary: var(--theme-accentFillSelected);
        }
        .profile-info div {
            margin: 1rem 0;
        }
    `
}

export default Profile