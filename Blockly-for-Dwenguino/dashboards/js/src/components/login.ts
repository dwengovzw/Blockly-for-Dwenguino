/**
 * @author Tom Neutens <tomneutens@gmail.com>
 */

import { LitElement, css, html, CSSResultGroup } from "lit";
import {customElement, state} from 'lit/decorators.js';
import { store } from "../state/store"
import { msg } from '@lit/localize';
import { connect } from "pwa-helpers"
import { fetchPlatforms } from "../state/features/oauth_slice";
import { fetchUserInfo } from "../state/features/user_slice";
import { getGoogleMateriaIconsLinkTag } from "../util"



@customElement("dwengo-login-menu")
class LoginMenu extends connect(store)(LitElement) {
    
    @state() loggedIn: boolean = false;
    @state() name: string= "noname"
    @state() sessionToken: string = "";
    @state() username: string = "";
    @state() originalRequestInfo: string = "";
    @state() platforms: string[] = []
    @state() menuIsOpen: boolean;

    platformToLabelMap: Record<string, string> = {
        "github": msg("GitHub"),
        "leerId": msg("LeerID Flanders (students only)"),
        "beACM": msg("Flemish gouvernment")
    }

    stateChanged(state: any): void {
        this.platforms = state.oauth.platforms
        this.loggedIn = state.user.loggedIn
        this.name = state.user.firstname
    }

    constructor(){
        super();
        this.menuIsOpen = false;
        const params:URLSearchParams = new URLSearchParams(window.location.search);
        let reqInfo:string = params.get("originalRequestInfo")?.toString() as string;
        if (reqInfo){
          this.originalRequestInfo = `&originalRequestInfo=${reqInfo}`
        } 
        store.dispatch(fetchUserInfo())
        store.dispatch(fetchPlatforms())
    }

    getLoginURI(platform: string, originalRequestInfo:string){
        return `/oauth/login?platform=${platform}${originalRequestInfo}`
    }


    renderLoginMenuLoggedIn(){
        return html`<div>
                <span class='loggedin-item login-title'>${msg("Welcome")} ${this.name}</span>
                <span class='loggedin-item'><a href='${globalSettings.hostname}/dashboard/profile'>${msg("View profile")}</a></span>
                <span class='loggedin-item'><a rel="external" href='${globalSettings.hostname}/oauth/logout'>${msg("Logout")}</a></span>
            </div>` 
    }

    renderLoginMenuLoggedOut(){
        return html`<div>
            <span class="login-title">${msg("Login with")}</span>
            <ul>
                ${this.platforms.map(p => {
                    return html`<li><a rel="external" href="${this.getLoginURI(p, this.originalRequestInfo)}">${this.platformToLabelMap[p]}</a></li>`
                })}
            </ul>
        </div>`
    }

    renderLoginMenu(){
        return html`${!this.loggedIn ? this.renderLoginMenuLoggedOut() : this.renderLoginMenuLoggedIn()}`
    }
    
    protected render() {
        return html`
        ${getGoogleMateriaIconsLinkTag()}
        <span class="dwengo-login-menu-icon-container">
        <span @click=${() => this.menuIsOpen = !this.menuIsOpen } class="dwengo-login-menu-icon material-symbols-outlined">
            account_circle
        </span>
        ${this.loggedIn ? html`<span>${this.name}</span>` : ""}
        </span>
        ${this.menuIsOpen ? html`<div class='dwengo-login-menu-dropdown'>${this.renderLoginMenu()}</div>` : ""}
        `
    }

    static styles?: CSSResultGroup = css`
    :host {
        margin: auto 0;
    }
    .dwengo-login-menu-icon {
        color: --theme-accentFillSelected;
        font-size: 3rem;
        line-height: 1;
    }
    .dwengo-login-menu-icon:hover {
        cursor: pointer;
    }
    .dwengo-login-menu-icon-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: auto 0;
    }
    .dwengo-login-menu-dropdown{
        position: absolute;
        right: 10px;
        top: 75px;
        padding: 20px;
        border-radius: 4px;
        border: 2px solid var(--theme-accentFillRest);
        box-shadow: 5px 5px -5px var(--theme-accentFillSelected);
        background-color: var(--theme-neutralFocusInnerAccent);
        color: var(--theme-white);
        z-index: 1000;
    }
    .dwengo-login-menu-dropdown div {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .dwengo-login-menu-dropdown div .loggedin-item {
        margin: 0.75rem 1rem;
    }

    .dwengo-login-menu-dropdown ul {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0;
        margin: 5px;
    }
    .dwengo-login-menu-dropdown li {
        list-style: none;
        box-sizing: border-box;
        margin-top: 20px;
        width: 100%;
    }
    .dwengo-login-menu-dropdown a {
        display: inline-block;
        box-sizing: border-box;
        text-decoration: none;
        padding: 5px 20px;
        width: 100%;
        text-align: center;
        border: 1px solid transparent;
        border-radius: 0.25rem;
        line-height: 1.5;
        background-color: var(--theme-accentFillSelected);
        color: var(--theme-white);
    }
    .dwengo-login-menu-dropdown a:visited {
        color: var(--theme-white);
    }
    .dwengo-login-menu-dropdown .login-title{
        font-size: 2rem;
        color: var(--theme-black);
    }
    `
}

export default LoginMenu