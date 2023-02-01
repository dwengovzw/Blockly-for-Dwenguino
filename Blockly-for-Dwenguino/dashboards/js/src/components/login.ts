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
    static styles?: CSSResultGroup = css`
    :host {
        margin: auto 0;
    }
    .dwengo-login-menu-icon {
        color: --theme-accentFillSelected;
        width: 50px;
        height: 50px;
        font-size: 50px;
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
        background-color: var(--theme-white);
        border-radius: 5px;
        border: 2px solid var(--theme-accentFillRest);
        box-shadow: 5px 5px 10px var(--theme-accentFillSelected);
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
    .dwengo-login-menu-dropdown li a {
        display: inline-block;
        box-sizing: border-box;
        text-decoration: none;
        padding: 5px 20px;
        width: 100%;
        text-align: center;
        border: 1px solid transparent;
        border-radius: 0.25rem;
        line-height: 1.5;
        background-color: var(--theme-accentFillRest);
        color: var(--theme-white);
    }
    .dwengo-login-menu-dropdown li a:visited {
        color: var(--theme-white);
    }
    .dwengo-login-menu-dropdown .login-title{
        font-size: 2rem;
    }
    `
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
                <span class='loggedin-item'>${msg("Welcome")} ${this.name}</span>
                <span class='loggedin-item'><a href='/dashboard/profile'>${msg("View profile")}</a></span>
                <span class='loggedin-item'><a rel="external" href='/oauth/logout'>${msg("Logout")}</a></span>
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
}

export default LoginMenu