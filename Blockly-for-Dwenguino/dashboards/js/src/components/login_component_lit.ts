/**
 * @author Tom Neutens <tomneutens@gmail.com>
 */

import { LitElement, css, html, CSSResultGroup } from "lit";
import {customElement, state} from 'lit/decorators.js';
import { store } from "../state/store"
import { Unsubscribe } from "redux";
import { connect } from "pwa-helpers"
import { addPlatform, fetchPlatforms } from "../state/features/oauth_slice";



@customElement("dwengo-login-menu")
class LoginMenu extends connect(store)(LitElement) {
    static styles?: CSSResultGroup = css`
    `
    @state() loggedIn: boolean = false;
    @state() sessionToken: string = "";
    @state() username: string = "";
    @state() originalRequestInfo: string = "";
    @state() platforms: string[] = []

    stateChanged(state: any): void {
        this.platforms = state.oauth.platforms
    }

    constructor(){
        super();
        fetch("/user/isLoggedIn").then(async (response) => {
          if (response.status == 200){
            this.loggedIn = true;
            this.username = await response.text();
          } else {
            this.loggedIn = false;
          }
          
        }).catch((e) => {
          console.log(e);
        })
        const params:URLSearchParams = new URLSearchParams(window.location.search);
        let reqInfo:string = params.get("originalRequestInfo")?.toString() as string;
        if (reqInfo){
          this.originalRequestInfo = `&originalRequestInfo=${reqInfo}`
        } 
        store.dispatch(fetchPlatforms())
    }

    getLoginURI(platform: string, originalRequestInfo:string){
        return `/oauth/login?platform=${platform}${originalRequestInfo}`
    }


    protected render() {
        return html`<div>
            platforms:
            <ul>
                ${this.platforms.map(p => html`<li><a href="${this.getLoginURI(p, this.originalRequestInfo)}">${p}</a></li>`)}
            </ul>
        </div>
        ${this.loggedIn ? html`You are logged in. <a href='/oauth/logout'>Logout</a>` : html`Not logged in yet`}`
        /*if (!this.loggedIn){
            return html`
            <a href="/oauth/login?platform=leerId${this.originalRequestInfo}"><button id="loginbutton" type="primary"
              className="btn"
              size="lg">
                Login
            </button></a>
            ${this.platforms.forEach(p => html`${p}`)}
          `
        } else {
            return html`<span>${this.username}</span`
        }*/
    }
}

export default LoginMenu